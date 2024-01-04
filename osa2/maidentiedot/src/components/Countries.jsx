import React, { useState, useEffect, useMemo } from 'react';
import Country from './Country';
import CountryList from './CountryList';

const Countries = ({ filteredCountries }) => {
  const [country, setCountry] = useState(null);

  const handleOnClick = (selectedCountry) => {
    setCountry(selectedCountry);
  };

  const filteredCountriesLength = useMemo(() => filteredCountries.length, [filteredCountries]);

  useEffect(() => {
    if (filteredCountriesLength === 1) {
      setCountry(filteredCountries[0]);
    }
  }, [filteredCountriesLength]);

  if (filteredCountriesLength > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (filteredCountriesLength === 0) {
    return <p>No countries found</p>
  }

  if (country) {
    return <Country country={country} />;
  }

  return <CountryList countries={filteredCountries} handleOnClick={handleOnClick} />;
};

export default Countries;
