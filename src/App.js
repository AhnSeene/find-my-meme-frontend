import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import FindMeme from './pages/FindMeme';
import UploadMeme from './pages/UploadMeme';
import MemeDetail from './pages/MemeDetail';
import FindMemePost from './pages/FindMemePost';
import FindMemeDetail from './pages/FindMemeDetail';
import FindMemeEdit from './pages/FindMemeEdit';
import TopMeme from './pages/TopMeme';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
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
            <Route path='/meme/:id' element={<MemeDetail/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/findmeme" element={<FindMeme/>}/>
            <Route path="/findmemepost" element={<FindMemePost/>}/>
            <Route path="/users/:username" element={<MyPage/>}/>
            <Route path="/findmeme/:id" element={<FindMemeDetail/>} />
            <Route path="/findmeme/edit/:id" element={<FindMemeEdit/>}/>
            <Route path="/topmeme" element={<TopMeme/>}/>
            <Route path="/admin" element={<Admin/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
