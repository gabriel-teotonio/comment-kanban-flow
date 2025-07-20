import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, TaskStatus, Comment } from '@/types/kanban';
import { v4 as uuidv4 } from 'uuid';

interface KanbanState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type KanbanAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: TaskStatus } }
  | { type: 'ADD_COMMENT'; payload: { taskId: string; comment: Omit<Comment, 'id' | 'createdAt'> } }
  | { type: 'DELETE_COMMENT'; payload: { taskId: string; commentId: string } };

const initialState: KanbanState = {
  tasks: [
    {
      id: '1',
      title: 'Design do sistema de login',
      description: 'Criar mockups e protótipos para a tela de login',
      status: 'todo',
      priority: 'high',
      assignee: 'João Silva',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [
        {
          id: '1',
          content: 'Vou começar pelos wireframes.',
          createdAt: new Date(),
          author: 'João Silva'
        }
      ],
      tags: ['design', 'ui/ux']
    },
    {
      id: '2',
      title: 'Implementar API de autenticação',
      description: 'Desenvolver endpoints para login, logout e validação de token',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Maria Santos',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      tags: ['backend', 'api']
    },
    {
      id: '3',
      title: 'Configurar CI/CD',
      description: 'Implementar pipeline de deploy automático',
      status: 'review',
      priority: 'medium',
      assignee: 'Pedro Costa',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      tags: ['devops']
    },
    {
      id: '4',
      title: 'Documentação da API',
      description: 'Criar documentação completa usando Swagger',
      status: 'done',
      priority: 'low',
      assignee: 'Ana Oliveira',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      tags: ['documentação']
    }
  ],
  loading: false,
  error: null,
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }
    
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        ),
      };
    }
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'MOVE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.newStatus, updatedAt: new Date() }
            : task
        ),
      };
    }
    
    case 'ADD_COMMENT': {
      const newComment: Comment = {
        ...action.payload.comment,
        id: uuidv4(),
        createdAt: new Date(),
      };
      
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, comments: [...task.comments, newComment], updatedAt: new Date() }
            : task
        ),
      };
    }
    
    case 'DELETE_COMMENT': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { 
                ...task, 
                comments: task.comments.filter(comment => comment.id !== action.payload.commentId),
                updatedAt: new Date()
              }
            : task
        ),
      };
    }
    
    default:
      return state;
  }
}

interface KanbanContextType {
  state: KanbanState;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  addComment: (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  deleteComment: (taskId: string, commentId: string) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    dispatch({ type: 'MOVE_TASK', payload: { taskId, newStatus } });
  };

  const addComment = (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_COMMENT', payload: { taskId, comment } });
  };

  const deleteComment = (taskId: string, commentId: string) => {
    dispatch({ type: 'DELETE_COMMENT', payload: { taskId, commentId } });
  };

  return (
    <KanbanContext.Provider value={{
      state,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addComment,
      deleteComment,
    }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}