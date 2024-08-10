import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import FindMeme from './pages/FindMeme';
import UploadMeme from './pages/UploadMeme';
import FindMemePost from './pages/FindMemePost';
import Header from './components/Header';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header/>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/uploadmeme' element={<UploadMeme/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/findmeme" element={<FindMeme/>}/>
            <Route path="/findmemepost" element={<FindMemePost/>}/>
            <Route path="/mypage" element={<MyPage/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
