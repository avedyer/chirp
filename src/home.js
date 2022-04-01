import { useEffect, useState } from 'react';

import Post from './post'
import { posts, users } from './placeholders'

function Home(props) {

  const [feed, setFeed] = useState(posts);

  return (
    <div className="home">
      <div className="feed">
        {feed.length > 0 ? 
          feed.map((post) => {
            return <Post post={post} />
          })
          :
          'loading...'
        }
      </div>
    </div>
  )
}

export default Home