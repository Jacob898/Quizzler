import {Button, Form, Input, Layout} from "antd";

import styles from './LoginPage.module.css'
import {Link, useNavigate} from "react-router-dom";
import {LeftOutlined} from "@ant-design/icons";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleClickToHomePage = () => {
        navigate("/");
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
            >
                <Form.Item label="Nazwa Użytkownika"
                           name="Nazwa Użytkownika"
                           rules={[{required: true, message:"Nazwa użytkownika jest wymagana"}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Hasło"
                    name="Hasło"
                    rules={[{required: true, message:"Hasło jest wymagane"}]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className={styles.loginButton}>
                        Zaloguj się
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className={styles.registerButton}>
                        <Link to="/register">
                            Załóż nowe konto
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
    </Layout>
    )
}

export default LoginPage;