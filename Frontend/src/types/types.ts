export interface Quiz {
  id: number;
  title: string;
  description: string;
  img: string;
  categoryId?: number;
}

export interface Category {
  id: number;
  img: string;
  name: string;
  quizzes: Quiz[];
}
