import axios from 'axios'
const baseUrl = '/api/users'

export const getUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const getUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

export default { getUsers, getUser }
