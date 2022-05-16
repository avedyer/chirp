import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

import { getMetadata } from "firebase/storage";

import { useNavigate } from "react-router-dom";

import db from './db'
import { set } from "firebase/database";

function Signup() {

  const navigate = useNavigate();

  let location = useLocation();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [bio ,setBio] = useState('')
  const [bioOverflow, setBioOverflow] = useState(false)
  const [validId, setValidId] = useState(false);
  const [uniqueId, setUniqueId] = useState(true)
  const [validName, setValidName] = useState(false)
  const [privateMode, setPrivateMode] = useState(false);
  const [pfpId, setPfpId] = useState()
  const [idMessage, setIdMessage] = useState()
  const [filename, setFilename] = useState('No file chosen')
  const [pfp, setPfp] = useState()

  const bioCols = 40;

  useEffect(() => {
    if (id) {
      if (id.length < 4 || id.length > 16) {
        setIdMessage('ID must be between 4 and 16 characters.')
      }
      else if(!(/^[a-zA-Z0-9_-]*$/.test(id))) {
        setIdMessage('ID must only contain letters, numbers, dashes and underscores')
      }
      else if(!uniqueId) {
        setIdMessage('Sorry, this ID is taken.')
      }
      else {
        setIdMessage(null)
      }
    }
    else {
      setIdMessage(null)
    }
  }, [id])


  async function handleId(e) {

    const input = e.target.value.trim()
    e.target.value = input;

    const isUnique = await isUniqueId(input)

    setUniqueId(isUnique)

    setValidId(/^[a-zA-Z0-9_-]*$/.test(input) && isUnique && input.length > 3 && input.length < 17)
    setId(input)
  }

  async function isUniqueId(input) {
    const userList = await db.getUsers();
    const idList = userList.map(user => user.id);

    return(!idList.includes(input))
  }

  function handleName(e) {

    const input = e.target.value.trimStart();
    e.target.value = input;

    setName(input);
    setValidName(input.length > 0 && input.length < 48)
  }

  async function handlePhoto(e) {
    const file = e.target.files[0];

    if(file.type.match('image.*')) {
      setFilename(file.name);
      setPfp(file)
    }
    else {
      setFilename('Invalid filetype')
    }
  }

  function handleBio(e) {
    const input = e.target.value.trimStart().replace(/(\r\n|\n|\r)/gm, "");
    e.target.value = input;

    setBio(input)

    setBioOverflow(input.length > 280)
  }

  async function uploadPfp() {
    const prevIds = await db.getPfpList();

    let id = Math.floor(Math.random() * (10**12)).toString()

    while(prevIds.includes(id)) {
      id = Math.floor(Math.random * (10**12)).toString()
    }

    setPfpId(id)

    db.setPfp(pfp, id)
  }

  async function handleSubmit() {

    console.log(validId, validName, !bioOverflow)

    if (validId && validName && !bioOverflow) {
      console.log('uploading...')
      await uploadPfp();
      const user = {
        email: location.state.email,
        id: id,
        name: name,
        bio: bio,
        private: privateMode,
        pfp: pfpId ? pfpId : null,  
        banner: '',
        followers: [],
        following: [],
        likes: []
      }
      db.setUser(user)
      localStorage.setItem('login', JSON.stringify(user));
      navigate('/', {
        state: {
          login: user
        }
      })
    }
  }

  

  return(
    <div className="signup">
      <div className="section">
        <label htmlFor="id">ID (Must be unique):</label>
        <div className="feedback">
          <input id="id" type="text" className={idMessage ? 'invalid': ''} onChange={(e) => handleId(e)} />
          <span className="warning">{idMessage}</span>
        </div>
      </div>
      <div className="section">
        <label htmlFor="name">Username:</label>
        <div className="feedback">
          <input id="name" type="text" className={name.length < 48 ? '' : 'invalid'} onChange={(e) => handleName(e)}/>
          <span className="warning">{name.length < 48 ? '' : 'Username must be less than 48 characters.'}</span>
        </div>
      </div>
      <div className="section">
        <span>Profile Photo:</span>
        <div id="pfp-upload">
          <button className="file-input">
            <label className="file-label" htmlFor="pfp">Upload</label>
          </button>
          <span id="filename">{filename}</span>
        </div>
        <input id="pfp" type="file" accept=".jpg,.jpeg,.png,.webp," onChange={(e) => handlePhoto(e)}/>
      </div>
      <div className="section bio">
        <label htmlFor="bio">Bio:</label>
        <div className="feedback">
          <textarea id='bio' rows={`${Math.min(Math.floor((bio.length/bioCols) + 1), 8)}`} cols={`${bioCols}`} onChange={(e) => handleBio(e)}/>
          <span id="bio-length" className={bioOverflow ? 'overflow' : ''}>{bio.length}/280</span>
        </div>
        
      </div>
      {/*
        <div className="section">
          <span>Private Mode (Only you and your followers can see your posts)</span>
          <label className="switch">
            <input type="checkbox" onChange={(e) => setPrivateMode(e.target.value)}/>
            <span className="slider" />
          </label>
        </div>
      */}
      <button className="submit" onClick={handleSubmit}>Submit</button>
    </div>    
  )
}

export default Signup