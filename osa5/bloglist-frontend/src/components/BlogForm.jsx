const BlogForm = ({
  newTitle,
  newAuthor,
  newUrl,
  addBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => {
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
