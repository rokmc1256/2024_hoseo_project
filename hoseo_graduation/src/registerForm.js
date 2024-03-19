import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import './RegisterForm.css';
import { useState } from 'react';
import axios from 'axios'
export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('/register', { email, password });
          console.log(response.data); // 서버에서 반환한 데이터 확인
        } catch (error) {
          console.error('회원가입 에러:', error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className='register_page_background'>
                <div className='register_form_screen'>
                    <div className='register_form_screen_inside_top'>
                        <div className='top_logo'>
                            <MyLogo />
                        </div>
                        <div>
                            <span>E A S Y</span>
                        </div>
                    </div>
                    <div className='register_form_input'>
                        <div>
                            <span>아이디</span>
                        </div>
                        <div>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='아이디를 입력해주세요'></input>
                        </div>
                    </div>
                    <div className='register_form_input'>
                        <div>
                            <span>비밀번호</span>
                        </div>
                        <div>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='비밀번호를 입력해주세요' required></input>
                        </div>
                    </div>
                    <div className='register_form_input'>
                        <div>
                            <span>비밀번호 확인</span>
                        </div>
                        <div>
                            <input value={password2} onChange={(e) => setPassword2(e.target.value)} type='password' placeholder='비밀번호를 입력해주세요'></input>
                        </div>
                    </div>
                    <div className='register_form_screen_inside'>
                        <button type='submit' className='register_btn'>가입하기</button>
                    </div>
                </div>
            </div>
        </form> 
    )
}