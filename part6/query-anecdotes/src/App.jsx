import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes,  updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './AnecdoteContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()
 
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const handleVote = (anecdote) => {
    const votes = anecdote.votes + 1 
    updateAnecdoteMutation.mutate({ ...anecdote, votes})
    dispatch({ payload: `voted anecdoted: ${anecdote.content}` })
    setTimeout(() => {
      dispatch('')
    }, 5000);
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 0
  })

  if (result.isPending) {
    return <div>loading anecdotes...</div>
    
  }
  if(result.isError){
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
