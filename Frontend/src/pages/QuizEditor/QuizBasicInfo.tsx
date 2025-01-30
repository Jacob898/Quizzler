import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

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
    const [presentCategories, setPresentCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    "https://quizzler-backend-1.onrender.com/api/categories"
                );
                const data = await response.json();
                setPresentCategories(
                    data.map((category: any) => category.category)
                );
                console.log("Categories fetched:", data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

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
                    options={presentCategories.map((category) => ({
                        value: category,
                        label: category,
                    }))}
                />
            </Form.Item>
        </Form>
    );
};

export default QuizBasicInfo;
