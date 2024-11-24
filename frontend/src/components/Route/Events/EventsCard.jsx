import React from 'react'
import styles from '../../../style/style';
import CountDown from './CountDown.jsx'
import { backend_url } from '../../../server.js';
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../../redux/actions/cart.js';

const EventsCard = ({ active , data}) => {
  const column = [1,2,4]

  const { cart } = useSelector((state) => state.cart);
 
  const dispatch = useDispatch();
  const addToCartHandler = (e) =>{
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already exists in cart");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("item added to cart successfully!");
      }
    }
  }
  return (
    <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
           <div className="w-full lg:-w[50%] m-auto">
           <img  src={`${backend_url}${data.images[0]}`} alt="Event" />
        
           </div>
           <div className="w-full lg:[w-50%] flex flex-col justify-center">
               <h2 className={`${styles.productTitle}`}>{data.name} </h2>
               <p>
                  {
                    data.description    
                  }
               </p>
               <div className="flex py-2 justify-between">
                <div className="flex">
                    <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
                        {data.orignalPrice}$
                    </h5>
                    <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
                        {data.discountPrice}$
                    </h5>
                </div>
                <span className='pr-3 font-[400] text-[17px] text-[#44a55e] '>
                    120 sold
                </span>
               </div>
               <CountDown data={data} />
               <br />
             <div className="flex items-center">
             <Link to={`/product/${data._id}?isEvent=true`}>
              <div className={`${styles.button} text-[#fff]`}>
                See Details
               </div>
              </Link>
              <div className={`${styles.button} text-[#fff]  ml-5`} onClick={(e)=> addToCartHandler(data)}>
               Add to Cart
               </div>
             </div>
           </div>
    </div>
  )
}

export default EventsCard