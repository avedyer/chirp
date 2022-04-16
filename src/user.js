import { useLocation } from 'react-router-dom';

function User() {

  const location = useLocation();
  const user = location.state.user;

  return(
    <div className="user">
      <div className="info">
        <h1>{user.name}</h1>
        <h2>{user.id}</h2>
      </div>
    </div>
  )
}

export default User