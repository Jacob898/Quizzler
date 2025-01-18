import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import "./App.css";
import Home from "./pages/Home/Home";
import QuizEditor from "./pages/QuizEditor/QuizEditor";
import NoPage from "./pages/NoPage/NoPage";
import LoginPage from "./pages/LoginAndRegister/LoginPage.tsx";
import RegisterPage from "./pages/LoginAndRegister/RegisterPage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<QuizEditor />} />
                    {/* <Route path="/quiz/:id" element={<Quiz />} /> */}
                    <Route path="/login"  element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<NoPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
