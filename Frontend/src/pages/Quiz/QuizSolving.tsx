import PageHeader from "../../components/PageHeader.tsx";
import {Button, Col, Layout, Row} from "antd";
import PageFooter from "../../components/PageFooter.tsx";
import {Content} from "antd/es/layout/layout";
import {useParams} from "react-router-dom";
import {Category, Quiz} from "../../types/types.ts";
import {categories} from "../../data/categories.ts";

const QuizSolving = () => {
    const { categoryId, quizId } = useParams<{
        categoryId: string;
        quizId: string;
    }>();

    const category: Category | undefined = categories.find(
        (cat) => cat.id === parseInt(categoryId || "")
    );
    const quiz: Quiz | undefined = category?.quizzes.find(
        (q) => q.id === parseInt(quizId || "")
    );


    return (
        <Layout
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
            <PageHeader />
            <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
                {!quiz ? (
                    <p style={{ textAlign: "center", fontSize: "18px", color: "#888" }}>
                        Nie znaleziono quizu.
                    </p>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <h2>{quiz.title}</h2>
                        <img
                            src={quiz.img}
                            alt={quiz.title}
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
                                    key={question.id}
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
                                        <Col>
                                            <Button type="primary">{question.answer1}</Button>
                                        </Col>
                                        <Col>
                                            <Button type="primary">{question.answer2}</Button>
                                        </Col>
                                        <Col>
                                            <Button type="primary">{question.answer3}</Button>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Content>
            <PageFooter />
        </Layout>
    )
}

export default QuizSolving