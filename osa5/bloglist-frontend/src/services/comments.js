import axios from 'axios'
const baseUrl = '/api/blogs'

export const createComment = async ({ blog, content }) => {
  const response = await axios.post(`${baseUrl}/${blog}/comments`, {
    content
  })
  return response.data
}

export default { createComment }
