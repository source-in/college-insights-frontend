import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TimedAlert from "../components/Alert";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userSlice";

const Register = () => {
  const dispatch = useDispatch();
  const textFieldHeight = "3rem";
  const navigate = useNavigate();

  const error = useSelector((state) => state.user.error);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Immediate validation for confirm password
    if (name === "confirmPassword" || name === "password") {
      if (name === "password") {
        if (value.length < 8) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "Password must be at least 8 characters",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "",
          }));
        }
      }
      if (name === "confirmPassword" && value !== formData.password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match",
        }));
      } else if (
        name === "password" &&
        formData.confirmPassword !== value &&
        formData.confirmPassword !== ""
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "",
        }));
      }
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "First name is required";
    if (!formData.lastName) tempErrors.lastName = "Last name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.password) tempErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

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
      dispatch(registerUser(formData)).then((actionResult) => {
        if (registerUser.fulfilled.match(actionResult)) {
          // The action was successful, set alert for success
          setAlertInfo({
            show: true,
            message: "Registration successful! Redirecting to the login page",
            severity: "success",
            key: new Date().getTime(),
          });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      });
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {alertInfo.show && (
        <TimedAlert
          message={alertInfo.message}
          severity={alertInfo.severity}
          key={alertInfo.key}
        />
      )}
      <div className="w-1/3">1</div>
      <div className="w-2/3 flex place-items-center justify-center">
        <div className="w-3/5 h-4/5">
          <div className="flex flex-col space-y-2 font-semibold">
            <h1 className="text-4xl tracking-wide">Sign Up</h1>
            <p className="tracking-wide font-normal">
              Enter your details below
            </p>
          </div>
          <div className="flex flex-col space-y-8 mt-8">
            <div className="flex space-x-4">
              <TextField
                fullWidth
                required
                name="firstName"
                id="outlined-required"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{
                  backgroundColor: "white",
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
                  placeholder: "Enter your first name",
                }}
              />
              <TextField
                fullWidth
                required
                name="lastName"
                id="outlined-required"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                sx={{
                  backgroundColor: "white",
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
                  placeholder: "Enter your last name",
                }}
              />
            </div>
            <TextField
              required
              id="outlined-required"
              label="Email Id"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                backgroundColor: "white",
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
            {/* <TextField
              required
              id="date-of-birth"
              label="Date of Birth"
              type="date"
              //   defaultValue="2000-01-01"
              sx={{
                backgroundColor: "white",
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
              }}
            /> */}
            <TextField
              required
              id="outlined-password-input"
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                backgroundColor: "white",
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
            <TextField
              required
              id="outlined-password-input"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              autoComplete="current-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                backgroundColor: "white",
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
                placeholder: "Enter your password again",
              }}
            />

            <Button
              variant="contained"
              type="submit"
              sx={{ height: textFieldHeight, fontSize: "0.875rem" }}
              onClick={handleSubmit}
            >
              Register
            </Button>
          </div>
          <div className="mt-8 text-sm text-center">
            <span>Already Registered? </span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
