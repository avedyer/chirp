import Login from "./login"

function Menu(props) {
  return (
    <div className="menu">
      <Login passLogin={props.passLogin}/>
    </div>
  )
}

export default Menu