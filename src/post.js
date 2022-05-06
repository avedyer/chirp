import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ReplyIcon } from './imgs/reply.svg'
import { ReactComponent as LikeIcon } from './imgs/like.svg'
import { ReactComponent as DeleteIcon } from './imgs/delete.svg'

import db from './db'

function Post(props) {

  const navigate = useNavigate()  

  const [author, setAuthor] = useState();
  const [pfp, setPfp] = useState();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.post.likes)
  const [deleted, setDeleted] = useState(props.post.deleted)

  useEffect(() => {
    if (props.login) {
      setLiked(props.login.likes.includes(props.post.id))
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

  function navigateToUser(e) {
    navigate(`/user/${props.post.user}`, {
      state: {
        user: author,
        login: props.login
      }
    })
    e.stopPropagation()
  }

  function navigateToThread(e) {
    navigate(`/thread/${props.post.id}`, {
      state: { 
        post: props.post,
        login: props.login 
      }
    })
    e.stopPropagation()
  }

  async function handleLike(e) {
    if (props.login) {
      db.setLike(props.login, props.post)
      setLiked(!liked)
      setLikes(liked ? likes - 1 : likes + 1)
    }
    e.stopPropagation()
  }

  function handleDelete(e) {
    db.deletePost(props.post)
    setDeleted(true);
    e.stopPropagation()
  }

  if (deleted) {
    return (
      <div className='post deleted'>
        <p>This post has been removed.</p>
      </div>
    )
  }

  else {
    return(
    
      author ?
  
      <div className="post" onClick={(e) => navigateToThread(e)}>
        <div className="sidebar">
          <img className="pfp" src={pfp}></img>
        </div>
        <div className="content">
          <div className="info">
            <span className="name" onClick={(e) => navigateToUser(e)}>{author.name}</span>
            <span className="handle" onClick={(e) => navigateToUser(e)}>@{props.post.user}</span>
            <span className="time"></span>
          </div>
          <div className="text">
            <p>{props.post.text}</p>
          </div>
          { props.replying ? 
  
            ''
          :
  
            <div className="metrics">
              <div className="like">
                <LikeIcon
                  className={liked ? 'liked' : ''}
                  onClick={(e) => handleLike(e)}
                />
                <span>{likes}</span>
              </div>
              <div className="reply">
                <ReplyIcon onClick={(e) => {
                  if(props.login) {
                    props.passReply(props.post)
                  }
                  e.stopPropagation()
                }}/>
                <span>{props.post.replies.length}</span>
              </div>
              <div className="delete">
              {
                props.login.id === author.id ? 
                <DeleteIcon onClick={(e) => handleDelete(e)}/>
                :
                ''
              }
              </div>
          
          </div>
          }
        </div>
      </div>
  
      :
  
      'loading...'
    )
  }
}

export default Post