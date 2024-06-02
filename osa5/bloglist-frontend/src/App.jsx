import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
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

  const addBlog = (event) => {
    event.preventDefault();

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

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };

    const createBlog = async (blogObject) => {
      try {
        const returnedBlog = await blogService.create(blogObject);
        setBlogs([...blogs, returnedBlog]);
        setNewTitle("");
        setNewAuthor("");
        setNewUrl("");
      } catch (error) {
        console.error("Error creating blog:", error);
        if (error.response && error.response.status === 401) {
          setErrorMessage("Your session has expired. Please log in again.");
        } else {
          setErrorMessage("Error creating blog");
        }
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    };

    createBlog(blogObject);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout} style={{ marginLeft: "8px" }}>
          log out
        </button>
      </div>
      <BlogForm
        newTitle={newTitle}
        newAuthor={newAuthor}
        newUrl={newUrl}
        addBlog={addBlog}
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleUrlChange={handleUrlChange}
      />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
