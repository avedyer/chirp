import Feed from "./feed"
import PostForm from "./postForm"
import Login from "./login";

import db from "./db";

import { useEffect, useState } from "react";

function Home() {

  const [user, setUser] = useState()

  async function fetchUser(login) {
    const userList = (await db.getUsers({email: login.email}))
    setUser(userList[0]);
  }

  return (
    <div className="home">
      <Login passUser={fetchUser}/>
      <PostForm user={user ? user.id : null} />
      <Feed />
    </div>
  )
}

export default Home