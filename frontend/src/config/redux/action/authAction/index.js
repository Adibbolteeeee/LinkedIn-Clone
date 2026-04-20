import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "Token not provided!",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      return response.data;
    } catch (err) {
  console.log("FULL ERROR:", err);
  console.log("ERROR RESPONSE:", err.response);
  console.log("ERROR DATA:", err.response?.data);

  return thunkAPI.rejectWithValue(
    err.response?.data || { message: "Something went wrong" }
  );
}
  }
);


export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async(user,thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params : {
          token : user.token,
        }
      });

      return thunkAPI.fulfillWithValue(response.data);
    }catch(err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)