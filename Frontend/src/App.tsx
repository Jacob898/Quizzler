import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import QuizEditor from "./pages/QuizEditor/QuizEditor";
import Categories from "./pages/Categories/Categories";
import CategoryDetails from "./pages/Categories/CategoryDetails";
import QuizPage from "./pages/Quiz/QuizPage.tsx";
import QuizSolving from "./pages/Quiz/QuizSolving.tsx";
import NoPage from "./pages/404/404.tsx";
import LoginPage from "./pages/LoginAndRegister/LoginPage.tsx";
import RegisterPage from "./pages/LoginAndRegister/RegisterPage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import SearchResults from "./pages/SearchResults/SearchResults.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<QuizEditor />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/add-quiz" element={<QuizEditor />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route
                        path="/categories/:categoryId"
                        element={<CategoryDetails />}
                    />
                    <Route
                        path="/categories/:categoryId/quiz/:quizId"
                        element={<QuizPage />}
                    />

                    <Route path="/quiz/:quizId" element={<QuizPage />} />

                    <Route
                        path="/categories/:categoryId/quiz/:quizId/solve"
                        element={<QuizSolving />}
                    />

                    <Route
                        path="/quiz/:quizId/solve"
                        element={<QuizSolving />}
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
