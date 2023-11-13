const Weather = ({country, weather}) => {
    if (!weather || !country){ return }

    const capital = country.facts.capital[0]
    return (
        <>
            <h2>Weather in {capital}</h2>
            <p>temp: {weather.temp} °C</p>
            <img src={`https://cdn.weatherbit.io/static/img/icons/${weather.weather.icon}.png`} alt="weather icon" />
            <div>{weather.weather.description}</div>
            <p>wind speed: {weather.wind_spd} m/s</p>
        </>
    )
}

export default Weather