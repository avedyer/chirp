import { Routes, Route, BrowserRouter } from "react-router-dom";

import './App.css';


import Home from "./home";
import User from "./user";
import Signup from "./signup";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route exact path='/user/:id' element={<User />}/>
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
