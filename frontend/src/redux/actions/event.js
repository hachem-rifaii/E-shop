// create event

import axios from "axios";
import { server } from "../../server";

export const createEvent = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });
    const config = {headers: {"content-type":"multipart/form-data"}};
    const { data } = await axios.post(
      `${server}/event/create-event`,
      newForm,
      config
    );
    dispatch({
      type: "eventCreateSuccess",
      payload: data.event,
    });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response.data.message,
    });
    console.error(error);
  }
};

// get all events for shop
export const getAllEventsShop = (id) =>async(dispatch)=>{
try {
  dispatch({
    type:"getAllEventShopRequest",
  })
  const {data} = await axios.get(`${server}/event/get-all-event-shop/${id}`)
  dispatch({
    type:"getAllEventShopSuccess",
    payload:data.events,
  })
  
} catch (error) {
  dispatch({
    type:"getAllEventShopFailed",
    payload:error.response.data.message,
  })
}
}

// delete event of a shop

export const deleteEvent = (id) => async(dispatch)=>{
  try {
    dispatch({
      type:"deleteEventRequest",
    })
    const {data} = await axios.delete(`${server}/event/delete-shop-event/${id}`,{
      withCredentials: true,
    })
    dispatch({
      type:"deleteEventSuccess",
      payload:data.message,
    })
  } catch (error) {
    dispatch({
      type:"deleteEventFailed",
      payload:error.response.data.message,
    })
    
  }
}
// get all events

export const getAllEvents = () => async(dispatch)=>{
try {
  dispatch({
    type:"getAllEventRequest",
  })
  const {data} = await axios.get(`${server}/event/get-all-events`)
  dispatch({
    type:"getAllEventSuccess",
    payload:data.events,
  })
  
} catch (error) {
  dispatch({
    type:"getAllEventFailed",
    payload:error.response.data.message,
  })
}
}
