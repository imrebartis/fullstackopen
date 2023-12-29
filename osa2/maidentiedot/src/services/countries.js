import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';

const requestWithResponseData = (request) => {
  return request.then((response) => response.data);
};

const getAll = () => {
  return requestWithResponseData(axios.get(baseUrl));
};

export default {
  getAll,
};
