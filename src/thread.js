import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import db from './db';

import Feed from "./feed"
import Post from "./post"

function Thread() {

  const location = useLocation();
  const user = location.state.user;
  const post = location.state.post;

  const [replies, setReplies] = useState([])

  useEffect(() => {
    async function fetchReplies() {
      Promise.all(post.replies.map((reply) => {
        return db.getPosts({id: reply})
      })).then(replyList => {
        setReplies(...replyList)
      })
    }
    if (replies.length === 0 && post.replies.length > 0) {
      fetchReplies()
    }
  }, [])


  return (
    <div className="thread">
      <Post post={post} key={post.id} user={user} />
      {
        replies.length > 0 ?
        replies.map((reply) => {
          return reply ? 
            <Post post={reply} key={reply.id} user={user}/>
              :
            'loading...'
        })
          :
        'loading...'
      }
    </div>
  )
}

export default Thread