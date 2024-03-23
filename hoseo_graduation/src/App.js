import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import RegisterForm from './registerForm.js';
import LoginForm from './loginForm.js';
import axios from 'axios';
import MainPage from './mainPage.js';
import { useState } from 'react';

function App() {
  const [usernameInMypage, setUsernameInMypage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoggedIn = async (navigate) => {
    try {
      const response = await axios.get('/mypage');
      const data = response.data;
      if (!data) {
        navigate('/login');
      } else {
        setUsernameInMypage(data.username);
        navigate('/mypage');
      }
    } catch (error) {
      console.error('오류:', error);
    }
  };

  const handleLogout = async () => {
    try{
      await axios.get('/logout');
      setIsLoggedIn(false);
      window.location.href ='/';
    }catch(err){
      alert('로그아웃 에러: ', err)
    }
  };

  return (
    <div className="App">
      <Navbar checkLoggedIn = {checkLoggedIn} isLoggedIn ={ isLoggedIn } handleLogout= { handleLogout }/>
      <Routes>
        <Route path='/' element={<MainPage />}/>
        <Route path='/login' element={<LoginForm onLogin={(loggedIn) => setIsLoggedIn(loggedIn)}/>}/>
        <Route path='/register' element={<RegisterForm />}/>
        <Route path='/mypage' element={<Mypage usernameInMypage = { usernameInMypage }/>}/>
      </Routes>  
    </div>
  );
}

function Navbar({checkLoggedIn, isLoggedIn, handleLogout}) {
  const navigate = useNavigate();
  return (
    <div className='navbar'>
        <div onClick={() => navigate('/')} className='navbar_inside navbar_inside1'>
          <div><MyLogo /></div>
          <div className='homepagetitle'>
            <span>E A S Y</span>
          </div>
        </div>
        <div className='navbar_inside navbar_inside2'>
          <div onClick={() => checkLoggedIn(navigate)} className='mypage'>
            <span>마이페이지</span>
          </div>
          {isLoggedIn ? (
          <div onClick={handleLogout} className='logout'> 
            <span>로그아웃</span>
          </div>
          ) : (
          <div onClick={() => navigate('/login')} className='login'> 
            <span>로그인</span>
          </div>
          )}
          <div onClick={() => navigate('/register')} className='register'>
            <span>회원가입</span>
          </div>
          <div className='inputspace'>
            <input type ='text' placeholder='검색' />
            <span class="material-symbols-outlined">search</span>
          </div>
        </div>
    </div>
  )
}

function Mypage({usernameInMypage}) {
  return (
    <div>{usernameInMypage} 님 안녕하세요.</div>
  ) 
}

export default App;
