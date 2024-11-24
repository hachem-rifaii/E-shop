import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

const orderReducer = createReducer(initialState, (builder) => {
  builder

    // get all products of a user
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all products of a shop
    .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all products of a admin
    .addCase("adminAllOrderRequest", (state) => {
      state.adminOrderLoading = true;
    })
    .addCase("adminAllOrderSuccess", (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("adminAllOrderFailed", (state, action) => {
      state.adminOrderLoading = false;
      state.error = action.payload;
    })

    .addCase("clearError", (state) => {
      state.error = null;
    });
});

export default orderReducer;
