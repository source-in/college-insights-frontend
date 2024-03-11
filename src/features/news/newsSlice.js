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
  const response = await axios.get(
    "https://newsdata.io/api/1/news?apikey=pub_39653707db78f1a48b0668ca749fd0b22de91&language=en&country=us&size=5"
  );
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
