import React from "react";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

const LearnFrontPage = () => {
  return (
    <nav>
      <div className="flex justify-between items-center my-[20px] mx-auto w-[90%]">
        <div className="">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            className="cursor-pointer"
            alt=""
          />
        </div>
        <div className="relative">
          <input
            type="search"
            className="w-[700px] h-[40px] rounded-[6px] p-2   focus:border-[2px] border-blue-600 duration-150"
            placeholder="search product"
          />
          <AiOutlineSearch size={30} className=" absolute top-2 right-2 " />
        </div>
        <div className="relative flex items-center">
          <button className="w-[150px] text-white bg-black p-3 rounded-[10px]">
            Dashboard
          </button>
          <IoIosArrowBack
            size={18}
            className="absolute top-4 right-2 text-white"
          />
        </div>
      </div>
      <div className="w-[100%] bg-blue-800 h-[70px]">
        <div className="flex w-[90%] mx-auto justify-between items-center h-full">
          <div className="mt-3 flex items-center bg-white w-[200px] h-[60px] text-black rounded-[6px] relative pl-2">
            <BiMenuAltLeft size={30} />
            <button className="text-[18px] font-[500]">categories</button>
            <IoIosArrowDown
              size={30}
              className="absolute right-2 top-4 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-7 text-white font-[600]">
            <div className="">home</div>
            <div className="">best Selling</div>
            <div className="">Products</div>
            <div className="">Events</div>
            <div className="">FaQ</div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <AiOutlineHeart size={30} />
            <AiOutlineShoppingCart size={30} />
            <CgProfile size={30} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LearnFrontPage;
