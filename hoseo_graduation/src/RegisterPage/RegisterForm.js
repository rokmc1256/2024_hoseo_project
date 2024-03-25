import { ReactComponent as MyLogo } from "./../EasyLogo2.svg";
import './RegisterForm.css';
import { useEffect, useRef, useReducer } from 'react';
import axios from 'axios';

const formReducer = (state, action) => {
    switch (action.type) {
      case 'SET_USERNAME':
        return { ...state, username: action.payload };
      case 'SET_PASSWORD':
        return { ...state, password: action.payload };
      case 'SET_CONFIRM_PASSWORD':
        return { ...state, confirmPassword: action.payload };
      case 'SET_ERRORS':
        return { ...state, ...action.payload };
      case 'SET_FORM_VALID':
        return { ...state, formValid: action.payload };
      default:
        return state;
    }
  };  

export default function RegisterForm() {
    const initialState = {
        username: '',
        password: '',
        confirmPassword: '',
        usernameError: '',
        passwordError: '',
        confirmPasswordError: '',
        formValid: false
    }
    const [state, dispatch] = useReducer(formReducer, initialState);

    const usernameInputRef = useRef(null);

    useEffect(() => {
        usernameInputRef.current.focus();
    }, []);

    useEffect(() => {
        const { username, password, confirmPassword, usernameError, passwordError, confirmPasswordError} = state;
        const isFormValid = !(username === '' || password === '' || confirmPassword === '' || usernameError || passwordError || confirmPasswordError);
        dispatch({ type : 'SET_FORM_VALID', payload: isFormValid })
    }, [state]);

/**/useEffect(() => {
        const validateConfirmPassword = () => {
            const { password, confirmPassword } = state
            const errors = {}
            if (password !== confirmPassword) {
                errors.confirmPasswordError = '비밀번호가 일치하지 않습니다.';
            } else {
                errors.confirmPasswordError = '';
            }
            dispatch({type: 'SET_ERRORS' , payload: errors});
        };
        validateConfirmPassword();
    },[state.password, state.confirmPassword, state])
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = state;
        try { 
          await axios.post('/register', { username, password });
          window.location.replace('/');
        } catch (error) {
          alert(error.response.data);
        }
    }

    //------------------------------------------아이디 유효성 검사-------------------------------------------//
    const handleUsernameChange = (event) => {
        const value = event.target.value;
        dispatch({ type: 'SET_USERNAME', payload: value });
        validateUsername(value); 
    };

    const validateUsername = (value) => {
        const errors = {}
        if (value.trim() === '') {
            errors.usernameError = '아이디를 입력해주세요.';
        } else if (!(value.length >= 6 && value.length <= 12)) {
            errors.usernameError = '아이디는 6글자 이상 12글자 이하이어야 합니다.';
        } else if (!/(?=.*[A-Za-z])(?=.*\d)^[A-Za-z\d]{6,12}$/.test(value)) {
            errors.usernameError = '아이디는 영어와 숫자의 조합만 가능합니다';
        } else {
            errors.usernameError = '';
        }
        dispatch({ type: 'SET_ERRORS', payload: errors });
    }
    //---------------------------------------------------------------------------------------------------//


    //------------------------------------비밀번호 유효성 검사-------------------------------------------//
    const handlePasswordChange = (event) => {
        const value = event.target.value;
        dispatch({ type: 'SET_PASSWORD', payload: value });
        validatePassword(value);
    };

    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: value });
    };

    const validatePassword = (value) => {
        const errors = {}
        if (value.trim() === '') {
            errors.passwordError = '비밀번호를 입력해주세요';
        } else if (value.length < 8) {
            errors.passwordError = '비밀번호의 길이는 8자 이상이어야 합니다.';
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}/.test(value)) {
            errors.passwordError = '비밀번호는 알파벳, 숫자 및 특수문자(@$!%*#?&)를 하나 이상 포함해야 합니다.';
        } else {
            errors.passwordError = '';
        }
        dispatch({ type: 'SET_ERRORS', payload: errors });
    }
    //--------------------------------------------------------------------------------------------------//

    

    return (
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
                    <div className={state.usernameError ? 'input-error' : ''}>
                        <input ref={usernameInputRef} 
                               value={state.username} 
                               onChange={handleUsernameChange} 
                               placeholder='아이디를 입력해주세요' 
                        />
                    </div>
                    {state.usernameError && <div className="warn_msg"><span>{state.usernameError}</span></div>}
                </div>
                <div className='register_form_input'>
                    <div>
                        <span>비밀번호</span>
                    </div>
                    <div className={state.passwordError ? 'input-error' : ''}>
                        <input value={state.password} 
                               onChange={handlePasswordChange} 
                               type='password' 
                               placeholder='비밀번호를 입력해주세요' 
                               required 
                        />
                    </div>
                    {state.passwordError && <div className="warn_msg"><span>{state.passwordError}</span></div>}
                </div>
                <div className='register_form_input'>
                    <div>
                        <span>비밀번호 확인</span>
                    </div>
                    <div className={state.confirmPasswordError ? 'input-error' : ''}>
                        <input value={state.confirmPassword} 
                               onChange={handleConfirmPasswordChange} 
                               type='password' 
                               placeholder='비밀번호를 입력해주세요' 
                               required 
                        />
                    </div>
                    {state.confirmPasswordError && <div className="warn_msg"><span>{state.confirmPasswordError}</span></div>}
                </div>
                <div className='register_form_screen_inside'>
                    <button type='submit' 
                            className={state.formValid ? 'register_btn' : 'disabled_btn' } 
                            disabled={!state.formValid}
                            onClick={handleSubmit}>
                            가입하기
                    </button>
                </div>
            </div>
        </div>
    )
}
