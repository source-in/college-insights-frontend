import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "./MostLikedBlog.css";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector } from "react-redux";

function MostLikedBlog() {
  const Navigate = useNavigate();
  const mostLiked = useSelector((state) => state.blogs.mostLiked);
  return (
    <div className="conponentContainer mt-6">
      <h2 className="componentHeading">Most Liked Blogs</h2>
      {mostLiked?.map((blog) => (
        <div
          className="mostLikedBlogContainer mb-4"
          onClick={() => {
            Navigate(`/view-blog/${blog._id}`);
          }}
        >
          <div
            className={`mostLikeBlogDataContainer ${
              blog?.blogImage ? "w-[75%]" : "w-full"
            }`}
          >
            <p className="mostLikedBlogTitle">
              {blog.title.length > 40
                ? `${blog.title.slice(0, 40)}...`
                : blog.title}
            </p>

            <div className="likeAndCountHolder">
              <FavoriteIcon fontSize="14px" />
              <p>{blog.likes.length}</p>
            </div>
          </div>
          {blog.blogImage && (
            <div>
              <img
                src={`${blog.blogImage}`}
                width="70px"
                className="h-full object-cover"
                style={{
                  marginTop: "5px",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MostLikedBlog;
