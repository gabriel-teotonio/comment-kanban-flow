import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task, Comment } from '@/types/kanban';
import { useDeleteTask, useUpdateTask } from '@/hooks/useTasks';
import { useCreateComment, useDeleteComment } from '@/hooks/useComments';
import { Pencil, Trash2 } from 'lucide-react';
import { Alert } from '../ui/alert';

interface TaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  refetchTasks?: () => void;
}

export function TaskDialog({ task, isOpen, onClose, refetchTasks }: TaskDialogProps) {
  const updateTask = useUpdateTask();
  const createComment = useCreateComment();
  const deleteTask = useDeleteTask();
  const deleteCommentMutation = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
  });
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    updateTask.mutate({
      id: task.id,
      title: editForm.title,
      description: editForm.description,
    }, {
      onSuccess: () => {
        setIsEditing(false);
        refetchTasks?.();
      }
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      createComment.mutate({
        content: newComment.trim(),
        taskId: task.id,
      }, {
        onSuccess: () => {
          setNewComment('');
          refetchTasks?.();
        }
      });
    }
  };

  const handleDeleteTask = () => {
    const confirm = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (confirm) {
      deleteTask.mutate(task.id, {
        onSuccess: () => {
          refetchTasks?.();
        }
      });
    }
  }

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este comentário?')) {
      deleteCommentMutation.mutate(commentId, {
        onSuccess: () => {
          refetchTasks?.();
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            {isEditing ? (
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="text-lg font-semibold"
                placeholder="Título da tarefa"
              />
            ) : (
              <DialogTitle className="text-lg">{task.title}</DialogTitle>
            )}
            <div className="flex items-center gap-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="ml-2"
                >
                <Pencil className="h-3 w-3" /> Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTask()}
                className="ml-2"
              >
                <Trash2 className="h-3 w-3" /> Excluir
              </Button>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Task Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              {isEditing ? (
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-lg font-semibold"
                  placeholder="Título da tarefa"
                />
              ) : (
                <DialogTitle className="text-lg">{task.title}</DialogTitle>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              {isEditing ? (
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Descrição da tarefa"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {task.description || 'Nenhuma descrição fornecida.'}
                </p>
              )}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave}>Salvar</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            )}
            <Separator />
            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Comentários ({Array.isArray(task.comments) ? task.comments.length : 0})</h4>
              </div>
              {/* Add Comment */}
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicionar um comentário..."
                  rows={2}
                  className="flex-1"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Comentar
                </Button>
              </div>
              {/* Comments List */}
              <div className="space-y-3">
                {(Array.isArray(task.comments) ? task.comments : []).map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Comentário #{comment.id}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString('pt-BR')}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {(!Array.isArray(task.comments) || task.comments.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}