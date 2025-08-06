import { Routes, Route, BrowserRouter } from "react-router-dom";
//import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Layout from "./layout/Layout";
import Login from "./pages/Auth/LoginPage";
import SignUp from "./pages/Auth/SignUpPage";
import Home from "./pages/Home/HomePage";
import FindMeme from "./pages/FindMeme/FindMemePage";
import UploadMeme from "./pages/UploadMeme/UploadMemePage";
import MemeDetail from "./pages/MemeDetail/MemeDetailPage";
import FindMemePost from "./pages/FindMeme/FindMemePostPage";
import FindMemeDetail from "./pages/FindMeme/FindMemeDetailPage";
import FindMemeEdit from "./pages/FindMeme/FindMemeEditPage";
import Admin from "./pages/Admin/AdminPage";
import TopMeme from "./pages/TopMeme/TopMemePage";
import MyPage from "./pages/MyPage/MyPage";
import Navbar from "./components/common/Navbar";
//import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <ToastContainer autoClose={3000} />
        <Routes>
          <Route element={<Layout />}>
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
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
