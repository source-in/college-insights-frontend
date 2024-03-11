import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function stringAvatar(name) {
  return {
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function TopBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="justify-between">
          <div>
            {/* <p
              className="text-[#ff6c43] font-bold text-xl tracking-widest cursor-pointer"
              onClick={() => navigate("/")}
            >
              COLLAGE INSIGHTS
            </p> */}
            <img
              src="/images/home_logo.png"
              height={100}
              width={"300px"}
              onClick={() => navigate("/")}
              className="cursor-pointer m-2"
            />
          </div>
          <div className="space-x-4">
            <Button
              variant="outlined"
              onClick={() => navigate("/add-blog")}
              sx={{
                color: "black",
                borderColor: "#b8af93",
                background: "#b8af93",
                "&:hover": {
                  backgroundColor: "#CCC5AD", // Use the same background color on hover
                  borderColor: "#CCC5AD", // Optional: Adjust the border color on hover if desired
                },
              }}
              endIcon={<AddIcon />}
            >
              Add Blog
            </Button>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar
                {...stringAvatar(`${user?.firstName} ${user?.lastName}`)}
                sx={{ bgcolor: "#d6c4bo" }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  navigate("/settings");
                  handleClose();
                }}
              >
                My Account
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
