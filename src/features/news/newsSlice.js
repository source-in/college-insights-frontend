import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  articles: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching news
export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  // const response = await axios.get("https://api.thenewsapi.com/v1/news/top", {
  //   params: {
  //     api_token: "vi8I930iymYGYcnWVZ9dx0lGHJiXPaENuDqzamw3",
  //     locale: "us",
  //     limit: 10,
  //   },
  // });
  // return response.data.data;
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;
