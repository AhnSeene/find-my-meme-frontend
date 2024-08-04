import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/top" element={<Top/>}/>
          <Route path="/findmeme" element={<FindMeme/>}/>
          <Route path="/mypage/:id" element={<MyPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
