const Persons = ({ persons, searchInput }) => {
  const filterPersons = (persons, searchInput) => {
    return persons.filter((person) =>
      person.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  return (
    <div>
      {filterPersons(persons, searchInput).map((person) => (
        <p key={person.name}>
          <span>{person.name}</span>
          <span> </span>
          <span>{person.number}</span>
        </p>
      ))}
    </div>
  );
};

export default Persons;
