import PropTypes from "prop-types";

const Error = ({ message }) => {
  return (
    <div style={{ color: "red", border: "1px solid red", padding: "10px" }}>
      {message}
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;
