'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, defaultDropAnimation } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from "@/components/ui/button"
import { Plus, Settings, FileText } from 'lucide-react'
import { Note, Category } from '@/types/notes'
import { NoteCard } from '@/components/notes/note-card'
import { NoteDialog } from '@/components/notes/note-dialog'
import { CategoryDialog } from '@/components/notes/category-dialog'
import { notifications } from '@/lib/notifications'

const dropAnimationConfig = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
  duration: 200,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([
    { 
      id: "1", 
      name: "Roteiros", 
      color: "#2563eb",
      backgroundColor: "#2563eb10"
    },
    { 
      id: "2", 
      name: "Prompts", 
      color: "#0891b2",
      backgroundColor: "#0891b210"
    },
    { 
      id: "3", 
      name: "Outros", 
      color: "#4f46e5",
      backgroundColor: "#4f46e510"
    },
  ])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)

  const activeNote = activeId ? notes.find(note => note.id === activeId) : null

  const handleAddNote = (category: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nova nota",
      content: "",
      category,
      createdAt: new Date(),
    }
    setSelectedNote(newNote)
    setIsViewMode(false)
    setIsNoteDialogOpen(true)
  }

  const handleSaveNote = (note: Note) => {
    if (notes.find(n => n.id === note.id)) {
      setNotes(notes.map(n => n.id === note.id ? note : n))
    } else {
      setNotes([...notes, note])
    }
    setIsNoteDialogOpen(false)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const handleDuplicateNote = (note: Note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (cópia)`,
      createdAt: new Date(),
    }
    setNotes([...notes, newNote])
  }

  const handleSaveCategory = (category: Category) => {
    if (categories.find(c => c.id === category.id)) {
      setCategories(categories.map(c => c.id === category.id ? category : c))
    } else {
      setCategories([...categories, category])
    }
  }

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category) {
      const hasNotes = notes.some(note => note.category === category.name)
      if (hasNotes) {
        notifications.error({
          title: 'Erro',
          description: 'Não é possível excluir uma categoria com notas',
        })
        return
      }
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeNote = notes.find(note => note.id === active.id)
    const overNote = notes.find(note => note.id === over.id)
    const overCategory = categories.find(cat => 
      notes.some(note => note.id === over.id && note.category === cat.name)
    )

    if (activeNote && overCategory && activeNote.category !== overCategory.name) {
      setNotes(notes.map(note => 
        note.id === activeNote.id 
          ? { ...note, category: overCategory.name }
          : note
      ))
      notifications.success({
        title: 'Nota movida',
        description: `Nota movida para ${overCategory.name}`,
      })
    }
  }

  const handleViewNote = (note: Note) => {
    setSelectedNote(note)
    setIsViewMode(true)
    setIsNoteDialogOpen(true)
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Notas</h1>
              <p className="text-gray-600 mt-1">
                Organize suas ideias e anotações
              </p>
            </div>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl overflow-hidden"
                >
                  <div 
                    className="p-6"
                    style={{ backgroundColor: category.backgroundColor }}
                  >
                    <div 
                      className="flex items-center justify-between mb-6 p-4 rounded-xl"
                      style={{ backgroundColor: category.color }}
                    >
                      <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleAddNote(category.name)}
                          className="hover:bg-white/20 text-white"
                          disabled={notes.filter((note) => note.category === category.name).length >= 5}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedCategory(category)
                            setIsCategoryDialogOpen(true)
                          }}
                          className="hover:bg-white/20 text-white"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <SortableContext
                      items={notes.filter(note => note.category === category.name)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {notes
                          .filter((note) => note.category === category.name)
                          .map((note) => (
                            <NoteCard
                              key={note.id}
                              note={note}
                              onView={() => handleViewNote(note)}
                              onEdit={() => {
                                setSelectedNote(note)
                                setIsViewMode(false)
                                setIsNoteDialogOpen(true)
                              }}
                              onDuplicate={handleDuplicateNote}
                              onDelete={handleDeleteNote}
                            />
                          ))}
                      </AnimatePresence>
                    </SortableContext>

                    {notes.filter((note) => note.category === category.name).length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center p-8 text-center bg-white/50 rounded-xl"
                      >
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Nenhuma nota criada</p>
                        <Button
                          variant="link"
                          onClick={() => handleAddNote(category.name)}
                          className="mt-2 text-blue-600"
                        >
                          Criar primeira nota
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <DragOverlay dropAnimation={dropAnimationConfig}>
              {activeNote && (
                <NoteCard
                  note={activeNote}
                  onView={() => {}}
                  onEdit={() => {}}
                  onDuplicate={() => {}}
                  onDelete={() => {}}
                  isDragging
                />
              )}
            </DragOverlay>
          </DndContext>

          <NoteDialog
            note={selectedNote}
            isOpen={isNoteDialogOpen}
            onOpenChange={setIsNoteDialogOpen}
            onSave={handleSaveNote}
            isViewMode={isViewMode}
          />

          <CategoryDialog
            category={selectedCategory}
            isOpen={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
            onSave={handleSaveCategory}
            onDelete={handleDeleteCategory}
          />
        </div>
      </div>
    </div>
  )
}