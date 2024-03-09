import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NewsCard = ({ title, text, imageUrl }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        maxHeight: 100,
        width: "100%",
      }}
    >
      {imageUrl && (
        <CardMedia
          component="img"
          sx={{ width: 100, height: 100, flexShrink: 0 }} // Fixed width and height for the image
          image={imageUrl}
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
          {title}
        </Typography>
        {/* If you want the description to be scrollable as well, wrap it in a Box with overflowY: 'auto' */}
        {/* <Box sx={{ maxHeight: 100, overflowY: "auto" }}>
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </Box> */}
      </CardContent>
    </Card>
  );
};

export default NewsCard;
