import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import FindMeme from "./pages/FindMeme";
import UploadMeme from "./pages/UploadMeme";
import MemeDetail from "./pages/MemeDetail";
import FindMemePost from "./pages/FindMemePost";
import FindMemeDetail from "./pages/FindMemeDetail";
import FindMemeEdit from "./pages/FindMemeEdit";
import Admin from "./pages/Admin";
import TopMeme from "./pages/TopMeme";
import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";
//import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <ToastContainer autoClose={3000} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/uploadmeme" element={<UploadMeme />} />
            <Route path="/meme/:id" element={<MemeDetail />} />
            <Route path="/findmeme" element={<FindMeme />} />
            <Route path="/findmemepost" element={<FindMemePost />} />
            <Route path="/findmeme/:id" element={<FindMemeDetail />} />
            <Route path="/findmeme/edit/:id" element={<FindMemeEdit />} />
            <Route path="/users/:username" element={<MyPage />} />
            <Route path="/topmeme" element={<TopMeme />} />
            {/* <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
              /> */}
          </Routes>
          <BottomNavbar />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
