"use client"

import React, { useState } from 'react'
import { Task } from '../app/types'
import TaskItem from './TaskItem'
import TaskModal from './TaskModal'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface AllTasksProps {
  tasks: Task[]
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void
  toggleStatus: (id: string) => void
}

export default function AllTasks({ tasks, updateTask, deleteTask, toggleStatus }: AllTasksProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdTime')
  const [showTodayOnly, setShowTodayOnly] = useState(false)

  const openModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const toggleShowTodayOnly = () => {
    setShowTodayOnly(!showTodayOnly)
  }

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const filteredTasks = tasks.filter(task => {
    const taskDeadline = new Date(task.deadline).toISOString().split('T')[0]; // Get task deadline in YYYY-MM-DD format

    const matchesSearchTerm = task.name.toLowerCase().includes(searchTerm.toLowerCase())
    || task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter === 'all' || task.status === statusFilter;

    return (showTodayOnly ? taskDeadline === today : true) && matchesSearchTerm && matchesStatusFilter;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'createdTime') {
      return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
    } else if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0; // Default case
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>all</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="in progress">in progress</SelectItem>
              <SelectItem value="pending">pending</SelectItem>
              <SelectItem value="cancelled">cancelled</SelectItem>
              <SelectItem value="done">done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdTime">created time</SelectItem>
              <SelectItem value="deadline">deadline</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer" title="show only today's tasks">
              <input
                type="checkbox"
                checked={showTodayOnly}
                onChange={toggleShowTodayOnly}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-black-300 dark:peer-focus:ring-black-800 ${showTodayOnly ? 'bg-black' : 'bg-gray-200'} dark:bg-gray-700`}></div>
              <div className="absolute left-1 top-1 bg-white border border-black-300 rounded-full w-4 h-4 transition-transform peer-checked:translate-x-full dark:border-black-600"></div>
            </label>
          </div>
        </div>
        <ul className="space-y-4">
          {sortedTasks.map(task => (
            <li key={task.id}>
              <TaskItem
                task={task}
                onEdit={() => openModal(task)}
                onDelete={() => deleteTask(task.id)}
                onToggleStatus={() => toggleStatus(task.id)}
                showButtons={true}
              />
            </li>
          ))}
        </ul>
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={(task) => {
            updateTask(task)
            closeModal()
          }}
          task={editingTask}
        />
      </CardContent>
    </Card>
  )
}

