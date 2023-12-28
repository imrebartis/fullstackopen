import { useState, useEffect } from 'react';

import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import SearchFilter from './components/SearchFilter';
import Notification from './components/Notification';

import personsService from './services/persons';

import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const removePersonById = (id) => {
    setPersons(persons.filter((person) => person.id !== id));
  };

  const handlePersonError = (person, removePerson = false) => {
    setErrorMessage(
      `Information of ${person.name} has already been removed from server`
    );
    if (removePerson) {
      removePersonById(person.id);
    }
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const updatePerson = (id, changedPerson) => {
    personsService
      .update(id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id !== id ? person : returnedPerson))
        );
      })
      .catch((error) => {
        console.log(error);
        handlePersonError(changedPerson);
        removePersonById(id);
      });
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (existingPerson.number !== newNumber) {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          updatePerson(existingPerson.id, {
            ...existingPerson,
            number: newNumber,
          });
          return;
        }
      }
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personsService.create(personObject).then((returnedPerson) => {
      setPersons([...persons, returnedPerson]);
      setNewName('');
      setNewNumber('');
      setSuccessMessage(`Added ${returnedPerson.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    });
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          removePersonById(id);
        })
        .catch((error) => {
          console.log(error);
          handlePersonError(person, true);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <SearchFilter
        searchInput={searchInput}
        handleSearchInputChange={handleSearchInputChange}
      />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        searchInput={searchInput}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
