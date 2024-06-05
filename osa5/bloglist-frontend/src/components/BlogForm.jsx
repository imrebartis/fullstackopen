import { useState } from "react";

const BlogForm = ({ createBlog, setErrorMessage }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    if (!newTitle && !newUrl) {
      setErrorMessage("Title and url are required");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    if (!newTitle) {
      setErrorMessage("Title is required");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    if (!newUrl) {
      setErrorMessage("Url is required");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  return (
    <form onSubmit={addBlog} style={{ marginBottom: "16px" }}>
      <h2>create new</h2>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        title
        <input
          type="text"
          style={{ marginLeft: "8px" }}
          id="title"
          name="title"
          value={newTitle}
          onChange={handleTitleChange}
          autoComplete="off"
        ></input>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        author
        <input
          type="text"
          style={{ marginLeft: "8px" }}
          id="author"
          name="author"
          value={newAuthor}
          onChange={handleAuthorChange}
          autoComplete="off"
        ></input>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        url:
        <input
          type="text"
          style={{ marginLeft: "8px" }}
          id="url"
          name="url"
          value={newUrl}
          onChange={handleUrlChange}
          autoComplete="off"
        ></input>
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
