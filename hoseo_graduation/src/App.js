import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import RegisterForm from './registerForm.js';
import LoginForm from './loginForm.js';
import axios from 'axios';
import MainPage from './mainPage.js';
import { useState, useEffect, useLayoutEffect } from 'react';

function App() {
  const navigate = useNavigate();

  // 페이지가 새로고침되어도 상태가 유지되도록 localStorage에서 데이터 가져오기
  const [usernameInMypage, setUsernameInMypage] = useState(localStorage.getItem('usernameInMypage') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const mainCheckLoggedIn = async () => {
      try {
        const response = await axios.get('/checkLoggedIn');
        const { loggedIn, username } = response.data;
        if (loggedIn) {
          setIsLoggedIn(true);
          setUsernameInMypage(username);
          // 로그인 상태와 사용자 이름을 localStorage에 저장
          localStorage.setItem('isLoggedIn', true);
          localStorage.setItem('username', usernameInMypage);
        }
      } catch (error) {
        console.error('오류:', error);
      }
    };

    mainCheckLoggedIn();
  }, []);

  const checkLoggedIn = async (navigate) => {
    try {
      const response = await axios.get('/mypage');
      const { loggedIn, username } = response.data;
      if (!loggedIn) {
        navigate('/login');
      } else {
        setUsernameInMypage(username);
        navigate('/mypage');
        // 로그인 상태와 사용자 이름을 localStorage에 저장
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('usernameInMypage', username);
      }
    } catch (error) {
      console.error('오류:', error);
    }
  };

  const handleLogout = async (navigate) => {
    try {
      await axios.get('/logout');
      setIsLoggedIn(false);
      setUsernameInMypage('');
      navigate('/');
      // 로그아웃 시 localStorage의 데이터 삭제
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('usernameInMypage');
    } catch (err) {
      alert('로그아웃 에러: ', err);
    }
  };

  return (
    <div className="App">
      <Navbar
        checkLoggedIn={checkLoggedIn}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginForm onLogin={(loggedIn) => setIsLoggedIn(loggedIn)} />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='/mypage' element={<Mypage usernameInMypage={usernameInMypage} />} />
      </Routes>
    </div>
  );
}

function Navbar({ checkLoggedIn, isLoggedIn, handleLogout }) {
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
          <div onClick={() => handleLogout(navigate)} className='logout'>
            <span>로그아웃</span>
          </div>
        ) : (
            <div onClick={() => navigate('/login')} className='login'>
              <span>로그인</span>
            </div>
          )}
        <div className='inputspace'>
          <input type='text' placeholder='검색' />
          <span class="material-symbols-outlined">search</span>
        </div>
      </div>
    </div>
  )
}

function Mypage({ usernameInMypage }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('/checkLoggedIn');
        const { loggedIn } = response.data;
        if (!loggedIn) {
          navigate('/login');
        }
      } catch (error) {
        console.error('오류:', error);
      }
    };

    checkLoggedIn();
  }, [navigate]);
  return (
    <div>{usernameInMypage} 님 안녕하세요.</div>
  )
}

export default App;
