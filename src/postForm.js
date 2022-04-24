import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import db from './db'

function PostForm(props) {

  const [text, setText] = useState()
  const [overflow, setOverflow] = useState(false)
  const [sent, setSent] = useState(false)



  function handleInput(input) {
    setSent(false)
    if (input.length < 280) {
      setText(input);
    }
    else {
      setOverflow(true)
    }
  }

  function handleSubmit() {
    if(text && !sent) {
      db.setPost(buildPost())
      setSent(true)
    }
  }

  function buildPost() {
    const post =  {
      time: new Date(),
      user: props.user.id,
      text: text,
      likes: 0,
      reposts: 0,
      replies: [],
      replyTo: props.replyTo ? props.replyTo.id : null
    }
    return post
  }
  

  return(
    <div className="post-form">
      <textarea rows="4" cols="50" onChange={(e) => handleInput(e.target.value)}></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <span>{sent ? 'Posted!' : ''}</span>
    </div>
  )
}

export default PostForm