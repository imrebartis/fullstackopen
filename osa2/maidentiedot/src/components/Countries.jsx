import React, { useState, useEffect } from 'react';
import Country from './Country';

const Countries = ({ countries, searchInput }) => {
  const [country, setCountry] = useState(null);

  const filterCountries = (countries, searchInput) => {
    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const filteredCountries = filterCountries(countries, searchInput);

  const handleOnClick = (event) => {
    const countryName = event.target.previousSibling.textContent;
    const selectedCountry = countries.find(
      (c) => c.name.common === countryName
    );
    setCountry(selectedCountry);
  };

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCountry(filteredCountries[0]);
    }
  }, [filteredCountries]);

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (country) {
    return <Country country={country} />;
  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <p key={country.name.common}>
          <span>{country.name.common}</span>
          <button onClick={handleOnClick}>show</button>
        </p>
      ))}
    </div>
  );
};

export default Countries;
