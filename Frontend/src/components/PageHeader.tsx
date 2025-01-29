import React, { useState, useEffect } from "react";
import { Layout, Menu, Drawer, Button, Avatar } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo_temp.svg";
import { colors } from "../constants/colors";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const { Header } = Layout;

interface PageHeaderProps {
  isLoggedIn: boolean;
  user: { name: string };
  onLogout: () => void;
}

interface SearchItem {
  id: number;
  title: string;
}

interface MenuItem {
  key: string;
  label: string;
  target?: string;
  onClick?: () => void;
  danger?: boolean;
}

const PageHeader = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const user_id = localStorage.getItem("userID");
  let user_token  = localStorage.getItem("token");
  let refresh_token =localStorage.getItem("refreshToken");

    const refreshAccessToken = async () => {
        try {
            const response = await fetch("https://quizzler-backend-1.onrender.com/api/auth/refresh-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: refresh_token })
            });

            if (!response.ok) throw new Error("Failed to refresh token");
            const data = await response.json();
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("token", data.accessToken);
            user_token = data.accessToken;
            refresh_token = data.refreshToken;
            return user_token;
        } catch (error) {
            console.log("Error refreshing token", error);
            handleLogout();
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch(`https://quizzler-backend-1.onrender.com/api/users/profile/${user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${user_token}`
                }
            });

            if (response.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    return fetchUserData();
                }
            }

            const data = await response.json();
            setImgUrl(data.img_url);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
        if (isLoggedIn) fetchUserData();
    }, [isLoggedIn]);



    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/");
    };

  // Quiz data - temp
  const staticData: SearchItem[] = [];

  // userMenuItems
  const userMenuItems = [
    { key: "1", label: "Konto", target: "/profile" },
    { key: "2", label: "Wyloguj się", onClick: handleLogout, danger: true },
  ];

  // navigation
  const navigation = [
    { key: "1", label: "Kategorie", target: "/categories" },
    { key: "2", label: "Dodaj Quiz", target: "/add-quiz" },
  ];

  const handleNavigationClick = ({ key }: { key: string }) => {
    const { target } = navigation.find((item) => item.key === key) || {};
    if (target) {
      navigate(target);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = userMenuItems.find((menuItem) => menuItem.key === key);
    if (item) {
      if (item.target) {
        navigate(item.target);
      } else if (item.onClick) {
        item.onClick();
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.primary,
        padding: "0 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {viewportWidth >= 768 ? (
          <Menu
            mode="horizontal"
            items={navigation}
            style={{
              backgroundColor: colors.primary,
              color: colors.text,
            }}
            onClick={handleNavigationClick}
          />
        ) : (
          <MenuOutlined
            style={{
              fontSize: 24,
              color: colors.text,
              cursor: "pointer",
            }}
            onClick={() => setIsNavigationVisible(true)}
          />
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <img src={logo} alt="logo" height="50" style={{ margin: "0 auto" }} />
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
        }}
      >
        {viewportWidth >= 950 ? (
          <SearchBar onEnter={() => {}} />
        ) : (
          <SearchOutlined
            style={{
              fontSize: 24,
              color: colors.text,
              cursor: "pointer",
              marginRight: 16,
            }}
            onClick={() => setIsSearchVisible(true)}
          />
        )}

        {isLoggedIn && viewportWidth > 768 ? (
            (imgUrl === null || imgUrl === undefined) ?
                (
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ cursor: "pointer", marginLeft: 16 }}
                        onClick={() => setIsUserMenuVisible(true)}
                    />)
                :
                (<img src={imgUrl} alt={"profilePictureUrl"}
                      style={{cursor: "pointer", marginLeft: 16, borderRadius: "50%", height: "3vw", width: "3vw" }}
                      onClick={() => setIsUserMenuVisible(true)}
                    />
                )
        ) : isLoggedIn ? (
                (imgUrl === null || imgUrl === undefined) ?
                    (
                        <Avatar
                            icon={<UserOutlined />}
                            style={{ cursor: "pointer", marginLeft: 16 }}
                            onClick={() => setIsUserMenuVisible(true)}
                        />)
                    :
                    (<img src={imgUrl} alt={"profilePictureUrl"}
                          style={{cursor: "pointer", marginLeft: 16, borderRadius: "50%", height: "3vw", width: "3vw"  }}
                          onClick={() => setIsUserMenuVisible(true)}
                        />

                    )
        ) : (
          <>
            <Link to="/login">
              <Button type="primary" style={{ marginRight: 8 }} >
                Zaloguj się
              </Button>
            </Link>
            <Link to="/register">
              <Button type="primary">Zarejestruj się </Button>
            </Link>
          </>
        )}
      </div>

      <Drawer
        open={isNavigationVisible}
        onClose={() => setIsNavigationVisible(false)}
        placement="left"
        width={"100vw"}
        height={"100vh"}
        style={{ padding: 0 }}
        bodyStyle={{ padding: 0, backgroundColor: colors.primary }}
        headerStyle={{ display: "none" }}
      >
        <div style={{ backgroundColor: colors.primary }}>
          <CloseOutlined
            style={{
              margin: 16,
              fontSize: 24,
              color: colors.text,
              cursor: "pointer",
            }}
            onClick={() => setIsNavigationVisible(false)}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "90%",
          }}
        >
          <Menu
            mode="vertical"
            items={navigation.map((item) => ({
              ...item,
              style: {
                fontSize: "24px",
                height: "10vh",
                width: "100vw",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              label: (
                <Link
                  style={{
                    fontSize: "24px",
                    margin: "16px",
                  }}
                  to={item.target}
                  onClick={() => setIsNavigationVisible(false)}
                >
                  {item.label}
                </Link>
              ),
            }))}
          />
        </div>
      </Drawer>

      <Drawer
        open={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        placement="top"
        height="100vh"
        bodyStyle={{ backgroundColor: colors.primary, padding: "16px" }}
        headerStyle={{ display: "none" }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#fff", margin: 0 }}>Wyszukaj quiz</h2>
          <CloseOutlined
            style={{
              fontSize: 24,
              color: colors.text,
              cursor: "pointer",
            }}
            onClick={() => setIsSearchVisible(false)}
          />
        </div>
        <SearchBar
          isMobile
          onItemSelect={() => setIsSearchVisible(false)}
          onEnter={() => setIsSearchVisible(false)}
        />
      </Drawer>

      <Drawer
        open={isUserMenuVisible}
        onClose={() => setIsUserMenuVisible(false)}
        placement="right"
        width={"100vw"}
        height={"100vh"}
        style={{ padding: 0 }}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: "none" }}
      >
        <div style={{ backgroundColor: colors.primary }}>
          <CloseOutlined
            style={{
              margin: 16,
              fontSize: 24,
              color: colors.text,
              cursor: "pointer",
            }}
            onClick={() => setIsUserMenuVisible(false)}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "90%",
          }}
        >
          <Menu
            mode="vertical"
            items={userMenuItems.map((item) => ({
              key: item.key,
              style: {
                fontSize: "24px",
                height: "10vh",
                width: "100vw",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              label: item.target ? (
                <Link
                  to={item.target}
                  style={{ color: item.danger ? "red" : "inherit" }}
                  onClick={() => setIsUserMenuVisible(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: item.danger ? "red" : "inherit" }}>
                  {item.label}
                </span>
              ),
              onClick: () => {
                if (item.onClick) {
                  item.onClick();
                }
                setIsUserMenuVisible(false);
              },
              danger: item.danger,
            }))}
          />
        </div>
      </Drawer>
    </Header>
  );
};

export default PageHeader;
