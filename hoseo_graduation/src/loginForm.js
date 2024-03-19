import { ReactComponent as MyLogo } from "./EasyLogo2.svg";
import './LoginForm.css';

export default function LoginForm() {
    return (
        <div className='login_page_background'>
            <form action="/login" method="POST" className='login_form_screen'>
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
                          placeholder='아이디를 입력해주세요' 
                          name="username">
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
                          name="password">    
                        </input>
                    </div>
                </div>
                <div className='login_form_screen_inside'>
                    <button type='submit' className='login_btn'>로그인</button>
                </div>
            </form>
        </div>
    )
}