import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const requestWithResponseData = (request) => {
  return request.then((response) => response.data);
};

const getAll = () => {
  return requestWithResponseData(axios.get(baseUrl));
};

const create = (newObject) => {
  return requestWithResponseData(axios.post(baseUrl, newObject));
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAll,
  create,
  remove,
};
