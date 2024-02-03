import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (!notification) return

  const style = {
    color: notification.err? 'red' : 'green',
    borderStyle: 'solid',
    borderRadius: 7,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 30,
  }

  return (
    <div id="notification" style={style}>
      {notification.message}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired
}

export default Notification