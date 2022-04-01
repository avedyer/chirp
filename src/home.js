import Feed from "./feed"
import PostForm from "./postForm"

function Home(props) {

  const testUserId = 'avexre'

  return (
    <div className="home">
      <PostForm user={testUserId} />
      <Feed />
    </div>
  )
}

export default Home