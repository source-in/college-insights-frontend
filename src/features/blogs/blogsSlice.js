import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blogs: [],
  status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
  blog: {},
  comments: [],
  relatedBlogs: [],
  userBlogs: [],
  mostLiked: [],
};

export const fetchAllBlogs = createAsyncThunk(
  "blogs/fetchAllBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/handleBlog/getAllBlog`
      );
      const blogs = response.data.response;

      // Create a copy of the response and sort it to find the most liked blogs
      var mostLiked = [...blogs]
        .sort((a, b) => b.likes.length - a.likes.length)
        .slice(0, 3);

      return { blogs, mostLiked };
    } catch (error) {
      console.error("Error fetching all blogs:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the async thunk for adding a blog
export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/handleBlog/addBlog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (blogID, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/handleBlog/getBlogById`,
        {
          blogID: blogID,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching comments
export const fetchComments = createAsyncThunk(
  "blogs/fetchComments",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/handleBlog/fetchComment`,
        { blogID: blogId }
      );
      return response.data.response; // Assuming the response structure includes the comments in a response field
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for posting a comment
export const postComment = createAsyncThunk(
  "blogs/postComment",
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/handleBlog/addComment`,
        commentData
      );
      return response.data; // The response structure for a successful comment post
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for liking a blog
export const likeBlog = createAsyncThunk(
  "blogs/likeBlog",
  async ({ blogID, userID }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/handleBlog/likeBlog`,
        {
          blogID,
          userID,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for unliking a blog
export const unlikeBlog = createAsyncThunk(
  "blogs/unlikeBlog",
  async ({ blogID, userID }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/handleBlog/unlikeBlog`,
        {
          blogID,
          userID,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRelatedBlogs = createAsyncThunk(
  "blogs/fetchRelated",
  async (blogID, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/handleBlog/relatedBlogs/${blogID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching related blogs:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserBlogs = createAsyncThunk(
  "blogs/fetchUserBlogs",
  async (userID, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/handleBlog/getUserBlogs/${userID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching related blogs:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (blogID, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/handleBlog/deleteBlog`,
        { blogID },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data; // This response should ideally include a success message and perhaps the ID of the deleted blog
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ blogId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/handleBlog/editBlog/${blogId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    // Example of a synchronous reducer
    resetStatus(state) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload.blogs);
        console.log(action.payload.mostLiked);
        // Assuming the fetched blogs should replace the existing state.blogs
        state.blogs = action.payload.blogs;
        state.mostLiked = action.payload.mostLiked;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs.push(action.payload);
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blog = action.payload.response; // Assuming the data is in action.payload.response
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload; // Assuming payload is the comments array
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle postComment
      .addCase(postComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments.push(action.payload); // Add the new comment to the state
      })
      .addCase(postComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRelatedBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRelatedBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relatedBlogs = action.payload; // Store the related blogs
      })
      .addCase(fetchRelatedBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBlogs = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        // Set a loading state if needed
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        // Remove the blog from the current state
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== action.meta.arg
        ); // action.meta.arg should be the blogID passed to the deleteBlog thunk
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        // Handle the error
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = blogsSlice.actions;

export default blogsSlice.reducer;
