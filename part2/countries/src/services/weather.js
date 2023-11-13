import axios from 'axios'

const api_key = import.meta.env.VITE_WEATHER_KEY
const baseUrl = `https://api.weatherbit.io/v2.0/current?key=${api_key}`


const getWeatherInCity = (city, country = '') => {
    const countryParam = country ? `&country${country}` : ''
    const request = axios.get(`${baseUrl}&city=${city}${countryParam}`)

    return request
        .then(res => {
            const [weatherData] = res.data.data.map(wdata => {
                return {
                    weather: wdata.weather,
                    temp: wdata.temp,
                    wind_spd: wdata.wind_spd
                }
            })
            return weatherData
        })
        .catch(err => console.log(err))
}



export default { getWeatherInCity }

