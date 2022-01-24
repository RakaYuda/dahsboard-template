import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import userReducer from "./slices/user-slice";

// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// const rootReducer = combineReducers({
//   products: productsReducer,
//   user: userReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
