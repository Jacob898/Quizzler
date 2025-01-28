import { Button, Layout } from "antd";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";
import { useEffect, useState } from "react";

const { Content } = Layout;

type User = {
    user_id: number;
    email: string;
    img_url: string | null;
};

type Review = {
    quiz_review_id: number;
    quiz_id: number;
    user_id: number;
    User: User;
    comment: string;
    stars: number;
    createdAt: string;
    updatedAt: string;
};

type Category = {
    category_id: number;
    category: string;
    img_url: string;
    createdAt: string;
    updatedAt: string;
};

interface Quiz {
    quiz_id: number;
    name: string;
    description: string;
    img_url: string | null;
    user_id: number;
    createdAt: string;
    updatedAt: string;
    Categories: Category[];
    Reviews: Review[];
}

const QuizPage = () => {
    const [quizData, setQuizData] = useState<Quiz | null>(null);

    let params = useParams();
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                let quizId = params.quizId;
                let apiUrl = `https://quizzler-backend-1.onrender.com/api/quizzes/${quizId}/details`;
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log(data);
                setQuizData(data);
            } catch (error) {
                console.error(
                    "Error occured while fetching quiz data: ",
                    error
                );
            }
        };

        fetchQuizData();
    }, []);

    return (
        <Layout
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <PageHeader />
            <Content
                style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}
            >
                {!quizData ? (
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: "18px",
                            color: "#888",
                        }}
                    >
                        Nie znaleziono quizu.
                    </p>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <h1>{quizData.name}</h1>
                        <img
                            src={
                                quizData.img_url ||
                                "https://placehold.co/600x400"
                            }
                            alt={quizData.name}
                            style={{ width: "300px", marginBottom: "20px" }}
                        />
                        <p>{quizData.description}</p>

                        <Button type="primary">
                            <Link to={`/quiz/${quizData.quiz_id}/solve`}>
                                Rozwiąż quiz
                            </Link>
                        </Button>
                    </div>
                )}
            </Content>
            <PageFooter />
        </Layout>
    );
};

export default QuizPage;
