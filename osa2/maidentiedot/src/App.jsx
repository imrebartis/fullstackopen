import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

import countriesService from './services/countries';

import SearchLabel from './components/SearchLabel';
import SearchFilter from './components/SearchFilter';
import Countries from './components/Countries';
import LoadingIndicator from './components/LoadingIndicator';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchInputChange = debounce(setSearchInput, 100);

  const handleSearchInputChange = (event) => {
    debouncedSearchInputChange(event.target.value);
  };

  useEffect(() => {
    countriesService
      .getAll()
      .then((initialCountries) => {
        setCountries(initialCountries);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage('Failed to fetch countries');
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchLabel />
        <SearchFilter
          searchInput={searchInput}
          handleSearchInputChange={handleSearchInputChange}
        />
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      {searchInput && (
        <Countries countries={countries} searchInput={searchInput} />
      )}
    </>
  );
};

export default App;
