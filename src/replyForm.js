import Post from "./post"
import PostForm from "./postForm"

function ReplyForm(props) {

  return(
    <div className="popup">
      <div className="reply-form">
        <div className="top">
          <button onClick={props.closeReply}>X</button>
          <Post post={props.thread} replying={true}/>
        </div>
        <PostForm login={props.login} replyTo={props.thread}/>
      </div>
    </div>
  )
}

export default ReplyForm