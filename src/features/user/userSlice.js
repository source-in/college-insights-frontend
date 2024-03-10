import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the slice
const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

// Define the async thunk for registration
export const registerUser = createAsyncThunk(
  "users/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signin`,
        userData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        loginData
      );
      // Assuming the response body will have a token, adjust based on your actual response structure
      return response.data;
    } catch (err) {
      // Check if the error structure is correct for your use case
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getParticularUser = createAsyncThunk(
  "users/getParticularUser",
  async (userID, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/manageUser/getPerticularUser`,
        userID,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user details:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Your other reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.token) {
          localStorage.setItem("userId", action.payload.userID);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getParticularUser.fulfilled, (state, action) => {
        state.user = action.payload;
        // state.isLogin = true; // Set isLogin to true upon successful fetch
      });
  },
});

export const {
  /* other actions */
} = userSlice.actions;
export default userSlice.reducer;
