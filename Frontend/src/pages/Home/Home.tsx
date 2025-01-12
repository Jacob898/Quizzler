import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import CustomCard from "../../components/CustomCard";
import { Layout, Card, Row, Col, Carousel } from "antd";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

const { Content } = Layout;

const featuredQuizzes = [
    {
        title: "New product",
        description: "Check what's in stock",
        image: "https://placehold.co/500x600",
        id: 1,
    },
    {
        title: "Cool new blog",
        description: "Read news from our company",
        image: "https://placehold.co/500x600",
        id: 2,
    },
    {
        title: "Our people",
        description: "Meet our amazing team",
        image: "https://placehold.co/500x600",
        id: 3,
    },
];

const categories = [
    { title: "D17", name: "d17", image: "https://placehold.co/500x600" },
    { title: "PIWO", name: "piwo", image: "https://placehold.co/500x600" },
    {
        title: "Student",
        name: "student",
        image: "https://placehold.co/500x600",
    },
];

const Home = () => {
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
                            <Link to={`/quiz/${quiz.id}`}>
                                <CustomCard
                                    title={quiz.title}
                                    description={quiz.description}
                                    image={quiz.image}
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
                            <Link to={`/categories/${category.name}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={category.title}
                                            src={category.image}
                                        />
                                    }
                                >
                                    {category.title}
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
