import { Button, Card, Form, Input, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

interface QuizResult {
    id: number;
    title: string;
    description: string;
    img_url: string;
}

interface QuizResultsProps {
    results: QuizResult[];
    onUpdate: (results: QuizResult[]) => void;
}

const QuizResults = ({ results, onUpdate }: QuizResultsProps) => {
    const [form] = Form.useForm();

    const handleValuesChange = (_: any, allValues: any) => {
        const updatedResults =
            allValues.results?.map((result: any, index: number) => ({
                ...result,
                id: results[index]?.id || Date.now() + index,
            })) || [];
        onUpdate(updatedResults);
    };

    return (
        <Form
            form={form}
            initialValues={{ results }}
            onValuesChange={handleValuesChange}
            style={{ margin: "20px 0" }}
        >
            <Form.List name="results">
                {(fields, { add, remove }) => (
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <Card
                                key={field.key}
                                title={`Wynik ${index + 1}`}
                                extra={
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => remove(field.name)}
                                    />
                                }
                                style={{ marginBottom: "20px" }}
                            >
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    <Form.Item
                                        {...field}
                                        key={field.key + "title"}
                                        name={[field.name, "title"]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Wprowadź tytuł wyniku!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Tytuł wyniku" />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        key={field.key + "description"}
                                        name={[field.name, "description"]}
                                    >
                                        <Input.TextArea placeholder="Opis wyniku" />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        key={field.key + "img_url"}
                                        name={[field.name, "img_url"]}
                                        rules={[
                                            {
                                                type: "url",
                                                message:
                                                    "Wprowadź poprawny URL obrazka!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Wprowadź URL obrazka wyniku" />
                                    </Form.Item>
                                </Space>
                            </Card>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                        >
                            Dodaj wynik
                        </Button>
                    </div>
                )}
            </Form.List>
        </Form>
    );
};

export default QuizResults;
