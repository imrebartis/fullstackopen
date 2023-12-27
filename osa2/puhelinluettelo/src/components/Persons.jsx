const Persons = ({ persons, searchInput, deletePerson }) => {
  const filterPersons = (persons, searchInput) => {
    return persons.filter((person) =>
      person.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  return (
    <div>
      {filterPersons(persons, searchInput).map((person) => (
        <div key={person.name}>
          <p>
            <span>{person.name}</span>
            <span> </span>
            <span>{person.number}</span>
          </p>
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
