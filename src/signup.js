import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

import { getMetadata } from "firebase/storage";

import db from './db'

function Signup() {

  let location = useLocation();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [bio ,setBio] = useState('')
  const [validId, setValidId] = useState(false);
  const [uniqueId, setUniqueId] = useState(true)
  const [validName, setValidName] = useState(false)
  const [privateMode, setPrivateMode] = useState(false);
  const [pfpId, setPfpId] = useState()
  const [idMessage, setIdMessage] = useState()

  useEffect(() => {
    if (id) {
      if (id.length < 4 || id.length > 16) {
        console.log('length fail')
        setIdMessage('ID must be between 4 and 16 characters.')
      }
      else if(!(/^[a-zA-Z0-9_-]*$/.test(id))) {
        setIdMessage('ID must only contain letters, numbers, dashes and underscores')
      }
      else if(!uniqueId) {
        console.log('unique fail')
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

    setUniqueId(await isUniqueId(input))
    setValidId(/([a-zA-Z0-9_-]{4,20})/.test(input) && isUnique && e.target.value > 3 && e.target.value < 17)
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

    const pfpList = await db.getPfpList();
    
    let prevIds = []

    pfpList.items.forEach(async (pfp) => {
      const metadata = await getMetadata(pfp);
      prevIds.push(metadata.name.split('.')[0]);
    })

    let id = Math.floor(Math.random() * (10**12)).toString()

    while(prevIds.includes(id)) {
      id = Math.floor(Math.random * (10**12)).toString()
    }

    setPfpId(id)

    db.setPfp(file, id)
  }

  function handleBio(e) {

    const input = e.target.value.trimStart().replace(/(\r\n|\n|\r)/gm, "");
    e.target.value = input;

    setBio(input)

  }

  function handleSubmit() {
    if (validId && validName) {
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
      db.setUser(user);
    }
  }

  return(
    <div className="signup">
      <div id="id">
        <label htmlFor="id">ID (Must be unique)</label>
        <input type="text" className={idMessage ? 'invalid': ''} onChange={(e) => handleId(e)}></input>
        <span>{idMessage}</span>
      </div>
      <div id="name">
        <label htmlFor="name">Username</label>
        <input type="text" className={name.length < 48 ? '' : 'invalid'} id onChange={(e) => handleName(e)}></input>
        <span>{name.length < 48 ? '' : 'Username must be less than 48 characters.'}</span>
      </div>
      <div id="pfp">
        <label htmlFor="pfp">Profile Photo</label>
        <input type="file" onChange={(e) => handlePhoto(e)}/>
      </div>
      <div id="bio">
        <label htmlFor="bio">Bio - write a bit about yourself!</label>
        <textarea id rows="4" cols="50" onKeyUp={(e) => handleBio(e)}></textarea>
      </div>
      <div id="private">
        <span>Private Mode (Only you and your followers can see your posts)</span>
        <label className="switch">
          <input type="checkbox" onChange={(e) => setPrivateMode(e.target.value)}/>
          <span className="slider" />
        </label>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>    
  )
}

export default Signup