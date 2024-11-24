import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
// import { IoBagHandleOutline } from "react-icons/io5";
// import { HiMinus, HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../style/style";
import { BsCartPlus } from "react-icons/bs";
// import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {

  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  // remove from wishlist
  const removeFromWishlistHandler = (wishlist) => {
    dispatch(removeFromWishlist(wishlist));
  };

  // add to cart handler
  const addToCartHandler = (item)=>{
    const newData = {...item , qty:1}
    dispatch(addToCart(newData))
    dispatch(removeFromWishlist(item));
    setOpenWishlist(false);

  }

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10 ">
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm ">
        {wishlist && wishlist.length === 0 ? (
            <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className=" cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Wishlist Item is Empty!</h5>
          </div>
        ):(
          <>
          <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenWishlist(false)}
            />
          </div>
          {/* Item length  */}
          
          <div className={`${styles.noramlFlex} p-4`}>
         
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500] ">
              {wishlist && wishlist.length} items
            </h5>
           
          </div>
          {/* cart single items  */}
          <br />
          <div className="w-full border-t ">
            {wishlist &&
              wishlist.map((i, index) => (
                <CartSingle
                  key={index}
                  data={i}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  addToCartHandler = {addToCartHandler}
                />
              ))}
          </div>
        </div></>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler,addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;
  return (
    <div className="border-b p-4  ">
      <div className="w-full 800px:flex items-center ">
        <RxCross1
          size={20}
          className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] ml-2"
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={`${backend_url}${data.images[0]}`}
          className="w-[80px] h-[80px] ml-2"
          alt=""
        />

        <div className="pl-[5px] ">
          <h1>{data.name}</h1>
          <h4 className="font-[600] 800px:pt-[3px] text-[17px]  text-[#d02222] font-Roboto">
            US$ {totalPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="add to cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
