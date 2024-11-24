const ErrorHandler = require('../utils/ErrorHandler.js');
const catchAsyncErrors = require('./catchAsyncErrors.js');
const jwt = require('jsonwebtoken');
const User = require("../model/user");
const Shop = require('../model/shop.js');

exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});
exports.isSeller = catchAsyncErrors(async(req,res,next) => {
    const {seller_Token} = req.cookies;

    if(!seller_Token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(seller_Token, process.env.JWT_SECRET_KEY);

    req.seller = await Shop.findById(decoded.id);

    next();
});

exports.isAdmin = (...roles) =>{
    return async (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} cannot a access this resources`, 403));
        }
        next();
    }
}
