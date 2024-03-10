import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Autocomplete,
  Chip,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlog,
  fetchBlogById,
  updateBlog,
} from "../features/blogs/blogsSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AddBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tagsList, setTagsList] = useState([]);

  const editMode = searchParams.get("edit") === "true";
  const blogId = searchParams.get("blogId");

  const blog = useSelector((state) => state.blogs.blog);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId]);

  useEffect(() => {
    if (editMode && blog) {
      setTitle(blog.title);
      setText(blog.content);
      if (blog.tags && blog.tags.length > 0) {
        setTags(blog.tags.map((tag) => tag.name));
      } else {
        setTags([]);
      }
      if (blog.blogImage) {
        setImagePreview(`http://localhost:3001/static/${blog.blogImage}`);
      } else {
        setImagePreview("");
      }
    }
  }, [blog]);

  const fetchTags = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/handleBlog/getAllTags"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      const allTags = data.tags;
      // Assuming the response data is the array of tags
      setTagsList(allTags.map((tag) => ({ id: tag._id, name: tag.name })));
    } catch (error) {
      console.error("Error fetching tags:", error.message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", text);
    formData.append("tags", tags.join(",")); // Assuming your backend expects tags as a comma-separated string or adjust accordingly
    formData.append("authorID", userId);
    if (image) {
      formData.append("blogImage", image);
    }

    // Dispatch the addBlog async thunk action
    if (editMode) {
      dispatch(updateBlog({ blogId, formData }))
        .unwrap()
        .then((response) => {
          console.log("Blog updated successfully:", response);
          navigate(`/view-blog/${blogId}`);
        })
        .catch((error) => {
          console.error("Failed to add blog:", error);
          // Handle error (e.g., showing an error message)
        });
    } else {
      dispatch(addBlog(formData))
        .unwrap()
        .then((response) => {
          console.log("Blog added successfully:", response);
          navigate(`/view-blog/${response.blog._id}`);
        })
        .catch((error) => {
          console.error("Failed to add blog:", error);
          // Handle error (e.g., showing an error message)
        });
    }

    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("content", text);
    // formData.append("tags", JSON.stringify(tags)); // Stringify array of tags
    // formData.append("authorID", localStorage.getItem("userId"));
    // if (image) {
    //   formData.append("blogImage", image);
    // }

    // const action = editMode ? updateBlog : addBlog; // Determine which action to dispatch based on mode

    // dispatch(action({ blogId, formData }))
    //   .unwrap()
    //   .then((response) => {
    //     // If edit mode, you may need to navigate to the updated blog's view
    //     if (editMode) {
    //       console.log("Blog updated successfully:", response);
    //       navigate(`/view-blog/${blogId}`);
    //     } else {
    //       console.log("Blog added successfully:", response);
    //       navigate(`/view-blog/${response.blog._id}`);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Failed to process blog:", error);
    //     // Handle error (e.g., showing an error message)
    //   });
  };

  return (
    <div
      className="flex justify-center py-8"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": { my: 1 },
          display: "flex",
          flexDirection: "column",
          width: "60%",
          alignContent: "center",
          justifyContent: "space-between",
          //   height: "calc(100vh - 64px)",
        }}
      >
        {/* <Typography variant="h4" gutterBottom>
          Add New Blog
        </Typography> */}
        <div>
          <TextField
            id="blog-title"
            placeholder="Title"
            value={title}
            variant="standard"
            onChange={handleTitleChange}
            fullWidth
            sx={{
              "& .MuiInputBase-input": { fontSize: "40px" },
            }}
            className="writeInput"
          />
          {imagePreview && (
            <Box sx={{ position: "relative" }}>
              <img
                className="shrink-0"
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", height: "350px" }}
              />
              <IconButton
                onClick={handleRemoveImage}
                // size="large"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "error.main",
                }}
              >
                <CloseIcon sx={{ fontSize: "30px !important" }} />
              </IconButton>
            </Box>
          )}
          <Box sx={{ position: "relative", width: "100%", mb: 2 }}>
            <IconButton
              aria-label="upload picture"
              component="label"
              sx={{ position: "absolute", left: "-60px", top: "20px" }}
            >
              <input
                accept="image/*"
                type="file"
                hidden
                onChange={handleImageChange}
              />
              <AddCircleOutlineIcon fontSize="large" />
            </IconButton>
            <TextField
              id="blog-text"
              placeholder="Tell your story..."
              variant="standard"
              multiline
              // rows={8}
              value={text}
              onChange={handleTextChange}
              fullWidth
              sx={{
                "& .MuiInputBase-input": { fontSize: "20px" },

                marginTop: "30px !important",
              }}
              // className="mt-4"
            />
          </Box>
        </div>

        <div className="flex space-y-6 justify-between items-center">
          <Autocomplete
            multiple
            className="w-[45%] "
            id="tags-filled"
            options={tagsList.map((option) => option.name)} // Use names for the options
            freeSolo
            value={tags} // This should be an array of tag names (strings)
            onChange={(event, newValue) => {
              setTags([...newValue]);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                // label="Tags"
                placeholder="Add Tags"
              />
            )}
          />
          <Button
            type="submit"
            variant="outline"
            color="primary"
            className="w-[45%] h-10 m-0"
            sx={{
              color: "white",
              borderColor: "#d84f2a",
              background: "#d84f2a",
              margin: "0px !important",
              "&:hover": {
                backgroundColor: "#f9744b",
                borderColor: "#f9744b",
              },
            }}
          >
            Publish
          </Button>
        </div>
      </Box>
    </div>
  );
}