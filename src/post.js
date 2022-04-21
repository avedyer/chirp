import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as ReplyIcon } from './imgs/reply.svg'
import { ReactComponent as LikeIcon } from './imgs/like.svg'
import { ReactComponent as OptionsIcon } from './imgs/options.svg'

import db from './db'

function Post(props) {

  const navigate = useNavigate()  

  const [author, setAuthor] = useState();
  const [pfp, setPfp] = useState();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.post.likes)

  useEffect(() => {
    if (props.user) {
      setLiked(props.user.likes.includes(props.post.id))
    }
    else {
      setLiked(false)
    }
  })

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
    navigate(`/user/${props.post.user}`, {
      state: {
        user: author
      }
    })
  }

  async function handleLike() {
    if (props.user) {
      db.setLike(props.user, props.post)
      setLiked(!liked)
      setLikes(liked ? likes - 1 : likes + 1)
    }
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
          <p>{props.post.id}</p>
          <p>{props.post.text}</p>
        </div>
        { props.replying ? 

          ''
        :

          <div className="metrics">
            <div className="like">
              <LikeIcon 
                className={liked ? 'liked' : ''}
                onClick={() => handleLike}
              />
              <span>{likes}</span>
            </div>
            <div className="reply">
              <ReplyIcon onClick={() => props.passReply(props.post)}/>
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
        }
      </div>
    </div>

    :

    'loading...'
  )
}

export default Post