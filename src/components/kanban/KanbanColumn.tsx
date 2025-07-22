import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Status, Task } from '@/types/kanban';

interface KanbanColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  isLoading?: boolean;
  refetchTasks?: () => void;
}

const columnStyles: Record<Status, { bg: string; border: string; text: string }> = {
  PENDING: {
    bg: 'bg-kanban-todo',
    border: 'border-kanban-todo-border',
    text: 'text-kanban-todo-foreground',
  },
  IN_PROGRESS: {
    bg: 'bg-kanban-progress',
    border: 'border-kanban-progress-border',
    text: 'text-kanban-progress-foreground',
  },
  TESTING: {
    bg: 'bg-kanban-review',
    border: 'border-kanban-review-border',
    text: 'text-kanban-review-foreground',
  },
  DONE: {
    bg: 'bg-kanban-done',
    border: 'border-kanban-done-border',
    text: 'text-kanban-done-foreground',
  },
};

export function KanbanColumn({ id, title, tasks, onAddTask, isLoading, refetchTasks }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = columnStyles[id] || { bg: '', border: '', text: '' };

  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[320px]">
      {/* Column Header */}
      <div className={`rounded-t-xl p-4 border-2 ${style.bg} ${style.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${style.text}`}>{title}</h3>
            <span className={`text-sm px-2 py-1 rounded-full bg-white/50 ${style.text} font-medium`}>
              {tasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 hover:bg-white/20 ${style.text}`}
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 space-y-3 bg-muted/30 rounded-b-xl border-2 border-t-0 min-h-[400px] transition-colors ${
          style.border
        } ${isOver ? 'bg-muted/50' : ''}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">Carregando...</div>
        ) : (
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <div key={task.id} className="group">
                <TaskCard task={task} refetchTasks={refetchTasks} />
              </div>
            ))}
          </SortableContext>
        )}
        {tasks.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-muted-foreground text-sm">
              Nenhuma tarefa nesta coluna
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground hover:text-foreground"
              onClick={onAddTask}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar tarefa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}