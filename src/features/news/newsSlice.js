import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  articles: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching news
export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await axios.get("https://newsapi.org/v2/top-headlines", {
    params: {
      apiKey: "5fe7eb9344344462b42654b236e73aa5",
      country: "us",
      limit: 10,
    },
  });
  // console.log(response.data);
  return response.data.articles;
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
