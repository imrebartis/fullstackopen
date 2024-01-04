import axios from 'axios';

const getAll = async (capital) => {
  const baseUrl = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${
    import.meta.env.VITE_WEATHER_API_KEY
  }`;

  const response = await axios.get(baseUrl);
  return response.data;
};

export default {
  getAll,
};
