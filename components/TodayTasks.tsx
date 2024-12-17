"use client";

import React, { useState, CSSProperties } from "react";
import { Task } from "../app/types";
import TaskItem from "./TaskItem";
import TaskModal from "./TaskModal";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ContextMenu from './ContextMenu';
import { PlusCircle } from "lucide-react";

interface TodayTasksProps {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  handleSort: (sortedTasks: Task[]) => void;
}

export default function TodayTasks({
  tasks,
  addTask,
  updateTask,
  deleteTask,
  toggleStatus,
  handleSort,
}: TodayTasksProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; task: Task | null } | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [draggingPosition, setDraggingPosition] = useState<number | null>(null);

  // log tasks anytime they change use UseEffect
  React.useEffect(() => {
    console.log('tasks', tasks);
  }, [tasks]);

  const openModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const onDragEnd = (event: any) => {
    const { active } = event;

    // Check if the task was dragged to the left side of the window
    if (draggingPosition !== null && draggingPosition > 500) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const updatedTask: Task = { ...tasks[oldIndex], status: 'done' };
      const newOrder = [...tasks.slice(0, oldIndex), updatedTask, ...tasks.slice(oldIndex + 1)];
      handleSort(newOrder);
      return;
    } else if (draggingPosition !== null && draggingPosition < -500) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const updatedTask: Task = { ...tasks[oldIndex], status: 'in progress' };
      const newOrder = [...tasks.slice(0, oldIndex), updatedTask, ...tasks.slice(oldIndex + 1)];
      handleSort(newOrder);
      return;
    }

    // Handle vertical dragging
    const over = event.over;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over?.id);
      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      handleSort(newOrder);
    }
  };

  const handleDragMove = (event: any) => {
    const { delta } = event;
    setDraggingPosition(delta.x);
  };

  const handleContextMenu = (event: React.MouseEvent, task: Task) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, task });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    const taskDeadline = new Date(task.deadline).toISOString().split('T')[0];
    return taskDeadline === todayString;
  });

  return (
    <Card onContextMenu={handleCloseContextMenu}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>for today</span>
          <Button onClick={() => openModal()} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> new task
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} onDragMove={handleDragMove}>
          <SortableContext items={filteredTasks} strategy={verticalListSortingStrategy}>
            <ul className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} onContextMenu={(e) => handleContextMenu(e, task)}>
                  <SortableTaskItem
                    task={task}
                    onEdit={() => openModal(task)}
                    onDelete={() => deleteTask(task.id)}
                    onToggleStatus={() => toggleStatus(task.id)}
                    className={draggingTaskId === task.id ? 'bg-green-200' : ''}
                    onDragStart={() => setDraggingTaskId(task.id)}
                    onDragEnd={() => setDraggingTaskId(null)}
                  />
                </div>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={(task) => {
            if (editingTask) {
              updateTask(task);
            } else {
              addTask(task);
            }
            closeModal();
          }}
          task={editingTask}
        />
        {contextMenu && contextMenu.task && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onComplete={() => {
              if (contextMenu.task) {
                toggleStatus(contextMenu.task.id);
                handleCloseContextMenu();
              }
            }}
            onEdit={() => {
              if (contextMenu.task) {
                openModal(contextMenu.task);
                handleCloseContextMenu();
              }
            }}
            onDelete={() => {
              if (contextMenu.task) {
                deleteTask(contextMenu.task.id);
                handleCloseContextMenu();
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface SortableTaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  className?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

function SortableTaskItem({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  className
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: 'auto',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className={className}>
      <TaskItem
        task={task}
        onEdit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onEdit();
        }}
        onDelete={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDelete();
        }}
        onToggleStatus={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onToggleStatus();
        }}
        showButtons={false}
      />
    </li>
  );
}
