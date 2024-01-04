import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

import countriesService from './services/countries';

import SearchLabel from './components/SearchLabel';
import SearchFilter from './components/SearchFilter';
import Countries from './components/Countries';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';

const filterCountries = (countries, searchInput) => {
  return countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchInput.toLowerCase())
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchInputChange = useCallback(
    debounce((value) => setSearchInput(value), 80),
    []
  );

  const handleSearchInputChange = (event) => {
    debouncedSearchInputChange(event.target.value);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const initialCountries = await countriesService.getAll();
        setCountries(initialCountries);
      } catch (error) {
        setErrorMessage('countries');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const filteredCountries = filterCountries(countries, searchInput);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchLabel />
        <SearchFilter
          searchInput={searchInput}
          handleSearchInputChange={handleSearchInputChange}
        />
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {searchInput && <Countries filteredCountries={filteredCountries} />}
    </>
  );
};

export default App;
