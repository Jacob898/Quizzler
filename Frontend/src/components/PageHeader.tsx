import { Layout, Menu, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const PageHeader = () => {
  const location = useLocation();

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fadb14",
      }}
    >
      <div className="logo">
        <Link
          to="/"
          style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
        >
          Logo
        </Link>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{ flex: 1, backgroundColor: "#fadb14" }}
      >
        <Menu.Item key="/categories">
          <Link to="/categories">Kategorie</Link>
        </Menu.Item>
        <Menu.Item key="/editor">
          <Link to="/editor">Dodaj Quiz</Link>
        </Menu.Item>
      </Menu>
      <Input
        placeholder="Szukaj quizu"
        prefix={<SearchOutlined />}
        style={{ width: 200, marginRight: "10px" }}
      />
      <Button type="text">LOG IN</Button>
      <Button type="primary">SIGN UP</Button>
    </Header>
  );
};

export default PageHeader;
