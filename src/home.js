import Feed from "./feed"
import PostForm from "./postForm"
import Login from "./login";

import { useEffect, useState } from "react";

function Home(props) {

  const [login, setLogin] = useState(props.login)

  return (
    <div className="home">
      <Login passLogin={props.passLogin}/>
      <PostForm login={props.login} />
      <Feed login={props.login}/>
    </div>
  )
}

export default Home