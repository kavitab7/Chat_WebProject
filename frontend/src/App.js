import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Chats from './pages/Chats';
import ChatBox from './components/ChatBox';
import { useState } from 'react';
import './styles/responsive.css'

function App() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true); // State moved to App component

  return (
    <>
      <Navbar isSideMenuOpen={isSideMenuOpen} setIsSideMenuOpen={setIsSideMenuOpen} /> {/* Pass isSideMenuOpen state to Navbar */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        {/* Pass isSideMenuOpen state to ChatBox */}
        <Route path='/chats' element={<ChatBox isSideMenuOpen={isSideMenuOpen} />} />
        {/* <Route path='/message/:chatId' element={<ChatBox />} /> */}
      </Routes>
    </>
  );
}

export default App;
