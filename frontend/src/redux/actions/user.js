import axios from "axios";
import { server } from "../../server";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
  }
};
export const loadShop = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });

    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};

// update user information
export const updateUserInformation =
  (email, password, phoneNumber, name) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });
      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        { email, password, phoneNumber, name },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "updateUserInfoFail",
        payload: error.response.data.message,
      });
    }
  };

// update user addresses
export const updateUserAddresses =
  (country, city, address1, address2, addressType, zipCode) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });
      const { data } = await axios.put(
        `${server}/user/update-user-address`,
        { country, city, address1, address2, addressType ,zipCode},
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          user: data.user,
          successMessage: "address updated successfully!",
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "updateUserAddressFail",
        payload: error.response.data.message,
      });
    }
  };
  // delete address from user account
  export const deleteUserAddress = (id) => async (dispatch) => {
    try {
      dispatch({
        type: "deleteUserAddressRequest",
      });
      const { data } = await axios.delete(
        `${server}/user/delete-user-address/${id}`,
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "deleteUserAddressSuccess",
        payload: {
          successMessage: "address deleted successfully!",
          user: data.user,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "deleteUserAddressFail",
        payload: error.response.data.message,
      });
    }
  };

  // get all user --- admin
  export const getAllUsers = () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllUsersRequest",
      });
      const { data } = await axios.get(`${server}/user/admin-all-users`, {
        withCredentials: true,
      });
      dispatch({
        type: "getAllUsersSuccess",
        payload: data.users,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "getAllUsersFailed",
        payload: error.response.data.message,
      });
    }
  };