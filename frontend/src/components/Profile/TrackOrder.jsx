import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
    const { orders } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch, user._id]);

    const data = orders && orders.find((item) => item._id === id);
    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            {data && data?.status === "Processing" ? (
                <h1 className="text-[20px]"> Your Order is Processing in Shop.</h1>
            ) : data?.status === "Transferred to delivery partner" ? (
                <h1 className="text-[20px]">
                    Your Order is Transferred to Delivery Partner.
                </h1>
            ) : data?.status === "Shipping" ? (
                <h1 className="text-[20px]">
                    Your Order is Coming with our delivery partner.
                </h1>
            ) : data?.status === "Received" ? (
                <h1 className="text-[20px]">
                    Your Order is in your city. our Delivery man will deliver it.
                </h1>
            ) : data?.status === "On the way" ? (
                <h1 className="text-[20px]">
                    {" "}
                    Our Delivery man going to deliver your order
                </h1>
            ) : data?.status === "Delivered" ? (
                <h1 className="text-[20px]">Your Order is delivered!.</h1>
            ) : data?.status === "Processing refund" ? (
                <h1 className="text-[20px]">Your refund is processing!.</h1>
            ) : data?.status === "Refund success" ? (
                <h1 className="text-[20px]">Your refund is successed!.</h1>
            ) : null}
        </div>
    );
};

export default TrackOrder;
