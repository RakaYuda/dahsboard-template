// import { Product } from "./../../types/product";
// import { Product } from "./../../types/product";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserLoginAttribute, UserRegisterAttribute } from "../../types";
import { client } from "../../utils/api/client";
// import { client } from "../../helpers/api/client";

const urlBaseApi = "http://localhost:3000";

interface User {
  username: string | null;
  name: string | null;
  status: string | null;
}

export interface UserState {
  user: User;
  isLoggedIn: boolean;
  token: string;
}

const initialState = {
  user: {
    username: "",
    name: "",
    status: "",
  },
  isLoggedIn: false,
  token: "",
} as UserState;

export const authLogin = createAsyncThunk<User, UserLoginAttribute>(
  "user/authLogin",
  async (user) => {
    const path = "/api/auth/login";
    const url = urlBaseApi + path;
    const { username, password } = user;
    const response = await client.post(url, {
      username: username,
      password: password,
    });
    return response;
  }
);

export const authRegister = createAsyncThunk<User, UserRegisterAttribute>(
  "user/authRegister",
  async (user) => {
    const path = "/api/auth/signup";
    const url = urlBaseApi + path;
    const { username, email, password } = user;
    const response = await client.post(url, {
      username: username,
      email: email,
      password: password,
    });
    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state, action) => {
        state.user = {
          ...state.user,
          username: "",
          name: "",
          status: "PROCESS_LOGIN",
        };
      })
      .addCase(authLogin.fulfilled, (state, { payload }) => {
        // console.log(payload);
        state.user = {
          ...state.user,
          username: payload.username,
          name: payload.username,
          status: "SUCCESS_LOGIN",
        };
        state.isLoggedIn = true;
      })
      .addCase(authLogin.rejected, (state, { error }) => {
        // console.log(error.message);
        state.user = {
          ...state.user,
          username: "",
          name: "",
          status: error.message!,
        };
        // console.log(state.user);
      })
      .addCase(authRegister.pending, (state, action) => {
        state.user = {
          ...state.user,
          username: "",
          name: "",
          status: "PROCESS_REGISTER",
        };
      })
      .addCase(authRegister.fulfilled, (state, { payload }) => {
        // console.log(payload);
        state.user = {
          ...state.user,
          username: payload.username,
          name: payload.username,
          status: "SUCCESS_REGISTER",
        };
      })
      .addCase(authRegister.rejected, (state, { error }) => {
        state.user = {
          ...state.user,
          username: "",
          name: "",
          status: error.message!,
        };
      });
  },
});

export default userSlice.reducer;
