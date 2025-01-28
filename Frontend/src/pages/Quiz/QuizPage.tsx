import { Button, Layout } from "antd";
import { Link, useParams } from "react-router-dom";
import { categories } from "../../data/categories.ts";
import { Category, Quiz } from "../../types/types.ts";
import PageHeader from "../../components/PageHeader.tsx";
import PageFooter from "../../components/PageFooter.tsx";
import { useEffect, useState } from "react";

const { Content } = Layout;

const QuizPage = () => {
    const [quizData, setQuizData] = useState(null);

    let params = useParams();
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                let quizId = params.quizId;
                let apiUrl = `https://quizzler-backend-1.onrender.com/api/quizzes/${quizId}/details`;
                const response = await fetch(apiUrl);
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
    });

    return (
        <Layout
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <PageHeader />
            {/* <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
        {!quizData ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
            Nie znaleziono quizu.
          </p>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h1>{quizData.title}</h1>
            <img
              src={quizData.img}
              alt={quizData.title}
              style={{ width: "300px", marginBottom: "20px" }}
            />
            <p>{quizData.description}</p>

            <Button type="primary">
              <Link to={`/categories/${categoryId}/quiz/${quizData.id}/solve`}>
                Rozwiąż quiz
              </Link>
            </Button>
          </div>
        )}
      </Content> */}
            <PageFooter />
        </Layout>
    );
};

export default QuizPage;
