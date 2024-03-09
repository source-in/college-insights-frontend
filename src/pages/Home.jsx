import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Blog from "../components/BlogCard";
import NewsCard from "../components/NewsCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../features/news/newsSlice";
import { fetchAllBlogs } from "../features/blogs/blogsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [tags, setTags] = useState(["Tag1", "Tag2", "Tag3"]); // Example tags
  const { articles } = useSelector((state) => state.news);
  const blogs = useSelector((state) => state.blogs.blogs);

  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const handleDelete = (tagToDelete) => () => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  // const blogs = [
  //   {
  //     title: "Blog Post 1",
  //     text: "This is a great blog post.",
  //     imageUrl: "https://via.placeholder.com/150",
  //     tags: ["Tech", "React", "Material-UI"],
  //   },
  //   { title: "Blog Post 2", text: "Here's some insightful content." },
  //   {
  //     title: "Blog Post 3",
  //     text: "More fascinating insights here.",
  //     imageUrl: "https://via.placeholder.com/150",
  //     tags: ["Tech", "React", "Material-UI"],
  //   },
  //   {
  //     title: "Blog Post 4",
  //     text: "Why we love tech.",
  //     imageUrl: "https://via.placeholder.com/150",
  //   },
  //   { title: "Blog Post 5", text: "Exploring the outdoors." },
  // ];

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <div
      className="flex w-full"
      style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}
    >
      <div className="w-1/6 overflow-auto py-8 px-4 bg-gray-100">
        {" "}
        {/* Adjusted background for visibility */}
        {/* Search Bar */}
        <TextField
          id="search-bar"
          label="Search Tags"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
        />
        {/* Tags/Chips */}
        <Box>
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
        </Box>
      </div>
      <div className="w-3/5 py-8 px-4 overflow-auto bg-gray-100">
        <div className="flex flex-col items-center space-y-8">
          {blogs.map((blog, index) => (
            <Blog key={index} {...blog} />
          ))}
        </div>
      </div>
      <div className="w-2/6 h-full overflow-auto flex flex-col items-center py-8 px-2 font-semibold">
        <div className="flex flex-col items-center px-2 space-y-8">
          <h1 className="text-2xl tracking-wide">Recent News</h1>
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              title={article.title}
              text={article.description}
              imageUrl={article.image_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
