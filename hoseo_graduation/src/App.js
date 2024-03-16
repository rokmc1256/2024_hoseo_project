import './App.css';
import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import LoginForm from './loginForm.js';
function App() {
  return (
    <div className="App">
      <Navbar />
      <LoginForm>
      <div>리액트로 만든 웹 페이지임</div>
      <div>환영합니다</div>
      <div>리액트 페이지 수정</div>
      <div>윤한</div>
      <div>2번째 페이지 수정</div>
      <div>민석</div>
      <div>명현</div>
      <div>윤한2</div>
      </LoginForm>
      
    </div>
  );
}

function Navbar() {
  return (
    <div className='navbar'>
        <div className='navbar_inside navbar_inside1'>
          <div><MyLogo /></div>
          <div className='homepagetitle'>
            <span>E A S Y</span>
          </div>
        </div>
        <div className='navbar_inside navbar_inside2'>
          <div>
            <span>마이페이지</span>
          </div>
          <div>
            <span>로그인</span>
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
