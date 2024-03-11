import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import "./BlogCard.css";
import moment from "moment";
import ModeIcon from "@mui/icons-material/Mode";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const Blog = (blog) => {
  const likesCount = 10;
  const commentsCount = 5;

  const navigate = useNavigate();

  return (
    <div
      className="w-full p-0 cursor-pointer blog_card"
      onClick={() => navigate(`/view-blog/${blog._id}`)}
    >
      {blog?.blogImage && (
        <CardMedia
          component="img"
          height="100"
          image={`${blog?.blogImage}`}
          alt="Blog image"
          className="blog_image"
          sx={{ borderRadius: "10px 10px 0px 0px" }}
        />
      )}
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="blogHeading"
        >
          {blog?.title}
        </Typography>
        <div className="AuthorandDate">
          <div className="authorName">
            <ModeIcon
              sx={{
                color: "#163A50",
                marginRight: "5px",
                marginTop: "5px",
              }}
            />
            <p>
              {blog?.authorID?.firstName} {blog?.authorID?.lastName}
            </p>
          </div>
          <div className="blogDate">
            <CalendarMonthIcon
              sx={{
                color: "#163A50",
                marginRight: "5px",
                marginTop: "5px",
              }}
            />
            <p>{moment(blog?.createdAt).format("MMMM D, YYYY")}</p>
          </div>
        </div>
        <br />
        <p
          // variant="body2"
          // color="text.secondary"
          className="smallBlogContent"
        >
          {blog?.content?.length > 150
            ? `${blog?.content.slice(0, 300)}...`
            : blog?.content}
        </p>

        {blog?.tags && blog?.tags?.length > 0 && (
          <CardContent>
            <div className="CategoryButtonContainer">
              {blog?.tags &&
                blog.tags.map((tag, index) => (
                  <button className="tagButton ">{tag?.name}</button>
                ))}
            </div>
          </CardContent>
        )}
      </CardContent>
    </div>
  );
};

export default Blog;
