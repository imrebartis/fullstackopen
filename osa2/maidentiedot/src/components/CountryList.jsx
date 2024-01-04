const CountryList = ({ countries, handleOnClick }) => (
  <div>
    {countries.map((country) => (
      <p key={country.cca3}>
        <span>{country.name.common}</span>
        <button onClick={() => handleOnClick(country)}>show</button>
      </p>
    ))}
  </div>
);

export default CountryList;
