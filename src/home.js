import Feed from "./feed"
import PostForm from "./postForm"
import Login from "./login";
import About from './about'
import Menu from "./menu";

import { useEffect, useState } from "react";

function Home(props) {

  const [login, setLogin] = useState(props.login)

  return (
    <div className="home">
      <Menu passLogin={props.passLogin}/>
      <PostForm login={props.login} />
      <Feed login={props.login} params={{ReplyTo: null}}/>
      <About />
    </div>
  )
}

export default Home