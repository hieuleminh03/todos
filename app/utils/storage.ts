import { Task } from '../types'

export const loadTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    const tasks = localStorage.getItem('tasks')
    return tasks ? JSON.parse(tasks) : []
  }
  return []
}

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }
}

