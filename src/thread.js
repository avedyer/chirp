import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import db from './db';

import Feed from "./feed"
import Post from "./post"
import ReplyForm from './replyForm';

function Thread() {

  const location = useLocation();
  const login = location.state.login;
  const post = location.state.post;

  const [replies, setReplies] = useState([])
  const [replyThread, setReplyThread] = useState()

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
      <Post post={post} key={post.id} login={login} inThread={true} passReply={setReplyThread}/>
      {
        replies.length > 0 ?
        replies.map((reply) => {
          return reply ? 
            <Post post={reply} key={reply.id} login={login} passReply={setReplyThread}/>
              :
            'loading...'
        })
          :
        'loading...'
      }
      {replyThread ? <ReplyForm login={login} thread={replyThread} closeReply={() => setReplyThread(null)}/> : ''}
    </div>
  )
}

export default Thread