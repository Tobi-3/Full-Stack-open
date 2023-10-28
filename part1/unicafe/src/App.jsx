import { useState } from 'react'

const Display = ({ display }) => <h1>{display}</h1>

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Statistics = ({feedback}) => {
  console.log(...feedback)
  const [ good, neutral, bad ] = feedback
  console.log(good)
  const total = good + bad + neutral
   
  if (total == 0) return <div>No feedback given</div>

  const average = (good - bad) / total
  const positive = good / total * 100
  return (
    <div>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive + "%"} />
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return <div>{text}: {value}</div>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <Display display="Give Feedback" />
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />
      <Display display="Statistics" />
      <Statistics feedback={[good, neutral, bad]} />
    </div>
  )
}

export default App