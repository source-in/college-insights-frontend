import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  articles: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching news
export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await axios.get(
    "https://newsdata.io/api/1/news?apikey=pub_39653707db78f1a48b0668ca749fd0b22de91&language=en&country=us&size=5"
  );
  // console.log(response.data);
  return response.data.results;
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
