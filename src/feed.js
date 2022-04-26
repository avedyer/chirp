import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Post from './post';
import ReplyForm from './replyForm';

import db from './db'

function Feed(props) {

  const [posts, setPosts] = useState([]);
  const [replyThread, setReplyThread] = useState()

  useEffect(() => {
    async function fetchPosts() {
      const postList = await db.getPosts(props.params);
      setPosts([...postList])
    }
    if (posts.length === 0) {
      fetchPosts()
    }
  }, [])

  return (
    <div className='feed'>
      {posts.length > 0 ? 
        posts.map((post) => {
          return <Post post={post} key={post.id} user={props.login} passReply={setReplyThread}/>
        })
        :
        'loading...'
      }
      {replyThread ? <ReplyForm login={props.login} thread={replyThread} closeReply={() => setReplyThread(null)}/> : ''}
    </div>
  )
}

export default Feed