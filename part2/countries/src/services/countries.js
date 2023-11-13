import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAllCountries = () => {
    const request = axios.get(baseUrl)

    return request
        .then(res => {
            return res.data.map(country => {
                return {
                    name: country.name.common,
                    languages: country.languages,
                    flag: country.flags.png,
                    facts: {
                        capital: country.capital,
                        population: country.population,
                        area: country.area
                    }
                }
            })
        })
        .catch(err => console.log(err))
}



export default { getAllCountries }