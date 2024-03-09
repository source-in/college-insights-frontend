import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./features/news/newsSlice";
import userReducer from "./features/user/userSlice";
import blogsReducer from "./features/blogs/blogsSlice";

export const store = configureStore({
  reducer: {
    news: newsReducer,
    user: userReducer,
    blogs: blogsReducer,
  },
});
