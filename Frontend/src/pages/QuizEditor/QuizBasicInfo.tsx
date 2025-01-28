import React from "react";
import { Form, Input, Select } from "antd";

interface QuizBasicInfoProps {
    title: string;
    img_url: string;
    categories: string[];
    onUpdate: (data: {
        title: string;
        img_url: string;
        categories: string[];
    }) => void;
}

const QuizBasicInfo = ({
    title,
    img_url,
    categories,
    onUpdate,
}: QuizBasicInfoProps) => {
    const [form] = Form.useForm();

    const handleValuesChange = (_: any, allValues: any) => {
        onUpdate(allValues);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{ title, img_url, categories }}
            onValuesChange={handleValuesChange}
        >
            <Form.Item
                label="Tytuł"
                name="title"
                rules={[
                    { required: true, message: "Należy wprowadzić tytuł!" },
                ]}
            >
                <Input placeholder="Wprowadź tytuł quizu" />
            </Form.Item>

            <Form.Item
                label="URL obrazka"
                name="img_url"
                rules={[
                    { type: "url", message: "Wprowadź poprawny URL obrazka!" },
                ]}
            >
                <Input placeholder="Wprowadź URL obrazka" />
            </Form.Item>

            <Form.Item label="Kategorie" name="categories">
                <Select
                    mode="tags"
                    placeholder="Dodaj kategorie"
                    style={{ width: "100%" }}
                />
            </Form.Item>
        </Form>
    );
};

export default QuizBasicInfo;
