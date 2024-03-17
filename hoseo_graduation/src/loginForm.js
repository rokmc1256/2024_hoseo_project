import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import './LoginForm.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export default function LoginForm() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    let navigate = useNavigate();
    const handleLogin = async () => {
        try {
          await axios.post('/login', { id, password });
          // 로그인 성공하면 다른 페이지로 이동가능
          navigate('/');
        } catch (err) {
          setError(err.response.data.message);
        }
    };

    return (
        <div className='login_page_background'>
            <div className='login_form_screen'>
                <div className='login_form_screen_inside_top'>
                    <div className='top_logo'>
                        <MyLogo />
                    </div>
                    <div>
                        <span>E A S Y</span>
                    </div>
                </div>
                <div className='login_form_input'>
                    <div>
                        <span>아이디</span>
                    </div>
                    <div>
                        <input 
                          type='text' 
                          placeholder='아이디를 입력해주세요' 
                          value={id}
                          onChange={(e) => setId(e.target.value)}>
                        </input>
                    </div>
                </div>
                <div className='login_form_input'>
                    <div>
                        <span>비밀번호</span>
                    </div>
                    <div>
                        <input 
                          type='password' 
                          placeholder='비밀번호를 입력해주세요'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}>    
                        </input>
                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>
                // error가 존재하면 에러 메시지를 빨간색으로 화면에 표시하고, 그렇지 않으면 아무것도 렌더링하지 않는다.
                }  
                <div className='login_form_screen_inside'>
                    <button onClick={handleLogin} className='login_btn'>로그인</button>
                </div>
            </div>
        </div>
    )
}