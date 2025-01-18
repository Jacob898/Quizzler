import { Layout, Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

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
      <SearchBar />
      <Button type="text">
        <Link to="/login">LOG IN</Link>
      </Button>
      <Button type="primary">
        <Link to="/register">SIGN UP</Link>
      </Button>
    </Header>
  );
};

export default PageHeader;
