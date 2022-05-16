import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import db from './db'

function PostForm(props) {

  const [text, setText] = useState('')
  const [overflow, setOverflow] = useState(false)
  const [sent, setSent] = useState(false)
  const [counter, setCounter] = useState('')

  function handleInput(e) {

    const element = e.target;

    element.style.height = "auto";
    element.style.height = (element.scrollHeight) + "px";

    const input = e.target.value;

    setText(input)
    setOverflow(input.length > 280)
  }

  function handleSubmit() {
    if(!overflow && text.length > 0 && !sent) {
      db.setPost(buildPost())
      setSent(true)
    }
  }

  function buildPost() {
    const post =  {
      time: new Date(),
      user: props.login.id,
      text: text,
      likes: 0,
      reposts: 0,
      replies: [],
      replyTo: props.replyTo ? props.replyTo.id : null,
      deleted: false
    }
    return post
  }

  useEffect(() => {
    if (text.length > 0) {
      setCounter(`${text.length}/280`)
    }
    else {
      setCounter('')
    }
  }, [text])
  

  return(
    <div className="post-form">
      <div className='form-container'>
        <div className='input-container'>
          <textarea rows="4" cols="50" placeholder={`What's on your mind?`} onChange={(e) => handleInput(e)} />
        </div>
        
        <div className="info">
          <span className={overflow ? 'overflow' : ''}>{counter}</span>
          <button className={text && !overflow ? '' : 'disabled'}onClick={handleSubmit}>Post</button>
        </div>
      </div>
    </div>
  )
}

export default PostForm