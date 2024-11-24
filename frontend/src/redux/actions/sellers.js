import axios from "axios";
import { server } from "../../server";


// get all sellers  --- admin

export const getAllSellers = () => async (dispacth) => {
try {
    dispacth({
       type: "getAllSellersRequest"
    })
    const { data } = await axios.get(`${server}/shop/admin-all-sellers`,{withCredentials: true})
    dispacth({
        type: "getAllSellersSuccess",
        payload: data.sellers
    })
} catch (error) {
    dispacth({
        type: "getAllSellersFailed",
        payload: error.response.data.message
    })
}
};
