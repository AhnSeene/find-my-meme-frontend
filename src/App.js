import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
        {/* <Route path="/signup" element={<SignUp/>}/>
        <Route path="/findmeme" element={<FindMeme/>}/>
        <Route path="/mypage/:id" element={<MyPage/>}/> */}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
