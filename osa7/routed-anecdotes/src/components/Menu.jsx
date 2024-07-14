import { Link } from "react-router-dom";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <>
      <div>
        <Link to="/" style={padding}>
          anecdotes
        </Link>
        <Link to="/create" style={padding}>
          create new
        </Link>
        <Link to="/about">about</Link>
      </div>
    </>
  );
};

export default Menu;
