import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const handleTokenExpiration = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  token = null
  setTimeout(() => window.location.reload(), 3000)
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getConfig = () => ({
  headers: { Authorization: token }
})

export const getBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const getBlog = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

export const createBlog = async (newObject) => {
  try {
    const response = await axios.post(baseUrl, newObject, getConfig())
    return response.data
  } catch (error) {
    console.error(error.response.data)
    if (error.response && error.response.status === 401) {
      handleTokenExpiration()
    }
    throw error
  }
}

export const updateBlog = async (newObject) => {
  const id = newObject.id
  try {
    const response = await axios.patch(
      `${baseUrl}/${id}`,
      newObject,
      getConfig()
    )
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleTokenExpiration()
    }
    throw error
  }
}

export const removeBlog = async (id) => {
  try {
    await axios.delete(`${baseUrl}/${id}`, getConfig())
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleTokenExpiration()
    }
    throw error
  }
}

export default {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  removeBlog,
  setToken
}
