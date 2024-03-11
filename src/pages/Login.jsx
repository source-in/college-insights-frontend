import { useState, useEffect } from "react";
import loginBackgroundImage from "../assets/loginBackgroundImage.jpg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import TimedAlert from "../components/Alert";

const Login = () => {
  const dispatch = useDispatch();
  const textFieldHeight = "3rem";

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const error = useSelector((state) => state.user.error);

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Immediate validation for input fields
    // if (name === "email") {
    //   if (!/\S+@\S+\.\S+/.test(value)) {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       email: "Invalid email format",
    //     }));
    //   } else {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       email: "",
    //     }));
    //   }
    // }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!loginData.email) tempErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(loginData.email))
      tempErrors.email = "Invalid email format";
    if (!loginData.password) tempErrors.password = "Password is required";
    // Optionally, add minimum length validation for password
    if (loginData.password.length < 8)
      tempErrors.password = "Password must be at least 8 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    if (error) {
      setAlertInfo({
        show: true,
        message: error, // Directly use the updated error from the Redux store
        severity: "error",
        key: new Date().getTime(), // Ensure a unique key for re-rendering
      });
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with form submission
      dispatch(loginUser(loginData)).then((actionResult) => {
        if (loginUser.fulfilled.match(actionResult)) {
          // The action was successful, set alert for success
          setAlertInfo({
            show: true,
            message: "Login successful!",
            severity: "success",
            key: new Date().getTime(),
          });
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#F1F6E4]">
      {alertInfo.show && (
        <TimedAlert
          message={alertInfo.message}
          severity={alertInfo.severity}
          key={alertInfo.key}
        />
      )}
      <div className="flex-1 flex justify-center items-center md:w-2/5 w-full">
        <form
          className="w-4/5 md:w-3/5 h-3/5 text-center"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <img
              src="/images/login_logo.png"
              width={"200px"}
              className="m-auto mb-5"
            />
          </div>
          <div className="flex flex-col space-y-2 font-semibold">
            <h1 className="text-4xl tracking-wide font-bold">Welcome back!</h1>
            <p className="tracking-wide font-normal">
              Enter your details below
            </p>
          </div>
          <div className="flex flex-col space-y-8 mt-8">
            <TextField
              required
              id="outlined-required"
              name="email"
              label="Email Id"
              value={loginData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                backgroundColor: "transparent",
                borderRadius: "8px",
                height: textFieldHeight,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: {
                  height: textFieldHeight,
                  paddingTop: 0,
                  paddingBottom: 0,
                  fontSize: "0.75rem",
                },
                placeholder: "Enter your email address",
              }}
            />
            <TextField
              required
              id="outlined-password-input"
              name="password"
              label="Password"
              type="password"
              value={loginData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                backgroundColor: "transparent",
                borderRadius: "5px",
                height: textFieldHeight,
              }}
              InputProps={{
                style: {
                  height: textFieldHeight,
                  paddingTop: 0,
                  paddingBottom: 0,
                  fontSize: "0.75rem",
                },
                placeholder: "Enter your password",
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ height: textFieldHeight, fontSize: "0.875rem" }}
              onClick={handleSubmit}
            >
              Login
            </Button>
          </div>
          <div className="mt-8 text-sm text-center">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
      <div
        className="md:w-3/5 w-full bg-contain hidden md:block"
        style={{ backgroundImage: `url(${loginBackgroundImage})` }}
      ></div>
    </div>
  );
};

export default Login;
