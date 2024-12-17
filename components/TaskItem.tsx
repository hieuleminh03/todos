import { Task } from '../app/types'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Check, X, Edit, Trash2 } from 'lucide-react'
import { format, isValid } from "date-fns";

interface TaskItemProps {
  task: Task
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
  onToggleStatus: (e: React.MouseEvent) => void
  showButtons: boolean
}

export default function TaskItem({ task, onEdit, onDelete, onToggleStatus, showButtons }: TaskItemProps) {
  const statusColors = {
    'in progress': 'bg-blue-500',
    'pending': 'bg-yellow-500',
    'cancelled': 'bg-red-500',
    'done': 'bg-green-500'
  }

  const createdDate = new Date(task.createdTime);
  const deadlineDate = new Date(task.deadline);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{task.name}</span>
          <Badge className={`${statusColors[task.status]} text-white`}>{task.status}</Badge>
        </CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          created: {isValid(createdDate) ? format(createdDate, "dd/MM/yyyy HH:mm") : "Invalid date"}
        </p>
        <p className="text-sm text-muted-foreground">
          deadline: {isValid(deadlineDate) ? format(deadlineDate, "dd/MM/yyyy") : "Invalid date"}
        </p>
        {task.note && <p className="mt-2 text-sm">{task.note}</p>}
      </CardContent>
      {showButtons && (
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={onToggleStatus} variant="outline" size="sm">
            {task.status === 'done' ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
            {task.status === 'done' ? 'undo' : 'complete'}
          </Button>
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" /> edit
          </Button>
          <Button onClick={onDelete} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" /> delete
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

