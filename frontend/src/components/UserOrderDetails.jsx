import React, { useEffect, useState } from 'react'
import styles from '../style/style'
import { BsFillBagFill } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { backend_url, server } from '../server'
import { getAllOrdersOfUser } from '../redux/actions/order'
import { RxCross1 } from 'react-icons/rx'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'

import { toast } from 'react-toastify';
import axios from 'axios'

const UserOrderDetails = () => {
    const { orders } = useSelector((state) => state.order)
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState();
    const [comment, setComment] = useState("");
    useEffect(() => {
        if (!orders || orders.length === 0) {
            dispatch(getAllOrdersOfUser(user._id));
        }

    }, [dispatch, user._id, orders])

    const data = orders && orders.find((item) => item._id === id);
    // review handler
    const reviewHandler = async (e) => {
        await axios.put(`${server}/product/create-new-review`, {
            user: user,
            productId: selectedItem?._id,
            comment,
            rating,
            orderId: id,
        }, { withCredentials: true }).then((res) => {
            toast.success(res.data.message);
            setRating(null);
            setComment("");
            setOpen(false);
            dispatch(getAllOrdersOfUser(user._id))
        }).catch((err) => {
            toast.error(err);
        })
    }
    
    // refund handler 
    const refundHandler = async(e) =>{
        await axios.put(`${server}/order/order-refund/${id}` , {
            status :"Processing refund"
        }).then((res)=>{
            toast.success(res.data.message);
        }).catch((err)=>{
            toast.error(err.response.data.message);
        })
    }
    return (
        <div className={`py-4 min-h-screen ${styles.section}`}>
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center">
                    <BsFillBagFill size={30} color='crimson' />
                    <h1 className='pl-2 text-[25px]'>Order Details</h1>
                </div>

            </div>

            <div className="w-full flex items-center justify-between pt-6">
                <h5 className='text-[#00000084]'>Order ID: <span>#{data?._id?.slice(0, 8)}</span></h5>
                <h5 className='text-[#00000084]'>Placed on: <span>{data?.createdAt?.slice(0, 10)}</span></h5>
            </div>
            {/* order items */}
            <br />
            <br />
            {
                data && data?.cart.map((item, index) => (
                    <div key={index} className="w-full flex items-start mb-5">
                        <img src={`${backend_url}${item.images[0]}`} alt=""
                            className='w-[80px] h-[80px]' />
                        <div className="w-full">
                            <h5 className='pl-3 text-[20px]'>
                                {item.name}
                            </h5>
                            <h5 className='pl-3 text-[20px] text-[#00000091]'>
                                US$ {item.discountPrice} x {item.qty}
                            </h5>
                        </div>
                        {
                            item.isReviewed ? null :

                                data?.status === "Delivered" && (
                                    <div className={`${styles.button} text-[#fff] text-center`}
                                        onClick={() => setOpen(true) || setSelectedItem(item)}
                                    >
                                        Write a review
                                    </div>
                                )

                        }
                    </div>
                ))
            }
            {/* review popup */}
            {
                open && (

                    <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
                        <div className="800px:w-[50%] w-[80%] h-min bg-[#fff] shadow rounded-md p-3">
                            <div className="w-full flex justify-end p-3">
                                <RxCross1 size={30} onClick={() => setOpen(false)} className='cursor-pointer' />
                            </div>
                            <h2 className='text-[30px] font-[500] font-Poppins text-center'>Give a review</h2>
                            <br />
                            <div className="w-full flex">
                                <img src={`${backend_url}/${selectedItem?.images[0]}`} alt="" className='w=[80px] h-[80px]' />
                                <div>
                                    <div className="pl-3 text-[20px]">
                                        {selectedItem?.name}
                                    </div>
                                    <h4 className='pl-3 text-[20px]'>
                                        US${selectedItem?.discountPrice} x ${selectedItem?.qty}
                                    </h4>
                                </div>
                            </div>
                            <br />
                            <br />

                            {/* rating */}
                            <h5 className='pl-3 text-[20px] font-[500]'>Give a Rating <span className='text-red-500'>*</span></h5>
                            <div className="flex w-full ml-2 pt-1">{[1, 2, 3, 4, 5].map((i) => rating >= i ? (
                                <AiFillStar key={i} className='mr-1 cursor-pointer' color='rgb(246,186,0)' onClick={() => setRating(i)} />
                            ) : <AiOutlineStar key={i} className='mr-1 cursor-pointer' color='rgb(246,186,0)' onClick={() => setRating(i)} />)}</div>

                            <br />
                            <div className="w-full ml-3">
                                <label className='block text-[20px] font-[500]'>
                                    Write a comment <span className='ml-1 font-[400] text-[16px] text-[#00000052]'>(optional)</span>
                                </label>
                                <textarea name="comment" cols="20" rows="5" id="" placeholder='How was your product? write your expresion about it!'
                                    className='w-[95%] outline-none border mt-2'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                >

                                </textarea>
                            </div>

                            <div className="w-full flex justify-end mt-5">
                                <button className={`${styles.button} text-[#fff]`} onClick={reviewHandler}>Submit</button>
                            </div>
                        </div>

                    </div>
                )
            }

            <div className="border-t w-full text-right">
                <h5 className='pt-3 text-[18px]'>
                    Total Price <strong>US${data?.totalPrice}</strong>
                </h5>
            </div>
            <br />
            <br />
            <div className="w-full 800px:flex items-center">
                <div className="w-full 800px:w-[60%]">
                    <h4 className='pt-3 text-[20px] font-[600]'>
                        Shipping Address :
                    </h4>
                    <h4 className='pt-3 text-[20px]'>
                        {
                            data?.shippingAddress?.address1 + " " + data?.shippingAddress?.address2
                        }
                    </h4>
                    <h4 className='text-[20px]'>
                        {
                            data?.shippingAddress?.country
                        }
                    </h4>
                    <h4 className='text-[20px]'>
                        {
                            data?.shippingAddress?.city
                        }
                    </h4>
                    <h4 className='text-[20px]'>
                        {
                            data?.user?.phoneNumber
                        }
                    </h4>
                </div>
                <div className="w-full 800px:w-[40%]">
                    <h4 className='pt-3 text-[20px]'>
                        Payment Info:
                    </h4>
                    <h4>
                        Status: {
                            data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"
                        }
                    </h4>
                    <br />
                    {
                        data?.status === "Delivered" && (
                            <div className={`${styles.button} text-white text-center`}
                                onClick={refundHandler}
                            >
                                Give a Refund
                            </div>
                        )
                    }
                </div>
            </div>
            <br />
            <Link to="/">
                <div className={`${styles.button} text-white`}>
                    Send Message
                </div>
            </Link>

            <br />
            <br />

        </div>
    )
}

export default UserOrderDetails