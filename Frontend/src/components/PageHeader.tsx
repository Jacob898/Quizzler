import React from "react";
import { Layout, Menu, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {Link} from "react-router-dom";

const { Header } = Layout;

const PageHeader = () => {
    return (
        <>
            <Header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fadb14",
            }}
        >
            <div className="logo">Logo</div>
            <Menu
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{flex: 1, backgroundColor: "#fadb14"}}
            >
                <Menu.Item key="1">Kategorie</Menu.Item>
                <Menu.Item key="2">Dodaj Quiz</Menu.Item>
            </Menu>
            <Input
                placeholder="Szukaj quizu"
                prefix={<SearchOutlined/>}
                style={{width: 200, marginRight: "10px"}}/>
            <Button type="text">
                <Link to ='/login'>
                    LOG IN
                </Link>
            </Button>
            <Button type="primary">
                <Link to ='/register'>
                    SIGN UP
                </Link>

            </Button>
        </Header>
    </>
    );
};

export default PageHeader;
