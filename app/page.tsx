"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodayTasks from './../components/TodayTasks'
import AllTasks from './../components/AllTasks'
import { Task } from './types'
import { loadTasks, saveTasks } from './utils/storage'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ThemeToggle } from './../components/theme-toggle'

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(loadTasks())
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'done' ? 'in progress' : 'done'
        return { ...task, status: newStatus }
      }
      return task
    }))
  }

  const handleSort = (sortedTasks: Task[]) => {
    setTasks(sortedTasks)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        try {
          const importedTasks = JSON.parse(content)
          setTasks(importedTasks)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = 'tasks.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">todos</h1>
        <ThemeToggle />
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>import/export</CardTitle>
          <CardDescription>data management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input type="file" onChange={handleImport} accept=".json" className="flex-grow" />
            <Button onClick={handleExport} variant="outline">export</Button>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">today</TabsTrigger>
          <TabsTrigger value="all">all time</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <TodayTasks
            tasks={tasks}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleStatus={toggleStatus}
            handleSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="all">
          <AllTasks
            tasks={tasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleStatus={toggleStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

