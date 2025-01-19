import React, { useState, useEffect } from "react";
import {
    Layout,
    Menu,
    Drawer,
    Button,
    Input,
    Dropdown,
    Avatar,
    List,
} from "antd";
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
const { Search } = Input;

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
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [isNavigationVisible, setIsNavigationVisible] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

    // Mockup logout
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const user = { name: "Jan Kowalski" };

    const onLogout = () => {
        setIsLoggedIn(false);
    };

    // Quiz data
    const staticData: SearchItem[] = [
        { id: 1, title: "New product" },
        { id: 2, title: "Cool new blog" },
        { id: 3, title: "Our people" },
    ];

    const handleDropdownVisibleChange = (visible: boolean) => {
        setDropdownVisible(visible);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const filtered = staticData.filter((item) =>
            item.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    useEffect(() => {
        setFilteredItems(staticData);

        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const userMenuItems = [
        { key: "1", label: "Konto", target: "/profile" },
        { key: "2", label: "Znajomi", target: "/friends" },
        { key: "3", label: "Wyloguj się", onClick: onLogout, danger: true },
    ];

    const navigation = [
        { key: "1", label: "Kategorie", target: "/categories" },
        { key: "2", label: "Dodaj Quiz", target: "/add-quiz" },
        { key: "3", label: "Aktywność", target: "/friends-activity" },
    ];

    const navigate = useNavigate();

    const handleNavigationClick = ({ key }: { key: string }) => {
        const { target } = navigation.find((item) => item.key === key) || {};
        if (target) {
            navigate(target);
        }
    };

    const handleMenuClick = ({ key }: { key: string }) => {
        const item = userMenuItems.find(
            (userMenuItems) => userMenuItems.key === key
        );
        if (item) {
            if (item.target) {
                navigate(item.target); // Przekierowanie na inną stronę
            } else if (item.onClick) {
                item.onClick(); // Wywołanie funkcji onClick
            }
        }
    };

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
            {/* Navigation */}
            <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
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

            {/* Logo */}

            <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
                <Link
                    style={{ display: "flex", alignItems: "center", flex: "1" }}
                    to="/"
                >
                    <img
                        src={logo}
                        alt="logo"
                        height="50"
                        style={{ margin: "0 auto" }}
                    />
                </Link>
            </div>

            {/* Search and User Menu */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "right",
                    flex: "1",
                }}
            >
                {viewportWidth >= 950 ? (
                    <>
                        <Dropdown
                            menu={{
                                items: filteredItems.map((item) => ({
                                    key: item.id,
                                    label: (
                                        <Link
                                            to={`/quiz/${item.id}`}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                            }}
                                        >
                                            {item.title}
                                        </Link>
                                    ),
                                })),
                            }}
                            open={isDropdownVisible}
                            onOpenChange={handleDropdownVisibleChange}
                            trigger={["click"]}
                        >
                            {/* <Input.Search
                                placeholder="Szukaj quizu"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                onSearch={handleSearch}
                                style={{ width: 300, marginRight: 16 }}
                            /> */}
                            <SearchBar />
                        </Dropdown>
                    </>
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
                    <Dropdown
                        menu={{
                            items: userMenuItems.map((item) => ({
                                key: item.key,
                                label: item.label,
                                danger: item.danger,
                            })),
                            onClick: handleMenuClick,
                        }}
                        trigger={["click"]}
                        placement="bottomRight"
                    >
                        <Avatar
                            icon={<UserOutlined />}
                            style={{ cursor: "pointer" }}
                        />
                    </Dropdown>
                ) : isLoggedIn ? (
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsUserMenuVisible(true)}
                    />
                ) : (
                    <>
                        <Link to="/login">
                            <Button type="text">Zaloguj</Button>
                        </Link>
                        <Link to="/register">
                            <Button type="text">Zarejestruj</Button>
                        </Link>
                    </>
                )}
            </div>

            {/* Hamburger Navigation Menu */}
            <Drawer
                open={isNavigationVisible}
                onClose={() => setIsNavigationVisible(false)}
                placement="left"
                width={"100vw"}
                height={"100vh"}
                styles={{ body: { padding: 0 }, header: { display: "none" } }}
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
                                        // height: "100vh",
                                        margin: "16px",
                                    }}
                                    to={item.target}
                                >
                                    {item.label}
                                </Link>
                            ),
                        }))}
                    />
                </div>
            </Drawer>

            {/* Mobile Search */}
            <Drawer
                open={isSearchVisible}
                onClose={() => setIsSearchVisible(false)}
                placement="top"
                height="100vh"
                styles={{
                    body: { padding: 16, backgroundColor: colors.primary },
                    header: { display: "none" },
                }}
            >
                <div style={{ display: "flex", marginBottom: 16 }}>
                    <Search
                        placeholder="Szukaj quizu"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        onSearch={handleSearch}
                        // allowClear
                        style={{ marginRight: 16 }}
                    />
                    <CloseOutlined
                        style={{
                            fontSize: 24,
                            color: colors.text,
                            cursor: "pointer",
                        }}
                        onClick={() => setIsSearchVisible(false)}
                    />
                </div>
                {filteredItems.length > 0 ? (
                    <List
                        itemLayout="vertical"
                        dataSource={filteredItems}
                        renderItem={(item: SearchItem) => (
                            <Link
                                to={`/quiz/${item.id}`}
                                style={{ color: colors.text }}
                            >
                                <List.Item
                                    style={{
                                        backgroundColor: colors.secondary,
                                        padding: 16,
                                        marginBottom: 16,
                                        borderRadius: 8,
                                    }}
                                >
                                    {item.title}
                                </List.Item>
                            </Link>
                        )}
                    />
                ) : (
                    <></>
                )}
            </Drawer>

            {/* Mobile User Menu */}
            <Drawer
                open={isUserMenuVisible}
                onClose={() => setIsUserMenuVisible(false)}
                placement="right"
                width={"100vw"}
                height={"100vh"}
                styles={{ body: { padding: 0 }, header: { display: "none" } }}
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
                                <Link to={item.target}>{item.label}</Link>
                            ) : (
                                <span>{item.label}</span>
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
