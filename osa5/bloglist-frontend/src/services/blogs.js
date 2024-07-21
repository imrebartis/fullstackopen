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

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const create = async (newObject) => {
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

const update = async (id, newObject) => {
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

const remove = async (id) => {
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
  getAll,
  create,
  update,
  remove,
  setToken
}
