import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Layout from "./layout/Layout";

// Import your page components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AddBlog from "./pages/AddBlog";
import WriteBlog from "./pages/WriteBlog/WriteBlog";
import BlogDetails from "./pages/BlogDetails";
import { useDispatch } from "react-redux";
import { getParticularUser } from "./features/user/userSlice";
import Account from "./pages/Account";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();

  const userID = localStorage.getItem("userId");

  const theme = createTheme({
    palette: {
      primary: {
        main: "#102937",
      },
    },
    typography: {
      h5: {
        fontSize: "30px",
        fontWeight: "600",
      },
    },
  });

  useEffect(() => {
    if (userID) {
      dispatch(getParticularUser({ userID }));
    } else {
      setIsLogin(false);
    }
  }, []);

  // Array of routes that require the user to be authenticated
  const protectedRoutes = [
    { path: "/", element: <Home /> },
    { path: "/add-blog", element: <AddBlog /> },
    { path: "*", element: <NotFound /> },
    { path: "/view-blog/:blogID", element: <BlogDetails /> },
    { path: "/settings", element: <Account /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Routes for Login and Register which don't require the user to be authenticated */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Map through protected routes and apply the same layout and authentication logic */}
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                userID ? (
                  <Layout>{element}</Layout>
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
          ))}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
