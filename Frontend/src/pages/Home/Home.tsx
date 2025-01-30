import { Layout, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import CustomCard from "../../components/CustomCard";
import { useEffect, useState } from "react";

const { Content } = Layout;

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    "https://quizzler-backend-1.onrender.com/api/categories"
                );
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error(
                    "Error occured while fetching category data - temp: ",
                    error
                );
            }
        };

        const fetchQuizzes = async () => {
            try {
                const response = await fetch(
                    "https://quizzler-backend-1.onrender.com/api/quizzes"
                );
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error(
                    "Error occured while fetching quizz data - temp: ",
                    error
                );
            }
        };

        fetchQuizzes();
        fetchCategories();
    }, []);

    const featuredQuizzes = quizzes
        .map((quiz) => ({
            ...quiz,
            category: quiz.Categories[0]?.category || "Nie ma takiej kategorii",
            category_id: quiz.Categories[0]?.category_id || null,
        }))
        .slice(0, 5);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <PageHeader />
            <Content style={{ padding: "20px", flex: 1 }}>
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>
                    Wyróżnione quizy
                </h2>
                <Row gutter={[16, 16]} justify="center">
                    {featuredQuizzes.map((quiz, index) => (
                        <Col key={index} xs={24} sm={12} md={8}>
                            <Link
                                to={`/categories/${quiz.category_id}/quiz/${quiz.quiz_id}`}
                            >
                                <CustomCard
                                    title={quiz.name}
                                    description={quiz.description}
                                    image={
                                        quiz.img_url ||
                                        "https://placehold.co/200x150"
                                    }
                                />
                            </Link>
                        </Col>
                    ))}
                </Row>

                <h2
                    style={{
                        textAlign: "center",
                        marginTop: "40px",
                        marginBottom: 16,
                    }}
                >
                    Kategorie
                </h2>
                <Row gutter={[16, 16]} justify="center">
                    {categories.map((category) => (
                        <Col key={category.category_id} xs={24} sm={12} md={8}>
                            <Link to={`/categories/${category.category_id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            style={{ width: 480, height: 250 }}
                                            alt={category.category}
                                            src={
                                                category.img_url ||
                                                "https://placehold.co/200x150"
                                            }
                                        />
                                    }
                                >
                                    {category.category}
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Content>
            <PageFooter />
        </Layout>
    );
};

export default Home;
