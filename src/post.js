function Post(props) {
  return(
    <div className="post">
      <div className="sidebar">
        <img className="pfp" src=''></img>
      </div>
      <div className="content">
        <div className="topline">
          <div className="info">
            <span className="name"></span>
            <span className="handle">{props.post.user}</span>
            <span className="time"></span>
          </div>
          <div className="options"></div>
        </div>
        <div className="text">
          <p>{props.post.text}</p>
        </div>
        <div className="metrics">
          <div className="reply"></div>
          <div className="repost"></div>
          <div className="like"></div>
        </div>
      </div>
    </div>
  )
}

export default Post