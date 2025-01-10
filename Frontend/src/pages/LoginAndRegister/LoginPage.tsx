import {Button, Form, Input, Layout} from "antd";

import styles from './LoginPage.module.css'

const LoginPage = () => {
    return (
    <Layout>

    <div className={styles.loginPage} >
        <div className={styles.logoSection}>
            <div className={styles.logo}>Logo-placeholder</div>
        </div>

        <div className={styles.loginContainer}>
            <h1 className={styles.loginHeader}>Zaloguj się</h1>
            <Form
                name="login-form"
                layout="vertical"
            >
                <Form.Item label="username"
                           name="username"
                           rules={[{required: true, message:"Nazwa użytkownika jest wymagana"}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="password"
                    name="password"
                    rules={[{required: true, message:"Hasło jest wymagane"}]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="loginButton">
                        Zaloguj się
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
    </Layout>
    )
}

export default LoginPage;