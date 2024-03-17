import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import RegisterForm from './registerForm.js';
import LoginForm from './loginForm.js';
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/login' element={<LoginForm />}/>
        <Route path='/register' element={<RegisterForm />}/>
      </Routes>  
    </div>
  );
}

function Navbar() {
  let navigate = useNavigate();
  return (
    <div className='navbar'>
        <div className='navbar_inside navbar_inside1'>
          <div><MyLogo /></div>
          <div className='homepagetitle'>
            <span>E A S Y</span>
          </div>
        </div>
        <div className='navbar_inside navbar_inside2'>
          <div className='mypage'>
            <span>마이페이지</span>
          </div>
          <div onClick={() => {navigate('/login')}} className='login'>
            <span>로그인</span>
          </div>
          <div onClick={() => {navigate('/register')}} className='register'>
            <span>회원가입</span>
          </div>
          <div className='inputspace'>
            <input type ='text' placeholder='검색'></input>
            <span class="material-symbols-outlined">search</span>
          </div>
        </div>
    </div>
  )
}

export default App;
