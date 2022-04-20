import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as ReplyIcon } from './imgs/reply.svg'
import { ReactComponent as LikeIcon } from './imgs/like.svg'
import { ReactComponent as OptionsIcon } from './imgs/options.svg'

import db from './db'

function Post(props) {

  const navigate = useNavigate()

  console.log(props.user.likes)

  const [author, setAuthor] = useState();
  const [pfp, setPfp] = useState();

  useEffect(() => {
    async function fetchAuthor() {
      const userList = await db.getUsers({id: props.post.user});
      setAuthor(userList[0])
    }
    if (!author) {
      fetchAuthor()
    }
  }, [])

  useEffect(() => {
    async function fetchPfp() {
      try {
        const url = await db.getPfpUrl(author.pfp);
        setPfp(url)
      }
      catch(err) {
        const url = await db.getPfpUrl('default-user', 'png');
        setPfp(url)
      }
    }
    if(author && !pfp) {
      fetchPfp()
    }
  }, [author])

  function navigateToUser() {
    console.log('navigating')
    navigate(`/user/${props.post.user}`, {
      state: {
        user: author
      }
    })
  }

  function handleLike() {
    db.setLike(props.user, props.post)
  }

  return(
    
    author ?

    <div className="post">
      <div className="sidebar">
        <img className="pfp" src={pfp}></img>
      </div>
      <div className="content">
        <div className="topline">
          <div className="info">
            <span className="name" onClick={() => navigateToUser()}>{author.name}</span>
            <span className="handle" onClick={() => navigateToUser()}>@{props.post.user}</span>
            <span className="time"></span>
          </div>
          <div className="options"></div>
        </div>
        <div className="text">
          <p>{props.post.text}</p>
        </div>
        <div className="metrics">
          <div className="like">
            <LikeIcon 
              className={props.user ? 
                props.user.likes.includes(props.post.id) ? 'liked' : ''
                :
                ''
              }
              onClick={handleLike}
            />
            <span>{props.post.likes}</span>
          </div>
          <div className="reply">
            <ReplyIcon/>
            <span>{props.post.replies.length}</span>
          </div>
          {props.ownUserFeed ? 
          <div className="options">
            <OptionsIcon />
          </div>
          :
          ''
          }
        </div>
      </div>
    </div>

    :

    'loading...'
  )
}

export default Post