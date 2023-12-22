const SearchFilter = ({ searchInput, handleSearchInputChange }) => (
  <div>
    filter shown with{' '}
    <input value={searchInput} onChange={handleSearchInputChange} />
  </div>
);

export default SearchFilter;
