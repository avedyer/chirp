import PostForm from "./postForm"
import Feed from "./feed"

function Main(props) {
  return (
    <div className="main">
      <PostForm login={props.login} />
      <Feed login={props.login} params={{ReplyTo: null}}/>
    </div>
  )
}

export default Main