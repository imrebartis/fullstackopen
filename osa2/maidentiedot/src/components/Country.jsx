const Country = ({ country: { name, capital, area, languages, flags } }) => (
  <div>
    <h2>{name.common}</h2>
    <p>capital {capital}</p>
    <p>area {area} km²</p>
    <p style={{ fontWeight: 'bold' }}>languages:</p>
    <ul>
      {Object.values(languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <img
      src={flags.svg}
      alt={`Flag of ${name.common}`}
      style={{ width: '100px' }}
    />
  </div>
);

export default Country;
