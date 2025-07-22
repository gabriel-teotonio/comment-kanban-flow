import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/kanban';
import { TaskDialog } from './TaskDialog';

export interface TaskCardProps {
  task: Task;
  refetchTasks?: () => void;
}

export function TaskCard({ task, refetchTasks }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`cursor-move transition-all duration-200 hover:shadow-lg bg-gradient-card border-0 ${
          isDragging ? 'opacity-50 rotate-2 scale-105' : ''
        }`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm font-semibold text-foreground line-clamp-2">
              {task.title}
            </CardTitle>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {task.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {task.comments.length} comentários
            </span>
          </div>
          {/* Aqui você pode adicionar mais informações se desejar, como status, datas, etc. */}
        </CardContent>
      </Card>
      <TaskDialog 
        task={task} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        refetchTasks={refetchTasks}
      />
    </>
  );
}