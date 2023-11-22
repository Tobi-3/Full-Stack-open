import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notifications'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (e) => {
    e.preventDefault()

    if (!(newName && newNumber)) {
      setError("Name or Number missing")
      setTimeout(() => {
        setError(null)
      }, 5000)

      return
    }

    const person = persons.find(person => person.name === newName)

    if (person) {
      if (confirm(`${newName} has already been added. Replace old number with new one?`)) {
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            if (returnedPerson) {

              setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
              setNewName('')
              setNewNumber('')

              setNotification(`Changed the number of ${person.name}`)
              setTimeout(() => {
                setNotification(null)
              }, 5000)
            } else {
              setPersons(persons.filter(p => p.id !== changedPerson.id))
              setError("Couldn't update person, person has already been removed from server")
              setTimeout(() => {
                setError(null)
              }, 5000)
            }
          })
          .catch(error => {
            console.log(error);
            setError(error.response.data.error)
            setTimeout(() => {
              setError(null)
            }, 5000)
          })
      }
    }
    else {
      const personObject = { name: newName, number: newNumber }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      personService
        .del(person.id)
        .then(_res => {
          setPersons(persons.filter(p => p.id !== person.id))
          setNotification(`Deleted ${person.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })

    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }
  const handleSearchChange = (e) => {
    setSearchString(e.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchString} handler={handleSearchChange} />

      <h3>Add a new person</h3>
      <Notification message={notification} />
      <Error message={error} />

      <PersonForm name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} onClick={addPerson} />

      <h3>Numbers</h3>
      <Persons persons={persons} searchString={searchString} deletePerson={deletePerson} />

    </div>
  )
}


export default App