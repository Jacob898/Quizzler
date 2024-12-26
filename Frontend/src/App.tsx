import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import QuizEditor from "./pages/QuizEditor/QuizEditor";
import NoPage from "./pages/NoPage/NoPage";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<QuizEditor />} />
                    {/* <Route path="/quiz/:id" element={<Quiz />} /> */}
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
