import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import Weather from './components/Weather'
import countryService from './services/countries'
import weatherService from './services/weather'
const App = () => {
    const [searchString, setSearchString] = useState('')
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState(null)
    const [weather, setWeather] = useState(null)
    // const [weather, setWeather] = useState({temp: 3, weather: {icon:"a01d", description: "Broken Clouds"}})


    useEffect(() => {
        countryService
            .getAllCountries()
            .then(returnedCountries => {
                setCountries(returnedCountries);
            })
    }, [])

    useEffect(() => {
        if (country) {
            weatherService
                .getWeatherInCity(country.facts.capital[0])
                .then(returnedWeather => {
                    setWeather(returnedWeather);
                })
        }
    }, [country])

    const handleSearchChange = (e) => {
        setSearchString(e.target.value)
        setCountry(null)
    }

    const handleShow = (name) => {
        setSearchString(name);
    }

    return (
        <div>
            <Filter value={searchString} handler={handleSearchChange} />

            <Countries countries={countries}
                searchString={searchString} 
                handleShow={handleShow}
                setCountry={setCountry}/>
            <Weather country={country} weather={weather} />
        </div>
    )
}


export default App