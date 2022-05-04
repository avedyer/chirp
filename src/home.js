import Main from './main';
import About from './about'
import Menu from "./menu";

import { useEffect, useState } from "react";

function Home(props) {

  const [login, setLogin] = useState(props.login)

  return (
    <div className="home">
      <Main login={props.login}/>
    </div>
  )
}

export default Home