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
  Modal,
  Button,
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userBlogs = useSelector((state) => state.blogs.userBlogs);
  const [open, setOpen] = useState(false);
  const [selectedBlog, setselectedBlog] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // console.log(userBlogs, user?._id);

  const handleDelete = (blogId) => {
    dispatch(deleteBlog(blogId)).then(() => {
      dispatch(fetchUserBlogs(user?._id));
      setAlertInfo({
        show: true,
        message: "Blog Deleted Successfully!",
        severity: "success",
        key: new Date().getTime(),
      });
      handleClose();
    });
  };

  const handleEdit = (blogId) => {
    navigate(`/add-blog?edit=true&blogId=${blogId}`);
  };

  return (
    <div
      className="w-full p-8 flex"
      style={{ maxHeight: "calc(100vh - 88px)" }}
    >
      {alertInfo.show && (
        <TimedAlert
          message={alertInfo.message}
          severity={alertInfo.severity}
          key={alertInfo.key}
        />
      )}
      <div className="w-2/3 p-4">
        <div className="w-full bg-white rounded-lg p-8 shadow-md ">
          <Typography
            variant="h5"
            className="text-2xl font-bold text-[#102937]"
          >
            My Blogs
          </Typography>
          <div
            className="flex flex-col space-y-6 mt-10 my_blog_container"
            style={{
              // maxHeight: "calc(100vh - 100px)",
              height: "calc(100vh - 320px)",
              overflowY: "auto",
            }}
          >
            {userBlogs.length > 0 &&
              userBlogs.map((blog, index) => (
                <div
                  key={index}
                  // sx={{
                  //   display: "flex",
                  //   flexDirection: "row",
                  //   alignItems: "flex-start",
                  //   maxHeight: 200,
                  //   width: "100%",
                  // }}
                  className="hover:shadow-lg p-2 w-full max-h-[200px] flex items-start blog_card"
                >
                  {blog.blogImage && (
                    <CardMedia
                      component="img"
                      sx={{ width: 150, height: 150, flexShrink: 0 }} // Fixed width and height for the image
                      src={`${blog?.blogImage}`}
                      alt="News image"
                    />
                  )}
                  <CardContent
                    onClick={() => navigate(`/view-blog/${blog._id}`)}
                    className="cursor-pointer"
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                      padding: "0px 0px 0px 15px !important",
                    }}
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
                      {blog?.content}
                    </h1>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(blog?._id)}
                    >
                      <EditIcon sx={{ color: "#102937" }} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setselectedBlog(blog?._id);
                        handleOpen();
                      }}
                      sx={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="w-1/3 p-4">
        <div className="w-full h-full bg-white rounded-lg p-8 shadow-md flex flex-col space-y-12">
          <Typography
            variant="h5"
            className="text-2xl text-center font-bold text-[#102937]"
          >
            Account Information
          </Typography>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography> */}
          <p id="modal-modal-description" className="text-xl">
            Are you sure you want to delete this blog post? This action cannot
            be undone and will permanently remove the post from our records.
          </p>
          <div className="flex justify-evenly mt-5">
            <Button
              onClick={() => handleDelete(selectedBlog)}
              variant="contained"
              className="w-1/3"
            >
              Delete
            </Button>
            <Button onClick={handleClose} variant="outline" className="w-1/3">
              Cancle
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Account;
