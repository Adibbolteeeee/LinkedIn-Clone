import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, loginUser, registerUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests, acceptConnection } from "../../action/authAction";
const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere : false,
  profileFetched: false,
  all_profiles_fetched : false,
  all_users : [],
  connections: [],
  connectionRequests: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere : (state) => {
    state.isTokenThere = true;
    }, 
    setTokenIsNotThere : (state) => {
      state.isTokenThere = false;
    }, 
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Logging you in into your account!";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.loggedIn = true;
        state.message = "Login Successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Getting you account ready!";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isSuccess = true;
        state.isLoading = false;
        state.loggedIn = false;
        state.message = "Registration is Successful! please Log in";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
        action.payload?.message ||
        action.payload?.error ||
          "Something went wrong";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
        
      })
      .addCase(getAllUsers.fulfilled,(state,action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
        
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload?.message || "Failed to fetch connections";
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload?.message || "Failed to fetch connection requests";
      })
      
  },
 });

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;
