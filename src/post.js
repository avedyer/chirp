import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  function navigateToUser() {
    navigate(`/user/${props.post.user}`, {
      state: {
        user: author,
        login: props.login
      }
    })
  }

  async function handleLike() {
    if (props.login) {
      db.setLike(props.login, props.post)
      setLiked(!liked)
      setLikes(liked ? likes - 1 : likes + 1)
    }
  }

  function handleDelete() {
    db.deletePost(props.post)
    setDeleted(true);
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
                  onClick={() => handleLike()}
                />
                <span>{likes}</span>
              </div>
              <div className="reply">
                <ReplyIcon onClick={() => {
                  if(props.login) {
                    props.passReply(props.post)
                  }
                }}/>
                <span>{props.post.replies.length}</span>
              </div>
              {props.login.id === author.id ? 
              <div className="delete">
                <DeleteIcon onClick={() => handleDelete()}/>
              </div>
  
                :
              ''
              }
          
          </div>
          }
        </div>
        {
          props.post.replies.length > 0 && !props.inThread && !props.replying ?
          <Link 
            className="thread" 
            to={`/thread/${props.post.id}`} 
            state={{ 
              post: props.post,
              login: props.login 
          }}>
            View this thread
          </ Link>
          :
          ''
        }
      </div>
  
      :
  
      'loading...'
    )
  }
}

export default Post