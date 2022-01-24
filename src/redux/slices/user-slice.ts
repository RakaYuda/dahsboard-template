// import { Product } from "./../../types/product";
// import { Product } from "./../../types/product";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserLoginAttribute, UserRegisterAttribute } from "../../types";
// import { client } from "../../helpers/api/client";
import { CartProduct } from "../../types/cart-product";

const urlBaseApi = "https://marked-api-development.herokuapp.com";

interface User {
  username: string | null;
  name: string | null;
  status: string | null;
}

export interface UserState {
  user: User;
  isLoggedIn: boolean;
  token: string;
  cart: CartProduct[];
}

const initialState = {
  user: {
    username: "",
    name: "",
    status: "",
  },
  isLoggedIn: false,
  // refreshToken: ""
  token: "",
  cart: [],
} as UserState;

export const authLogin = createAsyncThunk<User, UserLoginAttribute>(
  "user/authLogin",
  async (user) => {
    const path = "/api/auth/signin";
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
  reducers: {
    // addProductToUserCart(state, { payload }: PayloadAction<Product>) {
    //   const product = payload;
    //   const { id } = product;
    //   const existingProduct = state.cart.find((product) => product.id === id);
    //   if (!existingProduct) {
    //     const newProduct = {
    //       ...product,
    //       ["quantity"]: 1,
    //     };
    //     state.cart = [...state.cart, newProduct];
    //   } else {
    //     const newProduct = {
    //       ...existingProduct,
    //       ["quantity"]: existingProduct.quantity + 1,
    //     };
    //     const newCart = state.cart.map(function (item) {
    //       return item.id === existingProduct.id ? newProduct : item;
    //     });
    //     state.cart = [...newCart];
    //   }
    // },
    // addQuantityCartProduct(state, { payload }: PayloadAction<Product>) {
    //   const product = payload;
    //   const { id } = product;
    //   const existingProduct = state.cart.find((product) => product.id === id);
    //   if (existingProduct) {
    //     const newProduct = {
    //       ...existingProduct,
    //       ["quantity"]: existingProduct.quantity + 1,
    //     };
    //     const newCart = state.cart.map(function (item) {
    //       return item.id === existingProduct.id ? newProduct : item;
    //     });
    //     state.cart = [...newCart];
    //   }
    // },
    // reduceQuantityCartProduct(state, { payload }: PayloadAction<Product>) {
    //   const product = payload;
    //   const { id } = product;
    //   const existingProduct = state.cart.find((product) => product.id === id);
    //   if (existingProduct) {
    //     if (existingProduct.quantity > 1) {
    //       const newProduct = {
    //         ...existingProduct,
    //         ["quantity"]: existingProduct!.quantity - 1,
    //       };
    //       const newCart = state.cart.map(function (item) {
    //         return item.id === existingProduct.id ? newProduct : item;
    //       });
    //       state.cart = [...newCart];
    //     }
    //   }
    // },
    // removeCartProduct(state, { payload }: PayloadAction<Product>) {
    //   const product = payload;
    //   const { id } = product;
    //   const leftProduct = state.cart.filter((product) => product.id !== id);
    //   state.cart = [...leftProduct];
    //   console.log(leftProduct);
    // },
    // removeAllCartProduct(state) {
    //   state.cart = [...initialState.cart];
    // },
  },
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

// export const {
//   addProductToUserCart,
//   addQuantityCartProduct,
//   reduceQuantityCartProduct,
//   removeCartProduct,
//   removeAllCartProduct,
// } = userSlice.actions;

export default userSlice.reducer;
