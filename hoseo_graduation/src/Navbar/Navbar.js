import { useNavigate } from 'react-router-dom';
import { ReactComponent as MyLogo } from "./../EasyLogo2.svg";
import './Navbar.css';
export default function Navbar({ checkLoggedIn, isLoggedIn, handleLogout }) {
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