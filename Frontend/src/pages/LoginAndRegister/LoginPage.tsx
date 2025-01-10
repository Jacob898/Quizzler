import {Button, Form, Input} from "antd";

const LoginPage = () => {
    return (
    <div className="login-container">
        <div className="logo-section">
            <div className="logo">Logo-placeholder</div>
        </div>

        <div className="login-container">
            <h2>Zaloguj się</h2>
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
                    <Button type="primary" htmlType="submit" >
                        Zaloguj się
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
    )
}

export default LoginPage;