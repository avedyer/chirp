import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

import db from './db'

function Signup() {

  let location = useLocation();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [bio ,setBio] = useState('')
  const [validId, setValidId] = useState(false);
  const [validName, setValidName] = useState(false)
  const [privateMode, setPrivateMode] = useState(false);

  async function handleId(e) {

    const input = e.target.value.trim()
    e.target.value = input;

    const isUnique = await isUniqueId(input)

    console.log(isUnique ? 'unique' : 'not unique');

    setValidId(/([a-zA-Z0-9_-]{4,20})/.test(input) && isUnique)
    setId(input)
  }

  async function isUniqueId(input) {
    const userList = await db.getUsers();
    const idList = userList.map(user => user.id);

    console.log(idList, input)

    console.log(idList.includes(input))

    return(!idList.includes(input))
  }

  function handleName(e) {

    const input = e.target.value.trimStart();
    e.target.value = input;

    setName(input);
    setValidName(input.length > 0 && input.length < 64)
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    console.log(file);
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
        pfp: '',  
        banner: '',
        followers: [],
        following: [],
      }
      db.setUser(user);
    }
  }

  return(
    <div className="signup">
      <label htmlFor="id">ID (Must be unique)</label>
      <input type="text" id="id" onChange={(e) => handleId(e)}></input>
      <label htmlFor="name">Username</label>
      <input type="text" id="name" onChange={(e) => handleName(e)}></input>
      <label for="pfp">Profile Photo</label>
      <input id="pfp" type="file" onChange={(e) => handlePhoto(e)}/>
      <label htmlFor="bio">Bio - write a bit about yourself!</label>
      <textarea id="bio" rows="4" cols="50" onKeyUp={(e) => handleBio(e)}></textarea>
      <span>Private Mode (Only you and your followers can see your posts)</span>
      <label className="switch">
        <input type="checkbox" onChange={(e) => setPrivateMode(e.target.value)}/>
        <span className="slider" />
      </label>
      <button onClick={handleSubmit}>Submit</button>
    </div>    
  )
}

export default Signup