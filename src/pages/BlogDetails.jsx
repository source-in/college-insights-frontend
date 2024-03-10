import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import {
  Avatar,
  Chip,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentIcon from "@mui/icons-material/Comment";
import {
  fetchComments,
  postComment,
  likeBlog,
  unlikeBlog,
  fetchBlogById,
  fetchRelatedBlogs,
} from "../features/blogs/blogsSlice";
import { useNavigate } from "react-router-dom";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const BlogDetails = () => {
  const { blogID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blog = useSelector((state) => state.blogs.blog);
  const comments = useSelector((state) => state.blogs.comments);
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.blogs.status);
  const relatedBlogs = useSelector((state) => state.blogs.relatedBlogs);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (blogID) {
      dispatch(fetchBlogById(blogID));
      dispatch(fetchRelatedBlogs(blogID));
    }
  }, [dispatch, blogID]);

  useEffect(() => {
    if (blogID) {
      dispatch(fetchComments(blogID));
    }
  }, [dispatch]);

  const handlePostComment = () => {
    const commentData = {
      blogID: blogID,
      userID: user._id,
      comment,
    };
    dispatch(postComment(commentData)).then(() => {
      setComment("");
      dispatch(fetchComments(blogID));
    });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const userHasLiked = blog?.likes?.includes(user._id);

  const handleLikeOrUnlike = () => {
    if (userHasLiked) {
      dispatch(unlikeBlog({ blogID, userID: user._id })).then(() => {
        dispatch(fetchBlogById(blogID));
      });
    } else {
      dispatch(likeBlog({ blogID, userID: user._id })).then(() => {
        dispatch(fetchBlogById(blogID));
      });
    }
  };

  //   console.log(relatedBlogs);

  useEffect(() => {
    dispatch(fetchBlogById(blogID));
  }, []);

  //   if (status === "loading") {
  //     return <div>Loading...</div>;
  //   }

  //   if (status === "failed") {
  //     return <div>Error: {error}</div>;
  //   }

  return (
    <div
      className="w-full p-8 flex"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="w-2/3 flex flex-col p-4 space-y-4">
        <div className="flex justify-start place-items-center space-x-2">
          <div>
            <Avatar
              {...stringAvatar(
                `${blog?.authorID?.firstName} ${blog?.authorID?.lastName}`
              )}
            />
          </div>
          <div className="flex flex-col">
            <Typography variant="p">
              {blog?.authorID?.firstName} {blog?.authorID?.lastName}
            </Typography>
            <p>{moment(blog?.createdAt).format("MMMM d, YYYY")}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <Typography variant="h4" gutterBottom className="blog_title">
            {blog?.title}
          </Typography>
          {blog?.blogImage && (
            <img
              src={`http://localhost:3001/static/${blog?.blogImage}`}
              className="mainBlogImage"
              alt="blogPic"
            />
          )}
          {/* <Typography variant="body1" gutterBottom>
            {blog?.content}
          </Typography> */}
          <div className="mainblogContentHolder">
            {blog?.content?.split("\n").map((item) => (
              <p className="blogContentText">{item}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-start flex-wrap">
          {blog?.tags &&
            blog.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.name}
                sx={{ borderRadius: "4px" }}
                style={{ marginRight: "8px", marginBottom: "8px" }}
              />
            ))}
        </div>
        <div className="h-8">
          <IconButton
            aria-label="add to favorites"
            onClick={handleLikeOrUnlike}
          >
            {/* {!userHasLiked ? <ThumbUpIcon /> : <ThumbDownAltIcon />} */}
            <FavoriteIcon
              sx={{ color: `${blog?.likes?.includes(user._id) ? "red" : ""}` }}
            />
            <Typography paddingLeft={0.5}>{blog?.likes?.length}</Typography>
          </IconButton>
          <IconButton aria-label="comment" onClick={toggleComments}>
            <CommentIcon />
            <Typography paddingLeft={0.5}>{comments?.length}</Typography>
          </IconButton>
        </div>
        {showComments && (
          <Box sx={{}}>
            <Typography variant="h6">Comments</Typography>
            <List>
              {comments.length > 0 &&
                comments.map((comment, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        {...stringAvatar(
                          `${comment?.userID?.firstName} ${comment?.userID?.lastName}`
                        )}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${comment?.userID?.firstName} ${comment?.userID?.lastName}`}
                      secondary={comment.comment}
                    />
                  </ListItem>
                ))}
            </List>
            <Box
              component="form"
              sx={{ display: "flex", alignItems: "center", pt: 2 }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
              />
              <Button onClick={handlePostComment} sx={{ ml: 2 }}>
                Post
              </Button>
            </Box>
          </Box>
        )}
      </div>
      <div className="w-1/3 flex flex-col p-4 space-y-4">
        <Typography variant="h5" gutterBottom>
          Related Blogs
        </Typography>
        {relatedBlogs &&
          relatedBlogs.map((blog, index) => (
            <Card
              key={index}
              onClick={() => navigate(`/view-blog/${blog._id}`)}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                maxHeight: 200,
                width: "100%",
              }}
              className="cursor-pointer"
            >
              {blog.blogImage && (
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: "100%", flexShrink: 0 }} // Fixed width and height for the image
                  src={`http://localhost:3001/static/${blog?.blogImage}`}
                  alt="News image"
                />
              )}
              <CardContent sx={{ flex: 1, overflow: "hidden" }}>
                <Typography
                  gutterBottom
                  variant="body1"
                  component="div"
                  sx={{ maxHeight: 100, overflowY: "auto" }}
                >
                  {/* {blog.title} */}
                  {blog.title?.length > 80
                    ? `${blog.title.slice(0, 80)}...`
                    : blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {/* {blog.content} */}
                  {blog.content?.length > 80
                    ? `${blog.content.slice(0, 80)}...`
                    : blog.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default BlogDetails;
