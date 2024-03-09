import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WriteBlog.css";

import { Select } from "antd";

import AddIcon from "@mui/icons-material/Add";

import {
  handleFileState,
  handleState,
  mergeArrayToString,
} from "../../utils/helper";
import { defaultTagOption } from "../../utils/constants";

function WriteBlog() {
  const [rows, setRows] = React.useState(10);

  const [blogContent, setBlogContent] = useState({
    title: "",
    content: "",
    authorID: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token")).userID
      : "",
    blogImage: "",
    blogtag: "",
  });

  const Navigate = useNavigate();

  const handleTagOptionChange = (value) => {
    setBlogContent((prev) => ({ ...prev, blogtag: mergeArrayToString(value) }));
  };

  const submitBlog = (e) => {
    e.preventDefault();
    var blogdata = new FormData();

    Object.keys(blogContent).map((key) => {
      blogdata.append(key, blogContent[key]);
    });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/handleBlog/addBlog`, blogdata)
      .then(() => {
        Navigate("/showblog");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const rowlen = blogContent.content.split("\n");

    if (rowlen.length > 10) {
      setRows(rowlen.length);
    }
  }, [blogContent.content]);

  return (
    <>
      <div className="write">
        <form className="writeForm">
          <div className="writeFormGroup">
            <input
              type="text"
              placeholder="Title"
              className="writeInput"
              name="title"
              autoFocus={true}
              onChange={(e) => {
                handleState(e, setBlogContent);
              }}
            />
          </div>
          {blogContent.blogImage !== "" ? (
            <img
              src={URL.createObjectURL(blogContent.blogImage)}
              alt="uploadedProduct"
              width="100%"
              height="300px"
              style={{ marginTop: "30px", objectFit: "cover" }}
            />
          ) : null}
          <div className="writeFormGroup">
            <label htmlFor="fileInput">
              <AddIcon
                sx={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  border: "1px solid",
                  fontSize: "20px",
                  color: "gray",
                  marginTop: "13px",
                  marginLeft: "-30px",
                }}
              />
            </label>
            <input
              type="file"
              id="fileInput"
              name="blogImage"
              className="fileInputField"
              onChange={(e) => {
                handleFileState(e, setBlogContent);
              }}
              style={{ visibility: "hidden" }}
            />
            <textarea
              rows={rows}
              name="content"
              onChange={(e) => handleState(e, setBlogContent)}
              placeholder="Tell your story..."
              type="text"
              className="writeInput writeText"
              id="blogContent"
            ></textarea>
          </div>
          <Select
            className="selectBar"
            mode="tags"
            placeholder="Select Blog Category tags"
            onChange={handleTagOptionChange}
          >
            {defaultTagOption.map((tag) => (
              <Select.Option key={tag}>{tag}</Select.Option>
            ))}
          </Select>
          <button
            className="writeSubmit"
            onClick={(e) => {
              submitBlog(e);
            }}
          >
            Publish
          </button>
        </form>
      </div>
    </>
  );
}

export default WriteBlog;
