const Persons = ({ persons, searchString, deletePerson }) => {
    return persons
        .filter(person => person.name.toLowerCase().includes(searchString.toLowerCase()))
        .map(person => <Person key={person.name} person={person}
            deletePerson={deletePerson} />)

}

const Person = ({ person, deletePerson }) => {
    return (
        <>
            <div>{person.name}: {person.number} <button onClick={() => deletePerson(person)}>delete</button></div>
        </>
    )
}

export default Persons