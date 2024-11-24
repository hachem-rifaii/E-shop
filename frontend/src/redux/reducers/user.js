import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const userReducer = createReducer(initialState, (builder) => {
  builder

    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })

    // update user information
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase("updateUserInfoFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // update user addresses
    .addCase("updateUserAddressRequest", (state) => {
      state.addressLoading = true;
    })
    .addCase("updateUserAddressSuccess", (state, action) => {
      state.addressLoading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase("updateUserAddressFail", (state, action) => {
      state.addressLoading = false;
      state.error = action.payload;
    })
    // delete user addresses
    .addCase('deleteUserAddressRequest', (state)=>{
      state.addressLoading = true;
    })
    .addCase('deleteUserAddressSuccess', (state, action)=>{
      state.addressLoading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase('deleteUserAddressFail', (state, action)=>{
      state.addressLoading = false;
      state.error = action.payload;
    })

    // get all users --- admin
    .addCase("getAllUsersRequest", (state) => {
      state.userLoading = true;
    })
    .addCase("getAllUsersSuccess", (state, action) => {
      state.userLoading = false;
      state.users = action.payload;
    })
    .addCase("getAllUsersFailed", (state, action) => {
      state.userLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    })
    .addCase("clearMessage",(state)=>{
     state.successMessage = null;
    })
});

export default userReducer;
