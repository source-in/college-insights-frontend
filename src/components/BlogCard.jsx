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

const Blog = (blog) => {
  const likesCount = 10;
  const commentsCount = 5;

  const navigate = useNavigate();

  return (
    <Card
      className="w-full p-4 cursor-pointer"
      onClick={() => navigate(`/view-blog/${blog._id}`)}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog?.title}
        </Typography>
        {!blog?.blogImage && (
          <Typography variant="body2" color="text.secondary">
            {blog?.content}
          </Typography>
        )}
      </CardContent>
      {blog?.blogImage && (
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:3001/static/${blog?.blogImage}`}
          alt="Blog image"
        />
      )}
      {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
          <Typography paddingLeft={0.5}>{blog.likes.length}</Typography>
        </IconButton>
        <IconButton aria-label="comment">
          <CommentIcon />
          <Typography paddingLeft={0.5}>{commentsCount}</Typography>
        </IconButton>
      </CardActions> */}
      {blog?.tags && blog?.tags.length > 0 && (
        <CardContent>
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
        </CardContent>
      )}
    </Card>
  );
};

export default Blog;
