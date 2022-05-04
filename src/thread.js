import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import db from './db';

import Feed from "./feed"
import Post from "./post"
import ReplyForm from './replyForm';

function Thread() {

  const [replies, setReplies] = useState([])
  const [replyThread, setReplyThread] = useState()
  const [post, setPost] = useState()
  const [login, setLogin] = useState()
  const [loaded, setLoaded] = useState(false)

  const location = useLocation();

  async function getInfoByUrl() {
    const url = window.location.href
    const exts = url.split('/')
    const id = exts[exts.length - 1]

    const postArray = await db.getPosts({id: id});
    setPost(postArray[0])

    const storedLogin = JSON.parse(localStorage.getItem('login'));
    const userList = (await db.getUsers({email: storedLogin.email}));
    setLogin(userList[0])
  }
 
  useEffect(() => {
    async function fetchReplies() {
      Promise.all(post.replies.map((reply) => {
        return db.getPosts({id: reply})
      })).then(replyList => {
        setReplies(...replyList)
        setLoaded(true)
      })
    }
    if (post) {
      if (replies.length === 0 && post.replies.length > 0) {
        fetchReplies()
      }
      else {
        setLoaded(true)
      }
    }
  }, [post])

  useEffect(() => {
    if (!post || !login) {
      if (location.state) {
        setLogin(location.state.login);
        setPost(location.state.post);
      }
      else {
        getInfoByUrl()
      }
    }
  }, [])


  return (
    <div className="thread">
      {
        post ?
        <div>
          <Post post={post} key={post.id} login={login} inThread={true} passReply={setReplyThread}/>
          {
            loaded ?
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
        :
          ''
      }
    </div>
  )
}

export default Thread