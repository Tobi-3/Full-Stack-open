import countries from "../services/countries"

const Countries = ({ countries, searchString, handleShow, setCountry }) => {
    const filteredCountries = countries
        .filter(country => country.name
            .toLowerCase()
            .includes(searchString.toLowerCase()))

    const length = filteredCountries.length

    if (length === 0 || searchString === '') {
        return
    } else if (length > 11) {
        return <div>Too many matches, specify another filter</div>
    } else if (length > 1) {
        return filteredCountries
            .map(country =>
                <div key={country.name}>{country.name}
                    <Button handleShow={() => handleShow(country.name)} text={"show"} />
                </div>
            )
    }

    const country = filteredCountries[0]
    setCountry(country)

    return <Country country={country}/>


}

const Button = ({ handleShow, text }) => {
    return <button onClick={handleShow}>{text}</button>
}

const Country = ({ country }) => {

    return (
        <>
            <h1>{country.name}</h1>

            {Object.entries(country.facts).map(([key, val]) => <div key={key}>{key}: {val}</div>)}

            <h2>languages:</h2>
            <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
            </ul>
            <img src={country.flag} />
        </>
    )
}

export default Countries