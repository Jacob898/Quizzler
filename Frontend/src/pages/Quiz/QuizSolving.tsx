import type React from "react";
import { useEffect, useState } from "react";
import { Layout, Typography, Radio, Space, Button, message } from "antd";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import type { QuizSolve } from "../../types/types";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface QuizQuestion {
  quiz_question_id: number;
  question: string;
  answers: QuizAnswer[];
}

interface QuizAnswer {
  quiz_answer_id: number;
  answer: string;
}

interface QuizResult {
  quiz_result_id: number;
  title: string;
  description: string;
  img_url: string;
}

interface QuizSelectedAnswers {
  [key: number]: number;
}

const QuizSolving: React.FC = () => {
  const [quiz, setQuizData] = useState<QuizSolve | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizSelectedAnswers>(
    {}
  );
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  const { quizId } = useParams<{ quizId: string }>();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const apiUrl = `https://quizzler-backend-1.onrender.com/api/quizzes/${quizId}/solve`;
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
        setQuizData(data);
      } catch (error) {
        console.error("Error occurred while fetching quiz data: ", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (quiz && Object.keys(selectedAnswers).length === quiz.questions.length) {
      setAllQuestionsAnswered(true);
    } else {
      setAllQuestionsAnswered(false);
    }
  }, [selectedAnswers, quiz]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) {
      message.warning("Please answer all questions before submitting.");
      return;
    }

    try {
      const response = await fetch(
        `https://quizzler-backend-1.onrender.com/api/quizzes/${quizId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}` || "",
          },
          body: JSON.stringify({ answers: selectedAnswers }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const result = await response.json();
      setQuizResult(result);
      message.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      message.error("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "black",
      }}
    >
      <PageHeader />
      <Content
        style={{
          padding: "20px",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            textAlign: "center",
            color: "white",
            backgroundColor: "black",
            padding: "40px",
            borderRadius: "10px",
          }}
        >
          {!quiz ? (
            <Paragraph style={{ fontSize: "18px", color: "#888" }}>
              Quiz not found.
            </Paragraph>
          ) : (
            <>
              <Title level={2} style={{ color: "white" }}>
                {quiz.name}
              </Title>
              {quiz.img_url && (
                <img
                  src={quiz.img_url || "/placeholder.svg"}
                  alt={quiz.name}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginBottom: "20px",
                  }}
                />
              )}
              <Paragraph>{quiz.description}</Paragraph>

              {quiz.questions.map((question) => (
                <div
                  key={question.quiz_question_id}
                  style={{ marginBottom: "30px" }}
                >
                  <Title level={4} style={{ color: "white" }}>
                    {question.question}
                  </Title>
                  <Radio.Group
                    onChange={(e) =>
                      handleAnswerSelect(
                        question.quiz_question_id,
                        e.target.value
                      )
                    }
                    value={selectedAnswers[question.quiz_question_id]}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Space direction="vertical" style={{ color: "white" }}>
                      {question.answers.map((answer) => (
                        <Radio
                          key={answer.quiz_answer_id}
                          value={answer.quiz_answer_id}
                          style={{ color: "white" }}
                        >
                          {answer.answer}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>
              ))}

              {allQuestionsAnswered && !quizResult && (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  style={{ marginTop: "20px" }}
                >
                  Submit Quiz
                </Button>
              )}

              {quizResult && (
                <div style={{ marginTop: "30px" }}>
                  <Title level={3} style={{ color: "white" }}>
                    Your Quiz Result:
                  </Title>
                  <Title level={4} style={{ color: "white" }}>
                    {quizResult.topResult.title}
                  </Title>
                  <Paragraph style={{ color: "white" }}>
                    {quizResult.topResult.description}
                  </Paragraph>
                  {quizResult.topResult.img_url && (
                    <img
                      src={quizResult.topResult.img_url}
                      alt={quizResult.topResult.title}
                      style={{ maxWidth: "300px", marginTop: "20px" }}
                    />
                  )}
                  <Paragraph style={{ color: "white" }}>
                    Total Points: {quizResult.totalPoints}
                  </Paragraph>
                </div>
              )}
            </>
          )}
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};

export default QuizSolving;
