import { Button, Card, Form, Input, InputNumber, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface QuizResult {
    id: number;
    title: string;
    description: string;
    img_url: string;
}

interface QuizAnswerProps {
    results: QuizResult[];
    answerField: any;
    onRemove: () => void;
}

export default function QuizAnswer({
    results,
    answerField,
    onRemove,
}: QuizAnswerProps) {
    return (
        <Card
            style={{ marginBottom: "20px" }}
            size="small"
            extra={
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onRemove}
                />
            }
        >
            <Form.Item
                name={[answerField.name, "text"]}
                rules={[
                    { required: true, message: "Wprowadź treść odpowiedzi!" },
                ]}
            >
                <Input placeholder="Treść odpowiedzi" />
            </Form.Item>

            <div className="space-y-2">
                {results.map((result) => (
                    <div key={result.id} className="flex items-center gap-2">
                        <Tag color="blue">{result.title}</Tag>
                        <Form.Item
                            name={[
                                answerField.name,
                                "resultPoints",
                                String(result.title),
                            ]}
                            initialValue={0}
                            noStyle
                        >
                            <InputNumber placeholder="Points" size="small" />
                        </Form.Item>
                    </div>
                ))}
            </div>
        </Card>
    );
}
