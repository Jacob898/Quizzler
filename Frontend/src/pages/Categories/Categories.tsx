import { Layout, Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import { categories } from "../../data/categories";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";

const { Content } = Layout;

const Categories = () => {
    return (
        <Layout>
            <PageHeader />
            <Content
                style={{ padding: "20px", flex: 1, backgroundColor: "#f5f5f5" }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
                    Kategorie
                </h2>
                <Row gutter={[16, 16]} justify="center">
                    {categories.map((category) => (
                        <Col key={category.id} xs={24} sm={12} md={8}>
                            <Link to={`/categories/${category.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={category.name}
                                            src={category.img}
                                        />
                                    }
                                    title={category.name}
                                    bordered={false}
                                />
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
