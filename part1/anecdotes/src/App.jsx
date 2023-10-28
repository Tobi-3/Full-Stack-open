import { useState } from 'react'


const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Heading = ({text}) => <h1>{text}</h1>

const Anecdote = ({anecdote, votes}) => {    
    return (
        <>
            <p>{anecdote}</p>
            <p>has {votes} votes</p>
        </>
    )

}

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState((new Array(anecdotes.length)).fill(0))

    const nextAnecdote = () => {
        setSelected(Math.floor(Math.random()  * anecdotes.length))
    }

    const vote = () => {
        const copy = [...votes]
        copy[selected] += 1
        setVotes(copy)
    }

    const maxVoteIndex = votes.indexOf(Math.max(...votes))
    const maxVote = votes[maxVoteIndex]
    const currentAnecdote = anecdotes[selected]

    return (
        <div>
            <Heading text="Anecdote of the day"/>
            <Anecdote anecdote={currentAnecdote} votes={votes[selected]}/>
            <Button handleClick={vote} text="vote"/> 
            <Button handleClick={nextAnecdote} text="next anecdote"/> 
            <Heading text="Anecdote with most votes"/>
            <Anecdote anecdote={anecdotes[maxVoteIndex]} votes={maxVote}/>
        </div>
  )
}

export default App