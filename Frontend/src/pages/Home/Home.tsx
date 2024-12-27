import React from "react";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import { Layout, Card, Row, Col, Carousel } from "antd";
import styles from "./Home.module.css";

const { Content } = Layout;

const featuredQuizzes = [
    {
        title: "New product",
        description: "Check what's in stock",
        img: "https://via.placeholder.com/150",
    },
    {
        title: "Cool new blog",
        description: "Read news from our company",
        img: "https://via.placeholder.com/150",
    },
    {
        title: "Our people",
        description: "Meet our amazing team",
        img: "https://via.placeholder.com/150",
    },
    {
        title: "New product",
        description: "Check what's in stock",
        img: "https://via.placeholder.com/150",
    },
    {
        title: "Cool new blog",
        description: "Read news from our company",
        img: "https://via.placeholder.com/150",
    },
    {
        title: "Our people",
        description: "Meet our amazing team",
        img: "https://via.placeholder.com/150",
    },
];

const categories = [
    { title: "D17", img: "https://via.placeholder.com/150" },
    { title: "PIWO", img: "https://via.placeholder.com/150" },
    { title: "Student", img: "https://via.placeholder.com/150" },
];

const Home = () => {
    return (
        <Layout>
            <PageHeader />
            <Content
                style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}
            >
                <h2 style={{ textAlign: "center" }}>Featured</h2>
                <div className={styles["desktop-featured"]}>
                    <Row gutter={[16, 16]} justify="center">
                        {featuredQuizzes.map((quiz, index) => (
                            <Col key={index} xs={24} sm={12} md={8}>
                                <Card
                                    cover={
                                        <img alt={quiz.title} src={quiz.img} />
                                    }
                                    title={quiz.title}
                                    bordered={false}
                                >
                                    {quiz.description}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className={styles["mobile-featured"]}>
                    <Carousel>
                        {featuredQuizzes.map((quiz, index) => (
                            <div key={index}>
                                <Card
                                    cover={
                                        <img alt={quiz.title} src={quiz.img} />
                                    }
                                    title={quiz.title}
                                    bordered={false}
                                >
                                    {quiz.description}
                                </Card>
                            </div>
                        ))}
                    </Carousel>
                </div>

                <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                    Kategorie
                </h2>
                <Row gutter={[16, 16]} justify="center">
                    {categories.map((category, index) => (
                        <Col key={index} xs={24} sm={12} md={8}>
                            <Card
                                cover={
                                    <img
                                        alt={category.title}
                                        src={category.img}
                                    />
                                }
                                title={category.title}
                                bordered={false}
                            ></Card>
                        </Col>
                    ))}
                </Row>
            </Content>
            <PageFooter />
        </Layout>
    );
};

export default Home;
