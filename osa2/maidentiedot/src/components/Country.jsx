import React, { useEffect, useState } from 'react';
import LoadingIndicator from './LoadingIndicator';
import weatherService from '../services/weather';
import ErrorMessage from './ErrorMessage';

const Country = ({ country }) => {
  const { name, capital, area, languages, flags } = country;
  const [countryWeather, setCountryWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await weatherService.getAll(capital);
        setCountryWeather(response);
      } catch (error) {
        console.log('Failed to fetch weather data')
        console.error(error);
        setErrorMessage('weather');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, [capital]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  const {
    main: { temp },
    weather: [{ description, icon }],
    wind: { speed },
  } = countryWeather;

  const temperatureInCelsius = (temp - 273.15).toFixed(2);

  return (
    <div>
      <h2>{name.common}</h2>
      <p>capital {capital}</p>
      <p>area {area} km²</p>
      <p style={{ fontWeight: 'bold' }}>languages:</p>
      <ul>
        {Object.values(languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={flags.svg}
        alt={`Flag of ${name.common}`}
        style={{ width: '100px' }}
      />
      <h2>Weather in {capital}</h2>
      <p>
        <strong>temperature:</strong> {temperatureInCelsius} Celsius
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
      />
      <p>
        <strong>wind:</strong> {speed} m/s
      </p>
    </div>
  );
};

export default Country;
