import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export default function Mypage({ usernameInMypage }) {
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