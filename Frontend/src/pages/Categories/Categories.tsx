import { Layout, Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import {useEffect, useState} from "react";

const { Content } = Layout;

const Categories = () => {
    const [categories, setCategories] = useState([])

    useEffect(()=>{
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://quizzler-backend-1.onrender.com/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error occured while fetching category data: " , error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Layout
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
            <PageHeader />
            <Content style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}>
                <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Kategorie</h2>
                <Row gutter={[16, 16]} justify="center">
                    {categories.map((category) => (
                        <Col key={category.category_id} xs={24} sm={12} md={8}>
                            <Link to={`/categories/${category.category_id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={category.category}
                                            src={category.img_url || "https://placehold.co/200x150"}
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

export default Categories;
