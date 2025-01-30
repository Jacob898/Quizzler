import { Button, Card, ConfigProvider, Layout, Steps, theme } from "antd";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import { useState } from "react";
import QuizBasicInfo from "./QuizBasicInfo";
import QuizResults from "./QuizResults";
import QuizQuestions from "./QuizQuestions";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

interface QuizResult {
    id: number;
    title: string;
    description: string;
    img_url: string;
}

interface QuizAnswer {
    id: number;
    text: string;
    resultPoints: { [key: string]: number };
}

interface QuizQuestion {
    id: number;
    title: string;
    img_url: string;
    answers: QuizAnswer[];
}

interface QuizData {
    title: string;
    img_url: string;
    categories: string[];
    results: QuizResult[];
    questions: QuizQuestion[];
}

const { darkAlgorithm } = theme;

const QuizEditor = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [quizData, setQuizData] = useState<QuizData>({
        title: "",
        img_url: "",
        categories: [],
        results: [],
        questions: [],
    });

    const navigate = useNavigate();

    const steps = [
        {
            title: "Podstawowe informacje o quizie",
            content: (
                <QuizBasicInfo
                    title={quizData.title}
                    img_url={quizData.img_url}
                    categories={quizData.categories}
                    onUpdate={(data) => {
                        setQuizData((prev) => ({ ...prev, ...data }));
                    }}
                />
            ),
        },
        {
            title: "Wyniki",
            content: (
                <QuizResults
                    results={quizData.results}
                    onUpdate={(results) => {
                        setQuizData((prev) => ({ ...prev, results }));
                    }}
                />
            ),
        },
        {
            title: "Pytania",
            content: (
                <QuizQuestions
                    questions={quizData.questions}
                    results={quizData.results}
                    onUpdate={(questions) => {
                        setQuizData((prev) => ({ ...prev, questions }));
                    }}
                />
            ),
        },
    ];

    const next = () => {
        setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        try {
            console.log("Creating quiz:", quizData);
            const response = await fetch(
                "https://quizzler-backend-1.onrender.com/api/quizzes/complete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ` + localStorage.getItem("token"),
                        Origin: "*",
                    },
                    body: JSON.stringify(quizData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${
                        errorData.message || "Unknown error"
                    }`
                );
            }

            const data = await response.json();
            console.log("Quiz created successfully:", data);
            navigate("/quiz/" + data.quiz_id);
        } catch (error) {
            console.error("Error creating quiz:", error);
        }
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: darkAlgorithm,
                token: {
                    colorPrimary: "#00FF00", // Neon green for primary elements
                    colorTextBase: "#FFFFFF", // White text
                    colorBgContainer: "#000000", // Black background
                    colorBorder: "#00FF00", // Neon green borders
                },
            }}
        >
            <Layout style={{ minHeight: "100vh", backgroundColor: "#000000" }}>
                <PageHeader />
                <Content style={{ padding: "20px" }}>
                    <div className="max-w-4xl mx-auto p-4">
                        <Card
                            title="Utwórz nowy quiz"
                            headStyle={{
                                color: "#00FF00",
                                borderBottom: "1px solid #00FF00",
                            }}
                            bodyStyle={{
                                backgroundColor: "#000000",
                                color: "#FFFFFF",
                            }}
                        >
                            <Steps
                                current={currentStep}
                                items={steps}
                                style={{ marginBottom: "16px" }}
                            />
                            <div
                                style={{
                                    minHeight: "400px",
                                    padding: "16px",
                                    backgroundColor: "#111111",
                                    borderRadius: "8px",
                                    color: "#FFFFFF",
                                    border: "1px solid #00FF00",
                                }}
                            >
                                {steps[currentStep].content}
                            </div>
                            <div
                                className="mt-8 flex justify-end gap-4"
                                style={{
                                    marginTop: 20,
                                    display: "flex",
                                    gap: 20,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {currentStep > 0 && (
                                    <Button
                                        style={{
                                            color: "#FFFFFF",
                                            borderColor: "#00FF00",
                                        }}
                                        onClick={prev}
                                    >
                                        Cofnij
                                    </Button>
                                )}
                                {currentStep < steps.length - 1 && (
                                    <Button
                                        type="primary"
                                        style={{
                                            backgroundColor: "#00FF00",
                                            borderColor: "#00FF00",
                                            color: "#000000",
                                        }}
                                        onClick={next}
                                    >
                                        Dalej
                                    </Button>
                                )}
                                {currentStep === steps.length - 1 && (
                                    <Button
                                        type="primary"
                                        style={{
                                            backgroundColor: "#00FF00",
                                            borderColor: "#00FF00",
                                            color: "#000000",
                                        }}
                                        onClick={handleSubmit}
                                    >
                                        Utwórz quiz
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                </Content>
                <PageFooter />
            </Layout>
        </ConfigProvider>
    );
};

export default QuizEditor;
