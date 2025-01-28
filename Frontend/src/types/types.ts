type User = {
    user_id: number;
    email: string;
    img_url: string | null;
};

type Review = {
    quiz_review_id: number;
    quiz_id: number;
    user_id: number;
    User: User;
    comment: string;
    stars: number;
    createdAt: string;
    updatedAt: string;
};

type Category = {
    category_id: number;
    category: string;
    img_url: string;
    createdAt: string;
    updatedAt: string;
};

interface Quiz {
    quiz_id: number;
    name: string;
    description: string;
    img_url: string | null;
    user_id: number;
    createdAt: string;
    updatedAt: string;
    Categories: Category[];
    Reviews: Review[];
}

type Answer = {
    quiz_answer_id: number;
    answer: string;
};

type Question = {
    quiz_question_id: number;
    quiz_id: number;
    question: string;
    answers: Answer[];
    createdAt: string;
    updatedAt: string;
};

type Result = {
    quiz_result_id: number;
    quiz_id: number;
    title: string;
    description: string;
    img_url: string | null;
    createdAt: string;
    updatedAt: string;
};

type QuizSolve = {
    quiz_id: number;
    name: string;
    description: string;
    img_url: string;
    user_id: number;
    createdAt: string;
    updatedAt: string;
    questions: Question[];
    results: Result[];
};

export type {
    User,
    Review,
    Category,
    Quiz,
    Answer,
    Question,
    Result,
    QuizSolve,
};
