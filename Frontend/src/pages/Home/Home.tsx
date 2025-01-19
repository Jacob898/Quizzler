import { Layout, Card, Row, Col, Carousel } from "antd";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import { categories } from "../../data/categories";
import CustomCard from "../../components/CustomCard";

const { Content } = Layout;

const Home = () => {
    const featuredQuizzes = categories
        .flatMap((category) =>
            category.quizzes.map((quiz) => ({
                ...quiz,
                categoryName: category.name,
                categoryId: category.id,
            }))
        )
        .slice(0, 5);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <PageHeader />
            <Content style={{ padding: "20px", flex: 1 }}>
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>
                    Featured
                </h2>
                <Row gutter={[16, 16]} justify="center">
                    {featuredQuizzes.map((quiz, index) => (
                        <Col key={index} xs={24} sm={12} md={8}>
                            <Link
                                to={`/categories/${quiz.categoryId}/quiz/${quiz.id}`}
                            >
                                <CustomCard
                                    title={quiz.title}
                                    description={quiz.description}
                                    image={"https://placehold.co/200x150"}
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
                    {categories.map((category, index) => (
                        <Col key={index} xs={24} sm={12} md={8}>
                            <Link to={`/categories/${category.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={category.name}
                                            src={"https://placehold.co/200x150"}
                                        />
                                    }
                                >
                                    {category.name}
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
