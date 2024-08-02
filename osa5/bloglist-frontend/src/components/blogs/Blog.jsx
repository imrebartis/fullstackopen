import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { TableRow, TableCell } from '@mui/material'

const Blog = ({ blog }) => {
  return (
    <TableRow key={blog.id}>
      <TableCell>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </TableCell>
    </TableRow>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Blog
