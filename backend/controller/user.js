const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create a new user with file upload and delete old file if exists
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    // get the value of the user and find from database
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    // if user already exists
    if (userEmail) {
      // if the user exists the code removes the uploaded file from the server's file system
      const fileName = req.file.filename;
      const filePath = `uploads/${fileName}`;
      fs.unlink(filePath, function (err) {
        if (err) {
          console.log("Error deleting old file:", err);
          res.status(500).json({ message: "Error deleting old file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }
    //  we need to get the uploaded file and join the file to the path
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    // create a variable to save the user info with the uploaded file
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };
    // create the activation token && url for the user
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    // send email with activation link
    try {
      await sendMail({
        email: user.email,
        subject: "Account Activation Link",
        message: `Please click the following link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message:
          "User created successfully, please check your email for activation link",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});
// create the token for user with the activation secret
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // get the token from the frontend by body
      const { activation_token } = req.body;
      // verify the token with the activation secret
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      // check if the token has been activated
      if (!newUser) {
        return next(new ErrorHandler("Invalid activation token", 400));
      }
      // check the user if exist in database
      const { name, email, password, avatar } = newUser;
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      //  create the user in database
      user = await User.create({
        name,
        email,
        password,
        avatar,
      });
      // send the token to the client with the user info
      sendToken(user, 201, res);
    } catch (err) {
      console.log("here");
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

// login
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid password!", 400));
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// logout user
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({ success: true, message: "User logged out" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user information
router.put(
  "/update-user-info",
  isAuthenticated,

  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      const isPasswordValid = user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid password!", 400));
      }
      user.email = email;
      user.password = password;
      user.phoneNumber = phoneNumber;
      user.name = name;

      await user.save();
      res.status(201).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existUser = await User.findById(req.user.id);

      // Delete old avatar
      const existAvatarPath = `uploads/${existUser.avatar}`;

      fs.unlinkSync(existAvatarPath);
      // Save new avatar
      const filename = req.file.filename;
      const fileUrl = path.join("uploads", filename);
      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: filename,
      });
      // send response
      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user address
router.put(
  "/update-user-address",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }
      const existingAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );
      if (existingAddress) {
        Object.assign(existingAddress, req.body);
      } else {
        user.addresses.push(req.body);
      }
      await user.save();
      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address

router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: { addresses: { _id: addressId } },
        }
      );
      const user = await User.findById(userId);
      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");
      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }
      const isPasswordValid = await user.comparePassword(req.body.oldPassword);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid old password", 400));
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
      }
      user.password = req.body.newPassword;
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user information
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user    --- admin
router.delete(
  "/admin-delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }
      await User.findByIdAndDelete(req.params.id)
      res
        .status(201)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
