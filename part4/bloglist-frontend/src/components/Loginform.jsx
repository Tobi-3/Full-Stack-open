const LoginForm = (props) => (<div>
  <h2>log in to application</h2>
  <form onSubmit={props.handleLogin}>
    <div>
      username
      <input
        type="text"
        name="Username"
        value={props.username}
        onChange={({ target }) => props.setUsername(target.value)} />
    </div>
    <div>
      password
      <input
        type="text"
        name="Password"
        value={props.password}
        onChange={({ target }) => props.setPassword(target.value)} />
    </div>
    <button type="submit">login</button>
  </form>
</div>)

export default LoginForm