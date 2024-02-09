import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import anecdoteService from "../services/anecdotes"

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  
  const addAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value

    if(anecdote){
      event.target.anecdote.value = ''
      const newAnecdote = await anecdoteService.createNew(anecdote)

      dispatch(createAnecdote(newAnecdote))
      dispatch(setNotification(`you created the anecdote: ${newAnecdote.content}`))
      setTimeout(() => dispatch(removeNotification()), 5000)
    }
  }
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div ><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm