import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Blog from "../components/BlogCard";
import NewsCard from "../components/NewsCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../features/news/newsSlice";
import { fetchAllBlogs } from "../features/blogs/blogsSlice";
import { Typography } from "@mui/material";
import { getParticularUser } from "../features/user/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [selectedTags, setSelectedTags] = useState([]);
  const { articles } = useSelector((state) => state.news);
  const blogs = useSelector((state) => state.blogs.blogs);
  const [tagsList, setTagsList] = useState([]);

  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/handleBlog/getAllTags`
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

  const userID = localStorage.getItem("userId");

  useEffect(() => {
    // dispatch(fetchNews());
    dispatch(getParticularUser({ userID }));
    dispatch(fetchAllBlogs());
    fetchTags();
  }, [dispatch]);

  const handleDelete = (chipToDelete) => () => {
    setSelectedTags((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const getFilteredBlogs = () => {
    if (selectedTags.length === 0) {
      return blogs; // If no tags selected, return all blogs
    }
    // Return blogs that have at least one tag that matches the selected tags
    return blogs.filter((blog) =>
      blog.tags.some((tag) => selectedTags.includes(tag.name))
    );
  };

  // Call the above function to get the filtered blogs
  const filteredBlogs = getFilteredBlogs();

  return (
    <div
      className="flex w-full"
      style={{ height: "calc(100vh - 88px)", overflow: "hidden" }}
    >
      <div className="w-1/6 overflow-auto py-8 px-4 bg-gray-100">
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Filter Tags
          </Typography>
          <Autocomplete
            multiple
            fullWidth
            id="tags-filled"
            options={tagsList.map((option) => option.name)}
            filterSelectedOptions
            value={selectedTags}
            onChange={(event, newValue) => {
              setSelectedTags(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Add Tags"
              />
            )}
            renderTags={() => null} // Prevents tags from rendering in the input field
          />
          {/* Render chips below the input */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 2 }}>
            {selectedTags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={handleDelete(tag)}
                sx={{
                  bgcolor: "#f1ecd9",
                  padding: "",
                  borderRadius: "10px",
                }}
              />
            ))}
          </Box>
          {/* <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{ mt: 2 }}
            className="space-y-4"
          >
            {selectedTags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={handleDelete(tag)}
                sx={{
                  bgcolor: "#c0dced",
                  padding: "",
                  borderRadius: "10px",
                }}
              />
            ))}
          </Stack> */}
        </Box>
        {/* Adjusted background for visibility */}
        {/* Search Bar */}
        {/* <TextField
          id="search-bar"
          label="Search Tags"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
        /> */}
        {/* Tags/Chips */}
        {/* <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={handleDelete(tag)}
                color="primary"
              />
            ))}
          </Stack>
        </Box> */}
        {/* <div className="CategoryButtonContainer">
          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Filter Tags
          </Typography>
          <Autocomplete
            multiple
            fullWidth
            className="w-[45%] "
            id="tags-filled"
            options={tagsList.map((option) => option.name)} // Use names for the options
            filterSelectedOptions
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
                variant="outlined"
                // label="Tags"
                placeholder="Add Tags"
                // sx={{ bgcolor: "white" }}
              />
            )}
          /> */}
        {/* <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Top Tags
          </Typography>
          <button
            className="tagButton"
            onClick={() => {
              searchByTag("All");
            }}
          >
            All
          </button>
          <button
            className="tagButton"
            onClick={() => {
              searchByTag("Technology");
            }}
          >
            Technology
          </button>
          <button
            className="tagButton"
            onClick={() => {
              searchByTag("Environment");
            }}
          >
            Environment
          </button>
          <button
            className="tagButton"
            onClick={() => {
              searchByTag("Nature");
            }}
          >
            Nature
          </button>
          <button
            className="tagButton"
            onClick={() => {
              searchByTag("e-commerce");
            }}
          >
            E-commerce WebApp
          </button>
          <button
            className="tagButton"
            onClick={() => {
              searchByTag("Programing");
            }}
          >
            Programing
          </button>
          <button
            className="tagButton"
            onClick={() => {
              searchByTag("MongoDB");
            }}
          >
            MongoDB
          </button> */}
        {/* </div> */}
      </div>
      <div className="w-3/5 py-8 px-4 overflow-auto bg-gray-100 blog_container">
        {filteredBlogs.length > 0 ? (
          <div className="flex flex-col items-center space-y-8">
            {filteredBlogs.map((blog, index) => (
              <Blog key={index} {...blog} />
            ))}
          </div>
        ) : (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginTop: "20px" }}
          >
            No blogs to display
          </Typography>
        )}
      </div>
      <div className="w-2/6 h-full overflow-auto flex flex-col items-center py-8 px-2 font-semibold ">
        <div className="flex flex-col items-center px-2 space-y-8">
          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Recent News
          </Typography>
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              title={article.title}
              imageUrl={article.image_url}
              published_at={article.pubDate}
              url={article.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
