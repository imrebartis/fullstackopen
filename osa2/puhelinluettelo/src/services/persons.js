import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const requestWithResponseData = (request) => {
  return request.then((response) => response.data);
};

const getAll = () => {
  return requestWithResponseData(axios.get(baseUrl));
};

const create = (newObject) => {
  return requestWithResponseData(axios.post(baseUrl, newObject));
};

export default {
  getAll,
  create,
};