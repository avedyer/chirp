import Login from "./login"

function Menu(props) {
  return (
    <Login passLogin={props.passLogin}/>
  )
}

export default Menu