import { useState } from "react";

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikeButtonClick = () => {
    handleLike(blog.id);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button
          onClick={() => setVisible(!visible)}
          style={{ marginLeft: "8px", marginBottom: "8px" }}
        >
          {visible ? "hide" : "view"}
        </button>
      </div>
      <div style={visible ? { display: "" } : { display: "none" }}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={handleLikeButtonClick} style={{ marginLeft: "8px" }}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  );
};

export default Blog;
