import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    borderRadius: 7,
    padding: 10,
    marginBottom: 20,
    borderWidth: 3
  }

  return notification
    ? (
      <div style={style}>

        {notification}
      </div>
    )
    : <></>
}

export default Notification