import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import './RegisterForm.css';
import { useState } from 'react';
import axios from 'axios';

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    //------------------------------------------아이디 유효성 검사-------------------------------------------//
    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUsername(value);
        validateUsername(value); 
    };

    const validateUsername = (value) => {
        if (value.trim() === '') {
            setUsernameError('아이디를 입력해주세요.');
        } 
        else if (!(value.length >= 6 && value.length <= 12)) {
            setUsernameError('아이디는 6글자 이상 12글자 이하이어야 합니다.');
        }
        else if (!/^[A-Za-z0-9][A-Za-z0-9]*$/.test(value)) {
            setUsernameError('아이디는 영어와 숫자의 조합만 가능합니다');
        } else {
            setUsernameError('');
        }
    }
    //---------------------------------------------------------------------------------------------------//
    


    //------------------------------------비밀번호 유효성 검사-------------------------------------------//
    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        validatePassword(value); // Call validation function
    };

    const validatePassword = (value) => {
        if (value.trim() === '') {
            setPasswordError('비밀번호를 입력해주세요');
        } else if (value.length < 8) {
            setPasswordError('비밀번호의 길이는 8자 이상이어야 합니다.');
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}/.test(value)) {
            setPasswordError('비밀번호는 알파벳, 숫자 및 특수문자(@$!%*#?&)를 하나 이상 포함해야 합니다.');
        } else {
            setPasswordError('');
        }
    }
    //--------------------------------------------------------------------------------------------------//
    
    //----------------------------------비밀번호 유효성 검사(일치 확인)-----------------------------------//
    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        setConfirmPassword(value);
        validateConfirmPassword(value); // Call validation function
    };
    
    const validateConfirmPassword = (value) => {
        if (value !== password) {
          setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
          setConfirmPasswordError('');
        }
    };
    //------------------------------------------------------------------------------------------------//

    return (
        <form>
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
                        <div className={usernameError ? 'input-error' : ''}>
                            <input value={username} onChange={handleUsernameChange} placeholder='아이디를 입력해주세요'></input>
                        </div>
                        {usernameError && <div className="warn_msg"><span>{usernameError}</span></div>}
                    </div>
                    <div className='register_form_input'>
                        <div>
                            <span>비밀번호</span>
                        </div>
                        <div className={passwordError ? 'input-error' : ''}>
                            <input value={password} onChange={handlePasswordChange} type='password' placeholder='비밀번호를 입력해주세요' required></input>
                        </div>
                        {passwordError && <div className="warn_msg"><span>{passwordError}</span></div>}
                    </div>
                    <div className='register_form_input'>
                        <div>
                            <span>비밀번호 확인</span>
                        </div>
                        <div className={confirmPasswordError ? 'input-error' : ''}>
                            <input value={confirmPassword} onChange={handleConfirmPasswordChange} type='password' placeholder='비밀번호를 입력해주세요'></input>
                        </div>
                        {confirmPasswordError && <div className="warn_msg"><span>{confirmPasswordError}</span></div>}
                    </div>
                    <div className='register_form_screen_inside'>
                        <button type='submit' className='register_btn'>가입하기</button>
                    </div>
                </div>
            </div>
        </form> 
    )
}
