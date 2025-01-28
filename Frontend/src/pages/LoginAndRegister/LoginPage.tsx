import {Button, Form, Input, Layout} from "antd";

import styles from './LoginPage.module.css'
import {Link, useNavigate} from "react-router-dom";
import {LeftOutlined} from "@ant-design/icons";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleClickToHomePage = () => {
        navigate("/");
    }

    const handleLogin = async (values) => {
        try {
            const response = await fetch("https://quizzler-backend-1.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                console.log("User logged in successfully ");
                const siteResponse = await response.json();
                localStorage.setItem("token", siteResponse.accessToken);
                localStorage.setItem("refreshToken", siteResponse.refreshToken);
                localStorage.setItem("userID", siteResponse.user.id);
                localStorage.setItem("isLoggedIn", "true");
                navigate("/");
            } else {
                const error = await response.json();
                console.error("Login failed: ", error );
                alert("Logowanie nie powiodło się");
            }
        } catch (error) {
            console.error("error occured while logging in: ", error);
            alert("Logowanie nie powiodło się");
        }
    }

    return (
    <Layout>
    <div className={styles.loginPage} >
        <div className={styles.logoSection}>
            <LeftOutlined className={styles.routeBackIcon} onClick={handleClickToHomePage} />
            <div className={styles.logo}>Logo-placeholder</div>
        </div>

        <div className={styles.loginContainer}>
            <h1 className={styles.loginHeader}>Zaloguj się</h1>
            <Form
                name="login-form"
                layout="vertical"
                onFinish={handleLogin}
            >
                <Form.Item label="Nazwa Użytkownika"
                           name="email"
                           rules={[{required: true, message:"Nazwa użytkownika jest wymagana"}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Hasło"
                    name="password"
                    rules={[{required: true, message:"Hasło jest wymagane"}]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className={styles.loginButton}>
                        Zaloguj się
                    </Button>
                </Form.Item>

            </Form>

                <Button type="primary"  className={styles.registerButton}>
                    <Link to="/register">
                        Załóż nowe konto
                    </Link>
                </Button>
        </div>
    </div>
    </Layout>
    )
}

export default LoginPage;