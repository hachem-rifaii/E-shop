import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../style/style";
import axios from "axios";
import { toast } from "react-toastify";
import { loadShop } from "../../redux/actions/user";

const ShopSetting = () => {
  // seller information
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const dispatch = useDispatch()
  // handle form input change
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(seller && seller.description);
  const [zipCode, setZipCode] = useState(seller && seller.zipCode);
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  // handle image upload
  const handleImage = async(e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAvatar(file);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    // send request to server
    await axios.put(`${server}/shop/update-shop-avatar`, formData,{
        headers:{
            "Content-Type": "multipart/form-data"
        },
        withCredentials : true
    }).then((res)=>{
        toast.success(res.data.message)
        dispatch(loadShop())
    }).catch((err)=>{
        toast.error(err.response.data.message)
    });

  };



  // handle form submit
  const updateShopHandler = async(e) => {
    e.preventDefault();
   const shopInfo = {
      name,
      description,
      address,
      zipCode,
      phoneNumber,
    
    }
    // call the server
    await axios.put(`${server}/shop/update-shop-info` , shopInfo ,  {
        withCredentials : true
    }).then((res) => {
        toast.success(res.data.message)
        dispatch(loadShop())
    }).catch((err) => {
        toast.error(err.response.data.message) 
    });
  }


  return (
    <div className="w-full min-h-screen flex flex-col items-center my-5">
      <div className="flex flex-col justify-center w-full 800px:w-[80%]">

        {/* avatar */}
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={
                avatar ? URL.createObjectURL(avatar) : `${backend_url}/${seller?.avatar}`
              }
              className="w-[200px] h-[200px] rounded-full"
              alt=""
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
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

        {/* shop info */}
        <form className="flex flex-col items-center"
              onSubmit={updateShopHandler}
            >
           {/* shop Name */}
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
            <label className="block pb-2">Shop Name</label>
            </div>
          
            
            <input
              type="text"
              placeholder={`${seller?.name}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              onChange={(e) => setName(e.target.value)}
              value={name}
              required/>
          </div>
          
           {/* shop Description */}
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
            <label className="block pb-2">Shop Description</label>
            </div>
            <input
              type="text"
              placeholder={`${seller?.description ? seller?.description : "Enter your Shop Description"}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              />
          </div>

           {/* shop address */}
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
            <label className="block pb-2">Shop Address</label>
            </div>
            <input
              type="text"
              placeholder={`${seller?.address} `}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required/>
          </div>
 
           {/* shop phone number */}
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
            <label className="block pb-2">Shop Phone Number</label>
            </div>
            <input
              type="text"
              placeholder={`${seller?.phoneNumber} `}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required/>
          </div>
 
           {/* shop zip code */}
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
            <label className="block pb-2">Shop Zip Code</label>
            </div>
            <input
              type="text"
              placeholder={`${seller?.zipCode} `}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required/>
          </div>

          {/* shop update button */}
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <input
              type="submit"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              value="Update Shop"
              required
              readOnly
              />
          </div>

        </form>
      </div>
    </div>
  );
};

export default ShopSetting;
