import { Button, Card, Form, Input, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import QuizAnswer from "./QuizAnswer";

interface QuizResult {
    id: number;
    title: string;
    description: string;
    img_url: string;
}

interface QuizAnswer {
    id: number;
    text: string;
    resultPoints: { [key: string]: number };
}

interface QuizQuestion {
    id: number;
    title: string;
    img_url: string;
    answers: QuizAnswer[];
}

interface QuizQuestionsProps {
    questions: QuizQuestion[];
    results: QuizResult[];
    onUpdate: (questions: QuizQuestion[]) => void;
}

export default function QuizQuestions({
    questions,
    results,
    onUpdate,
}: QuizQuestionsProps) {
    const [form] = Form.useForm();

    const handleValuesChange = (_: any, allValues: any) => {
        if (!allValues.questions) return;

        const updatedQuestions = allValues.questions.map(
            (question: any, index: number) => ({
                ...question,
                id: questions[index]?.id || Date.now() + index,
                answers: (question.answers || []).map(
                    (answer: any, aIndex: number) => ({
                        ...answer,
                        id:
                            questions[index]?.answers?.[aIndex]?.id ||
                            Date.now() + aIndex,
                        resultPoints: answer.resultPoints || {},
                    })
                ),
            })
        );
        onUpdate(updatedQuestions);
    };

    return (
        <Form
            form={form}
            initialValues={{ questions: questions || [] }}
            onValuesChange={handleValuesChange}
        >
            <Form.List name="questions">
                {(fields, { add, remove }) => (
                    <div className="space-y-4">
                        {fields.map((field, questionIndex) => (
                            <Card
                                key={field.key}
                                title={`Pytanie ${questionIndex + 1}`}
                                extra={
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => remove(field.name)}
                                    />
                                }
                            >
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    <Form.Item
                                        name={[field.name, "title"]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Wprowadź treść pytania!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Treść pytania" />
                                    </Form.Item>

                                    <Form.Item
                                        name={[field.name, "img_url"]}
                                        rules={[
                                            {
                                                type: "url",
                                                message:
                                                    "Wprowdź prawidłowy URL obrazka!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="URL pytania" />
                                    </Form.Item>

                                    <Form.List name={[field.name, "answers"]}>
                                        {(
                                            answerFields,
                                            {
                                                add: addAnswer,
                                                remove: removeAnswer,
                                            }
                                        ) => (
                                            <div className="space-y-4">
                                                {answerFields.map(
                                                    (answerField) => (
                                                        <QuizAnswer
                                                            key={
                                                                answerField.key
                                                            }
                                                            results={results}
                                                            answerField={
                                                                answerField
                                                            }
                                                            onRemove={() =>
                                                                removeAnswer(
                                                                    answerField.name
                                                                )
                                                            }
                                                        />
                                                    )
                                                )}
                                                <Button
                                                    type="dashed"
                                                    onClick={() =>
                                                        addAnswer({
                                                            text: "",
                                                            resultPoints: {},
                                                        })
                                                    }
                                                    block
                                                    icon={<PlusOutlined />}
                                                >
                                                    Dodaj odpowiedź
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>
                                </Space>
                            </Card>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() =>
                                add({ title: "", img_url: "", answers: [] })
                            }
                            block
                            icon={<PlusOutlined />}
                        >
                            Dodaj pytanie
                        </Button>
                    </div>
                )}
            </Form.List>
        </Form>
    );
}
