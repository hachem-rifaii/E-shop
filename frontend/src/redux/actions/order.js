// get all orders of user

import axios from "axios";
import { server } from "../../server";

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    });
    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );
    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.message,
    });
  }
};

// get all orders of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    });
    const { data } = await axios.get(
      `${server}/order/get-all-orders-by-seller/${shopId}`,{
        withCredentials: true,
      }
    );
    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.message,
    });
  }
};



// get order for admin

export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "adminAllOrderRequest",
    });
    const { data } = await axios.get(
      `${server}/order/admin-all-orders`,{
        withCredentials: true,
      }
    );
    dispatch({
      type: "adminAllOrderSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrderFailed",
      payload: error.message,
    });
  }
};
