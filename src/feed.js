import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Post from './post';

import db from './db'

function Feed(props) {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const postList = await db.getPosts();
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
          return <Post post={post} key={post.id} user={props.user}/>
        })
        :
        'loading...'
      }
    </div>
  )
}

export default Feed