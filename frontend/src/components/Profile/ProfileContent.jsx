import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import styles from "../../style/style";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { MdTrackChanges } from "react-icons/md";
import { deleteUserAddress, loadUser, updateUserAddresses, updateUserInformation } from "../../redux/actions/user";
import { Country, State } from "country-state-city"
import { toast } from "react-toastify";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(email, password, phoneNumber, name));
    toast.success("your information has been updated");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });


    }
  }, [error, successMessage, dispatch]);

  // update user avatar
  const handleImage = async (e) => {
    const file = e.target.files[0]; // Get the first file from the input
    setAvatar(file);

    const formData = new FormData();
    formData.append("image", file); // Append only the first file

    await axios.put(`${server}/user/update-avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
      .then((response) => {
        dispatch(loadUser());
        toast.success("Avatar updated successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="w-full">
      {/* Profile Page */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${backend_url}${user?.avatar}`}
                className="w-[150px] h-[150px] object-cover border-[3px] border-[#3ad132] rounded-full "
                alt=""
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className=" hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image" className="cursor-pointer">
                  <AiOutlineCamera size={20} />
                </label>
              </div>
            </div>
          </div>
          <div className="w-full px-5">
            <br />
            <br />
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3 ">
                <div className="W-[100%] 800px:w-[50%]">
                  <label htmlFor="" className="block pb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="W-[100%] 800px:w-[50%]">
                  <label htmlFor="" className="block pb-2">
                    Email Address
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3 ">
                <div className="W-[100%] 800px:w-[50%]">
                  <label htmlFor="" className="block pb-2">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="W-[100%] 800px:w-[50%]">
                  <label htmlFor="" className="block pb-2">
                    Enter your password
                  </label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                type="submit"
                value="Update"
              />
            </form>
          </div>
        </>
      )}

      {/* Orders Page */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {/* refund page  */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {/* track order  */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}
      {/* change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}
      {/* user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};
// orders
const AllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id))
  }, [dispatch, user._id])

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
      console.log(item.cart.length);
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};
// refund order
const AllRefundOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id))
  }, [dispatch, user._id])

  const eligibleOrders = orders && orders.filter((order) => order.status === "Processing refund")
  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
      console.log(item.cart.length);
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

// track order
const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id))
  }, [dispatch, user._id])

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
      console.log(item.cart.length);
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

// change Password
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // handle password change
  const passwordChangedHandler = async (e) => {
    e.preventDefault();
    await axios.put(`${server}/user/update-user-password`, {
      oldPassword,
      newPassword,
      confirmPassword,
    }, { withCredentials: true }).then((response) => {
      toast.success(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }).catch((error) => {
      toast.error(error.response.data.message);
    })
  }
  return (
    <div className="w-full px-5">
      <div className="w-full ">
        <h1 className=" block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
          Change Password
        </h1>
        <div className="w-full">
          <form onSubmit={passwordChangedHandler} className="flex flex-col items-center">
            <div className="W-[100%] 800px:w-[50%] mt-5">
              <label htmlFor="" className="block pb-2">
                Enter your old password
              </label>
              <input
                type="password"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="W-[100%] 800px:w-[50%] mt-2">
              <label htmlFor="" className="block pb-2">
                Enter your new password
              </label>
              <input
                type="password"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="W-[100%] 800px:w-[50%] mt-2">
              <label htmlFor="" className="block pb-2">
                Enter your confirm password
              </label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input
              className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              type="submit"
              value="Update"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

// user address
const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user, successMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  if (successMessage) {
    toast.success(successMessage);
    dispatch({ type: "clearMessage" });
  }
  // handle address submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === " " || city === " " || country === " ") {
      toast.error("Please fill all fields");
    } else {

      dispatch(updateUserAddresses(country,
        city,
        address1,
        address2,
        addressType,
        zipCode,));
    }
    setOpen(false);
    setAddressType("");
    setCity("");
    setCountry("");
    setZipCode("");
    setAddress1("");
    setAddress2("");
  }
  const handleDeleteUserAddress = (item) => {
    dispatch(deleteUserAddress(item._id))
  }

  const AddressTypeData = [
    {
      name: "default",
    },
    {
      name: "home"
    },
    {
      name: "office"
    }
  ]
  return (
    <div className="w-full px-5">
      {
        open && (
          <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center"
          >
            <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
              <div className="w-full flex justify-end p-3">
                <RxCross1
                  size={30}
                  className=" cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <h1 className="text-center text-[25px] font-Poppins">
                Add New Address
              </h1>
              <div className="w-full">
                <form aria-required onSubmit={handleSubmit} className="w-full">
                  <div className="w-full block p-4">
                    <div className="w-full pb-2">
                      <label className="block pb-2" >Country</label>
                      <select name="" id="" value={country} onChange={(e) => setCountry(e.target.value)} className="w-[100%] border h-[40px] rounded-[5px]">
                        <option value="" className="block border pb-2">choose your country</option>
                        {
                          Country && Country.getAllCountries().map((item) => (
                            <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="w-full pb-2">
                      <label className="block pb-2" >City</label>
                      <select name="" id="" value={city} onChange={(e) => setCity(e.target.value)} className="w-[100%] border h-[40px] rounded-[5px]">
                        <option value="" className="block border pb-2">choose your city</option>
                        {
                          State && State.getStatesOfCountry(country).map((item) => (
                            <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="w-full pb-2">
                      <label className="block pb-2" >Address 1</label>
                      <input
                        type="text"
                        value={address1}
                        required
                        onChange={(e) => setAddress1(e.target.value)}
                        className={`${styles.input}`}
                      />

                    </div>
                    <div className="w-full pb-2">
                      <label className="block pb-2" >Address 2</label>
                      <input
                        type="text"
                        value={address2}
                        required
                        onChange={(e) => setAddress2(e.target.value)}
                        className={`${styles.input}`}
                      />
                    </div>
                    <div className="w-full pb-2">
                      <label className="block pb-2" >Zip Code</label>
                      <input
                        type="number"
                        value={zipCode}
                        required
                        onChange={(e) => setZipCode(e.target.value)}
                        className={`${styles.input}`}
                      />
                    </div>
                    <div className="w-full pb-2">
                      <label className="block pb-2" >Address type</label>
                      <select name="" id="" value={addressType} onChange={(e) => setAddressType(e.target.value)} className="w-[100%] border h-[40px] rounded-[5px]">
                        <option value="" className="block border pb-2">choose your Address type</option>
                        {
                          AddressTypeData && AddressTypeData.map((item) => (
                            <option value={item.name} key={item.name}>{item.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className=" w-full pb-2">
                      <input type="submit"
                        className={`${styles.input} mt-5 cursor-pointer`}
                        required
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
      <div className="w-full flex items-center justify-between ">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2"
        >
          My Address
        </h1>
        <div className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add New Method</span>
        </div>
      </div>
      <br />
      {
        user && user.addresses.map((item, index) => (
          <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5" key={index}>
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center ">
              <h6>{item.address1}  {item.address2}</h6>
            </div>
            <div className="pl-8 flex items-center ">
              <h6>{user && user.phoneNumber} </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8" onClick={() => handleDeleteUserAddress(item)}>
              <AiOutlineDelete size={25} className="cursor-pointer" />
            </div>
          </div>
        ))
      }
      {
        user && user.addresses.length === 0 && (
          <div className="w-full text-center text-[20px] text-[#000000ba]">
            No addresses found
          </div>
        )
      }
    </div>
  );
};
export default ProfileContent;
