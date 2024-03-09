import React from "react";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  return (
    <>
      <TopBar />
      <div className="bg-gray-100">{children}</div>
    </>
  );
};

export default Layout;
