import { useEffect, useState } from 'react';
import { writePost } from './helpers';

function PostForm(props) {

  const [text, setText] = useState()
  const [overflow, setOverflow] = useState(false)

  function handleInput(input) {
    if (input.length < 280) {
      setText(input);
    }
    else {
      setOverflow(true)
    }
  }

  function handleSubmit() {
    if(text) {
      let post = buildPost()
      console.log(post);
      writePost(post)
    }
  }

  function buildPost() {
    const post =  {
      id: Math.random(12) * 12,
      time: new Date(),
      user: props.user,
      text: text,
      likes: 0,
      reposts: 0,
      replies: [],
      isReply: false,
      ReplyTo: null
    }
    console.log(post)
    return post
  }
  

  return(
    <div className="post-form">
      <textarea rows="4" cols="50" onChange={(e) => handleInput(e.target.value)}></textarea>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default PostForm