const SearchFilter = ({ searchInput, handleSearchInputChange }) => {
  return <input value={searchInput} onChange={handleSearchInputChange} />;
};

export default SearchFilter;
