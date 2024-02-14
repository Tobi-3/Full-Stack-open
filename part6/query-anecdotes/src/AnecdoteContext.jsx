import { createContext, useReducer, useContext } from 'react'

const anecdoteReducer = (state, action) => {
  return action.payload
}


const AnecdoteContext = createContext()

export const AnecdoteContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(anecdoteReducer, '')

  return (
    <AnecdoteContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </AnecdoteContext.Provider>
  )
}

export const useNotificationValue = () => {
  const NotificationAndDispatch = useContext(AnecdoteContext)
  return NotificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const NotificationAndDispatch = useContext(AnecdoteContext)
  return NotificationAndDispatch[1]
}

export default AnecdoteContext