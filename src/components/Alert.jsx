import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import { createPortal } from "react-dom";

const TimedAlert = ({ message, severity }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, severity]);

  if (!show) return null;

  return createPortal(
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
      <Alert severity={severity}>{message}</Alert>
    </div>,
    document.body
  );
};

export default TimedAlert;
