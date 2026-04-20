import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer"
 /*
submit an action
handle action in its reducer
register here -> reducer
*/



const store = configureStore({
  reducer: {
    auth: authReducer,
    posts : postReducer,
  },
});

export default store;