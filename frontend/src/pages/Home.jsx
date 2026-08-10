import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <main className="home-page">
      <h1>Personal Assistant</h1>
      {token ? (
        <>
          <p>로그인되었습니다.</p>
          <p>
            <Link to="/calendar">캘린더로 이동</Link>
          </p>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <p>
          <Link to="/login">로그인</Link> 또는 <Link to="/signup">회원가입</Link>
        </p>
      )}
    </main>
  );
}