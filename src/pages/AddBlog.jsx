import React, { useState } from "react";
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
import { useDispatch } from "react-redux";
import { addBlog } from "../features/blogs/blogsSlice";
import { useNavigate } from "react-router-dom";

export default function AddBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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
            label="Title"
            value={title}
            variant="standard"
            onChange={handleTitleChange}
            fullWidth
          />
          {imagePreview && (
            <Box sx={{ position: "relative" }}>
              <img
                className="shrink-0"
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%" }}
              />
              <IconButton
                onClick={handleRemoveImage}
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "error.main",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
          <Box sx={{ position: "relative", width: "100%", mb: 2 }}>
            <IconButton
              aria-label="upload picture"
              component="label"
              sx={{ position: "absolute", left: "-40px", top: "20px" }}
            >
              <input
                accept="image/*"
                type="file"
                hidden
                onChange={handleImageChange}
              />
              <AddCircleOutlineIcon />
            </IconButton>
            <TextField
              id="blog-text"
              label="Text"
              variant="standard"
              multiline
              rows={8}
              value={text}
              onChange={handleTextChange}
              fullWidth
            />
          </Box>
        </div>

        <div className="flex flex-col space-y-6">
          <Autocomplete
            multiple
            id="tags-filled"
            options={tags.map((option) => option)}
            freeSolo
            value={tags}
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
                label="Tags"
                placeholder="Add Tags"
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Publish
          </Button>
        </div>
      </Box>
    </div>
  );
}
