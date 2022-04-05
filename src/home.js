import Feed from "./feed"
import PostForm from "./postForm"

import Login from "./login";

function Home(props) {

  const testUserId = 'avexre'

  return (
    <div className="home">
      <Login />
      <PostForm user={testUserId} />
      <Feed />
    </div>
  )
}

export default Home