import { useEffect, useState } from 'react';

import placeholders from './placeholders';
import Post from './post';

function Feed(props) {

  const [posts, setPosts] = useState(placeholders.posts);

  function fetchUser(id) {
    for (let user of placeholders.users) {
      if (id === user.id) {
        return user
      }
    }
  }

  return (
    <div className='feed'>
      {posts.length > 0 ? 
        posts.map((post) => {
          return <Post post={post} user={fetchUser(post.user)} />
        })
        :
        'loading...'
      }
    </div>
  )
}

export default Feed