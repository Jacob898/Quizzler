import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import QuizEditor from "./pages/QuizEditor/QuizEditor";
import Categories from "./pages/Categories/Categories";
import CategoryDetails from "./pages/Categories/CategoryDetails";
import QuizDetails from "./components/QuizDetails";
import NoPage from "./pages/NoPage/NoPage";
import LoginPage from "./pages/LoginAndRegister/LoginPage.tsx";
import RegisterPage from "./pages/LoginAndRegister/RegisterPage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import SearchResults from "./pages/SearchResults/SearchResults.tsx";
import FriendsActivity from "./pages/FriendsActivity/FriendsActivity";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<QuizEditor />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/add-quiz" element={<QuizEditor />} />
                    <Route
                        path="/friends-activity"
                        element={<FriendsActivity />}
                    />
                    <Route path="/categories" element={<Categories />} />
                    <Route
                        path="/categories/:categoryId"
                        element={<CategoryDetails />}
                    />
                    <Route
                        path="/categories/:categoryId/quiz/:quizId"
                        element={<QuizDetails />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
