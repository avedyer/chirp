import Post from "./post"
import PostForm from "./postForm"

function ReplyForm(props) {

  return(
    <div className="popup">
      <div className="reply-form">
        <Post post={props.thread} replying={true}/>
        <PostForm user={props.user} replyTo={props.thread}/>
      </div>
    </div>
  )
}

export default ReplyForm