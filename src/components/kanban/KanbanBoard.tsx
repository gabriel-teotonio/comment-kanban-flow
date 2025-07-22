import { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Task, Status } from '@/types/kanban';
import { useTasks, useUpdateTaskStatus } from '@/hooks/useTasks';

const columns = [
  { id: 'PENDING' as Status, title: 'A Fazer' },
  { id: 'IN_PROGRESS' as Status, title: 'Em Progresso' },
  { id: 'TESTING' as Status, title: 'Em Testes' },
  { id: 'DONE' as Status, title: 'Concluído' },
];

export function KanbanBoard() {
  const { data: tasks = [], isLoading, refetch } = useTasks();
  const updateTaskStatus = useUpdateTaskStatus();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormDefaultStatus, setTaskFormDefaultStatus] = useState<Status>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  console.log(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter tasks based on search
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }
    return filtered;
  }, [tasks, searchTerm]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = filteredTasks.filter(task => task.status === column.id);
      return acc;
    }, {} as Record<Status, Task[]>);
  }, [filteredTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const taskId = Number(active.id);
    const newStatus = over.id as Status;
    if (columns.some(col => col.id === newStatus)) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== newStatus) {
        updateTaskStatus.mutate({ id: taskId, status: newStatus });
      }
    }
  };

  const handleAddTask = (status: Status) => {
    setTaskFormDefaultStatus(status);
    setIsTaskFormOpen(true);
  };

  const handleAddTaskGeneral = () => {
    setTaskFormDefaultStatus('PENDING');
    setIsTaskFormOpen(true);
  };

  return (
    <div className="h-full bg-gradient-board flex flex-col">
      {/* Header */}
      <div className="p-6 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
            <p className="text-muted-foreground">
              Gerencie suas tarefas de forma visual e eficiente
            </p>
          </div>
          <Button onClick={handleAddTaskGeneral} className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      {/* Board */}
      <div className="flex-1 p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full min-w-fit">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={tasksByStatus[column.id]}
                onAddTask={() => handleAddTask(column.id)}
                isLoading={isLoading}
                refetchTasks={refetch}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 scale-105">
                <TaskCard task={activeTask} refetchTasks={refetch} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {/* Task Form */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        refetchTasks={refetch}
      />
    </div>
  );
}