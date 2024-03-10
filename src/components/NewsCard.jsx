import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import moment from "moment";

const NewsCard = ({ title, text, imageUrl, published_at, url }) => {
  const handleCardClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        maxHeight: "100%",
        width: "100%",
        marginTop: "10px !important",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      {imageUrl && (
        <CardMedia
          component="img"
          sx={{ width: 120, height: "100%", flexShrink: 0 }} // Fixed width and height for the image
          image={imageUrl}
          alt="News image"
        />
      )}
      <CardContent sx={{ flex: 1, padding: "10px" }}>
        <Typography
          gutterBottom
          variant="body1"
          component="div"
          // sx={{ maxHeight: 100, overflowY: "auto" }}
        >
          {title?.length > 80 ? `${title.slice(0, 80)}...` : title}
          {/* {title} */}
        </Typography>
        <Typography className="text-right">
          {moment(published_at).startOf("ss").fromNow()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
