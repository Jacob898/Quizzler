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
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setQuizData(data);
            } catch (error) {
                console.error(
                    "Error occurred while fetching quiz data: ",
                    error
                );
            }
        };

        fetchQuizData();
    }, [quizId]);

    useEffect(() => {
        if (
            quiz &&
            Object.keys(selectedAnswers).length === quiz.questions.length
        ) {
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
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}` || "",
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

    const renderQuestion = (question: QuizQuestion) => (
        <div key={question.quiz_question_id} style={{ marginBottom: "30px" }}>
            <Title level={4}>{question.question}</Title>
            <Radio.Group
                onChange={(e) =>
                    handleAnswerSelect(
                        question.quiz_question_id,
                        e.target.value
                    )
                }
                value={selectedAnswers[question.quiz_question_id]}
            >
                <Space direction="vertical">
                    {question.answers.map((answer) => (
                        <Radio
                            key={answer.quiz_answer_id}
                            value={answer.quiz_answer_id}
                        >
                            {answer.answer}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
        </div>
    );

    const renderResult = () => {
        if (!quizResult) return null;

        const topResult = quizResult.topResult as QuizResult;
        return (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <Title level={3}>Your Quiz Result</Title>
                <Title level={4}>{topResult.title}</Title>
                <Paragraph>{topResult.description}</Paragraph>
                {topResult.img_url && (
                    <img
                        src={topResult.img_url || "/placeholder.svg"}
                        alt={topResult.title}
                        style={{ maxWidth: "300px", marginTop: "20px" }}
                    />
                )}
                <Paragraph>Total Points: {quizResult.totalPoints}</Paragraph>
            </div>
        );
    };

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
                {!quiz ? (
                    <Paragraph
                        style={{
                            textAlign: "center",
                            fontSize: "18px",
                            color: "#888",
                        }}
                    >
                        Quiz not found.
                    </Paragraph>
                ) : (
                    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <Title level={2}>{quiz.name}</Title>
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

                        {quiz.questions.map(renderQuestion)}

                        {allQuestionsAnswered && !quizResult && (
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                style={{ marginTop: "20px" }}
                            >
                                Submit Quiz
                            </Button>
                        )}

                        {renderResult()}
                    </div>
                )}
            </Content>
            <PageFooter />
        </Layout>
    );
};

export default QuizSolving;
