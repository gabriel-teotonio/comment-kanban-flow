export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  tags?: string[];
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}