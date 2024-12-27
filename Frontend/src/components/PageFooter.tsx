import React from "react";
import { Layout, Row, Col } from "antd";
import { InstagramOutlined, RedditOutlined } from "@ant-design/icons";

const { Footer } = Layout;

const PageFooter = () => {
    return (
        <Footer style={{ textAlign: "center", backgroundColor: "#fadb14" }}>
            <Row justify="space-between" align="middle">
                <Col>Regulamin</Col>
                <Col>&copy; 2024 Quizzler</Col>
                <Col>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <InstagramOutlined />
                    </a>{" "}
                    |
                    <a
                        href="https://4chan.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        4chan
                    </a>{" "}
                    |
                    <a
                        href="https://reddit.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <RedditOutlined />
                    </a>
                </Col>
            </Row>
        </Footer>
    );
};

export default PageFooter;
