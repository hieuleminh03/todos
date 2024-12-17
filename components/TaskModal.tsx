"use client"

import React, { useEffect, useState } from 'react'
import { Task } from '../app/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  task?: Task | null
}

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [taskData, setTaskData] = useState<Task>({
    id: '',
    name: '',
    description: '',
    status: 'pending',
    createdTime: new Date().toISOString(),
    deadline: new Date().toISOString().split('T')[0],
    note: '',
  })

  useEffect(() => {
    if (task) {
      setTaskData(task)
    } else {
      setTaskData({
        // generate a random id
        id: Math.random().toString(36).substring(2, 15),
        name: '',
        description: '',
        status: 'pending',
        createdTime: new Date().toISOString(),
        deadline: new Date().toISOString().split('T')[0],
        note: '',
      })
    }
  }, [task, isOpen])

  const handleSave = () => {
    onSave(taskData)
  }

  const handleSelectToday = () => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    setTaskData({ ...taskData, deadline: today.toISOString().split('T')[0] })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'edit' : 'add new'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              name
            </label>
            <Input id="name" value={taskData.name} onChange={(e) => setTaskData({ ...taskData, name: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right">
              description
            </label>
            <Textarea
              id="description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="text-right">
              status
            </label>
            <Select value={taskData.status} onValueChange={(value: string) => setTaskData({ ...taskData, status: value as 'in progress' | 'pending' | 'cancelled' | 'done' })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in progress">in progress</SelectItem>
                <SelectItem value="pending">pending</SelectItem>
                <SelectItem value="cancelled">cancelled</SelectItem>
                <SelectItem value="done">done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="deadline" className="text-right">
              deadline
            </label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    {taskData.deadline ? format(new Date(taskData.deadline), "dd/MM/yyyy") : <span>pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={taskData.deadline ? new Date(taskData.deadline) : undefined}
                    onSelect={(day: Date | undefined) => {
                      if (day) {
                        day.setHours(23, 59, 59, 999)
                        setTaskData({ ...taskData, deadline: day.toISOString().split('T')[0] })
                      } else {
                        setTaskData({ ...taskData, deadline: new Date().toISOString().split('T')[0] })
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="note" className="text-right">
              note
            </label>
            <Textarea
              id="note"
              value={taskData.note}
              onChange={(e) => setTaskData({ ...taskData, note: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">cancel</Button>
          <Button onClick={handleSave}>save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

