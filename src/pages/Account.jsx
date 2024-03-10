import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Typography,
  TextField,
  Box,
  useRadioGroup,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
} from "@mui/material";
import { fetchUserBlogs, deleteBlog } from "../features/blogs/blogsSlice";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TimedAlert from "../components/Alert";

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

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userBlogs = useSelector((state) => state.blogs.userBlogs);

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserBlogs(user?._id));
    }
  }, [dispatch]);

  //   console.log(userBlogs);

  const handleDelete = (blogId) => {
    dispatch(deleteBlog(blogId)).then(() => {
      dispatch(fetchUserBlogs(user?._id));
      setAlertInfo({
        show: true,
        message: "Blog Deleted Successfully!",
        severity: "success",
        key: new Date().getTime(),
      });
    });
  };

  const handleEdit = (blogId) => {
    navigate(`/add-blog?edit=true&blogId=${blogId}`);
  };

  return (
    <div
      className="w-full p-8 flex"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {alertInfo.show && (
        <TimedAlert
          message={alertInfo.message}
          severity={alertInfo.severity}
          key={alertInfo.key}
        />
      )}
      <div className="w-2/3 p-4">
        <div className="w-full h-full bg-white rounded-lg p-8 shadow-md">
          <h1 className="text-2xl">My Blogs</h1>
          <div className="flex flex-col space-y-6 mt-10">
            {userBlogs.length > 0 &&
              userBlogs.map((blog, index) => (
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    maxHeight: 200,
                    width: "100%",
                  }}
                  className="hover:shadow-lg p-2"
                >
                  {blog.blogImage && (
                    <CardMedia
                      component="img"
                      sx={{ width: 150, height: 150, flexShrink: 0 }} // Fixed width and height for the image
                      src={`http://localhost:3001/static/${blog?.blogImage}`}
                      alt="News image"
                    />
                  )}
                  <CardContent
                    onClick={() => navigate(`/view-blog/${blog._id}`)}
                    className="cursor-pointer"
                    sx={{ flex: 1, overflow: "hidden" }}
                  >
                    <h1 className="text-xl ">{blog.title}</h1>
                    <h1
                      className="text-md"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: "3",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {blog.content}
                    </h1>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(blog._id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(blog._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
          </div>
        </div>
      </div>
      <div className="w-1/3 p-4">
        <div className="w-full h-full bg-white rounded-lg p-8 shadow-md flex flex-col space-y-12">
          <h1 className="text-2xl text-center">Account Information</h1>
          <div className="flex flex-col space-y-8 items-center">
            <Avatar
              alt="Remy Sharp"
              {...stringAvatar(`${user?.firstName} ${user?.lastName}`)}
              sx={{ width: 120, height: 120, fontSize: "2.5rem" }}
            />
            <TextField
              label="Name"
              value={`${user?.firstName} ${user?.lastName}`}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              value={user?.email}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Password"
              value={"********"} // Replace user.password with your method of retrieving the password length or a placeholder
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
