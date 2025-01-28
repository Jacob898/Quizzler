import React, {useEffect, useState} from "react";
import { Layout, Row, Col } from "antd";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import CustomCard from "../../components/CustomCard";

const { Content } = Layout;

const CategoryDetails: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch("https://quizzler-backend-1.onrender.com/api/quizzes");
                const data = await response.json();

                const filteredQuizzes = data.filter((quiz: { Categories: { category_id: number; }[]; }) =>
                    quiz.Categories.some((cat: { category_id: number; }) => cat.category_id === parseInt(categoryId || ""))
                );
                //TODO - some
                setQuizzes(filteredQuizzes);

            } catch (error) {
                console.error("Error occured while fetching quiz data: ", error);
            }
        };

        fetchQuizzes();
    }, [categoryId]);

    return (
        <Layout
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
            <PageHeader />
            <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
                {quizzes.length === 0 ? (
                    <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
                        Nie znaleziono kategorii.
                    </h2>
                ) : (
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
                            Quizy w kategorii {categoryId?.toUpperCase()}
                        </h2>
                        <Row gutter={[16, 16]} justify="center">
                            {quizzes.map((quiz) => (
                                <Col key={quiz.quiz_id} xs={24} sm={12} md={8}>
                                    <Link to={`/categories/${categoryId}/quiz/${quiz.quiz_id}`}>
                                        <CustomCard
                                            title={quiz.name}
                                            description={quiz.description}
                                            image={quiz.img_url || "https://placehold.co/200x150"}
                                        />
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Content>
            <PageFooter />
        </Layout>
    );
};

export default CategoryDetails;
