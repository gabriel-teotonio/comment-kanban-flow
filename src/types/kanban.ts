export type Status = 'PENDING' | 'IN_PROGRESS' | 'TESTING' | 'DONE';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}