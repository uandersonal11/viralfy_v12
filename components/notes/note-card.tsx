'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Copy, Trash2, Edit } from 'lucide-react'
import { Note } from '@/types/notes'

interface NoteCardProps {
  note: Note
  onView: (note: Note) => void
  onEdit: (note: Note) => void
  onDuplicate: (note: Note) => void
  onDelete: (id: string) => void
  isDragging?: boolean
}

export function NoteCard({ note, onView, onEdit, onDuplicate, onDelete, isDragging }: NoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.05 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group relative mb-4 last:mb-0 cursor-move"
    >
      <Card
        className="bg-white hover:border-blue-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
        onClick={() => onView(note)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{note.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 hover:bg-gray-50 text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(note)
                  }}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(note)
                  }}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(note.id)
                  }}
                  className="text-red-600 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="line-clamp-3 text-sm text-gray-500">{note.content}</p>
        </div>
      </Card>
    </motion.div>
  )
}