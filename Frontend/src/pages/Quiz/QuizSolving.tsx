import PageHeader from "../../components/PageHeader.tsx";
import { Button, Col, Layout, Row } from "antd";
import PageFooter from "../../components/PageFooter.tsx";
import { Content } from "antd/es/layout/layout";
import { useParams } from "react-router-dom";
import { QuizSolve } from "../../types/types.ts";
import { useEffect, useState } from "react";

const QuizSolving = () => {
  const [quiz, setSolveQuizData] = useState<QuizSolve | null>(null);

  let params = useParams();
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        let quizId = params.quizId;
        let apiUrl = `https://quizzler-backend-1.onrender.com/api/quizzes/${quizId}/solve`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}` || "",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setSolveQuizData(data);
      } catch (error) {
        console.error("Error occured while fetching quiz data: ", error);
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

      <Content style={{ padding: "20px", flex: 1 }}>
        {!quiz ? (
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
            <h2>{quiz.name}</h2>
            <img
              src={quiz.img_url || "https://placehold.co/600x400"}
              alt={quiz.name}
              style={{ width: "300px", marginBottom: "20px" }}
            />
            <p>{quiz.description}</p>

            <div
              style={{
                textAlign: "center",
                margin: "20px auto",
                maxWidth: "600px",
              }}
            >
              {quiz.questions.map((question) => (
                <div
                  key={question.quiz_question_id}
                  style={{
                    marginBottom: "30px",
                    padding: "15px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                  }}
                >
                  <h3 style={{ marginBottom: "15px" }}>{question.question}</h3>
                  <Row
                    gutter={[16, 16]}
                    justify="center"
                    style={{ display: "flex" }}
                  >
                    {question.answers.map((answer) => (
                      <Col>
                        <Button type="primary">{answer.answer}</Button>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </div>
          </div>
        )}
      </Content>
      <PageFooter />
    </Layout>
  );
};

export default QuizSolving;
