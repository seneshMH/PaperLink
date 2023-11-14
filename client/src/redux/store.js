import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { userSlice } from "./userSlice";

const store = configureStore({
	reducer: {
		loaders: loaderSlice.reducer,
		users: userSlice.reducer,
	}
});

export default store;