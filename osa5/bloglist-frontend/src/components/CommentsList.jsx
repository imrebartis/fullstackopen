const CommentsList = ({ blog }) => {
  if (!blog.comments) {
    return (
      <div>
        <h3>Comments</h3>
        <p>No comments added yet</p>
      </div>
    )
  }

  return (
    <div>
      <h3>Comments</h3>
      {blog.comments.length === 0 ? (
        <p>No comments added yet</p>
      ) : (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment.content}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CommentsList
