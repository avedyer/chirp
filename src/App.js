import { Routes, Route, BrowserRouter } from "react-router-dom";

import './App.css';

import Home from "./home";
import User from "./user";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/user:id' element={<User />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
