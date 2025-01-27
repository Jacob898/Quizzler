import React from "react";
import { Layout, Row, Col, Divider } from "antd";
import {
    InstagramFilled,
    RedditCircleFilled,
    FacebookFilled,
} from "@ant-design/icons";

const { Footer } = Layout;

const PageFooter = () => {
    return (
        <Footer style={{ textAlign: "center", backgroundColor: "#fadb14" }}>
            <Row justify="space-between" align="middle">
                <Col>
                    <a href="https://spinning-cat.vercel.app/">Regulamin</a>
                </Col>
                <Col>&copy; 2025 Quizzler</Col>
                <Col style={{ fontSize: 30, padding: 1 }}>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <InstagramFilled />
                    </a>
                    <Divider type="vertical" style={{ height: 30 }} />
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FacebookFilled />
                    </a>
                    <Divider type="vertical" style={{ height: 30 }} />
                    <a
                        href="https://reddit.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <RedditCircleFilled />
                    </a>
                </Col>
            </Row>
        </Footer>
    );
};

export default PageFooter;
