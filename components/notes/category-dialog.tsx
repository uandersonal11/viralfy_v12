'use client'

import React from 'react'
import { HexColorPicker } from 'react-colorful'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Category } from '@/types/notes'
import { notifications } from '@/lib/notifications'
import { Check } from 'lucide-react'

interface CategoryDialogProps {
  category: Category | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (category: Category) => void
  onDelete: (id: string) => void
}

export function CategoryDialog({ category, isOpen, onOpenChange, onSave, onDelete }: CategoryDialogProps) {
  const [name, setName] = React.useState(category?.name || '')
  const [color, setColor] = React.useState(category?.color || '#2563eb')

  React.useEffect(() => {
    if (category) {
      setName(category.name)
      setColor(category.color)
    }
  }, [category])

  const handleSave = () => {
    if (!name.trim()) {
      notifications.error({
        title: 'Erro',
        description: 'O nome da categoria é obrigatório',
      })
      return
    }

    const updatedCategory: Category = {
      id: category?.id || Date.now().toString(),
      name: name.trim(),
      color,
      backgroundColor: `${color}10`,
    }

    onSave(updatedCategory)
    onOpenChange(false)
    notifications.success({
      title: 'Sucesso',
      description: 'Categoria salva com sucesso',
      icon: Check,
    })
  }

  const handleDelete = () => {
    if (category) {
      onDelete(category.id)
      onOpenChange(false)
      notifications.success({
        title: 'Sucesso',
        description: 'Categoria excluída com sucesso',
        icon: Check,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category?.id ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>
            Personalize sua categoria com um nome e cor
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nome da categoria
            </label>
            <Input
              placeholder="Digite o nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-gray-200 focus:border-blue-600 focus:ring-0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Cor da categoria
            </label>
            <HexColorPicker color={color} onChange={setColor} />
            <div className="mt-4 flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-lg border border-gray-200"
                style={{ backgroundColor: color }}
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-blue-600 focus:ring-0"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          {category?.id && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              Excluir categoria
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}