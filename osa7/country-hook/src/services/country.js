import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name/";

const getCountry = async (name) => {
  try {
    const url = `${baseUrl}${name}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
};

export default {
  getCountry,
};
