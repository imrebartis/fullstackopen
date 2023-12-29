import Country from './Country';

const Countries = ({ countries, searchInput }) => {
  const filterCountries = (countries, searchInput) => {
    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const filteredCountries = filterCountries(countries, searchInput);

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return <Country country={country} />;
  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <p key={country.name.common}>
          <span>{country.name.common}</span>
        </p>
      ))}
    </div>
  );
};

export default Countries;
