'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CreditCard, LogOut, Settings, Crown, Bell, Shield, Wallet2 } from 'lucide-react'
import { notifications } from '@/lib/notifications'

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao.silva@example.com',
    plan: 'Pro'
  })
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    notifications.info({
      title: 'Modo de edição',
      description: 'Você pode editar suas informações agora',
      icon: Settings,
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    notifications.success({
      title: 'Alterações salvas',
      description: 'Suas informações foram atualizadas com sucesso',
      icon: Settings,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(false)
    notifications.error({
      title: 'Conta excluída',
      description: 'Sua conta foi excluída permanentemente',
      icon: AlertCircle,
    })
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Minha Conta</h1>
              <p className="text-gray-600 mt-1">
                Gerencie suas informações e preferências
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Informações do Usuário</h2>
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt={user.name}
                        className="rounded-full"
                      />
                    </Avatar>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      onClick={() => {
                        notifications.info({
                          title: 'Editar foto',
                          description: 'Funcionalidade em desenvolvimento',
                          icon: Settings,
                        })
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        {isEditing ? (
                          <Input
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                            className="text-xl font-bold h-12 rounded-xl border-2 border-gray-200 focus:border-blue-600"
                          />
                        ) : (
                          <h2 className="text-xl font-bold">{user.name}</h2>
                        )}
                        {isEditing ? (
                          <Input
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            className="text-gray-500 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-600"
                          />
                        ) : (
                          <p className="text-gray-500">{user.email}</p>
                        )}
                      </div>
                      {isEditing ? (
                        <Button onClick={handleSave} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                          Salvar
                        </Button>
                      ) : (
                        <Button onClick={handleEdit} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                          Editar
                        </Button>
                      )}
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label className="text-blue-800 font-medium">Plano Atual</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Crown className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-lg text-blue-900">{user.plan}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-blue-800 font-medium">Expira em</Label>
                          <p className="mt-1 font-bold text-lg text-blue-900">31/12/2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Estatísticas de Uso</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium text-gray-700">Chamadas de API</Label>
                      <span className="text-sm text-gray-500">1,234 / 5,000</span>
                    </div>
                    <Progress value={24} className="h-2 bg-gray-100" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium text-gray-700">Armazenamento</Label>
                      <span className="text-sm text-gray-500">2.5 GB / 10 GB</span>
                    </div>
                    <Progress value={25} className="h-2 bg-gray-100" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm md:col-span-2">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Configurações</h2>
                <Tabs defaultValue="geral" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                    <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="geral">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Bell className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Notificações por Email</h4>
                            <p className="text-sm text-gray-500">Receba atualizações sobre sua conta</p>
                          </div>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Shield className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Autenticação em Duas Etapas</h4>
                            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seguranca">
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full h-12 rounded-xl"
                        onClick={() => {
                          notifications.info({
                            title: 'Alterar senha',
                            description: 'Um email foi enviado com instruções',
                            icon: Shield,
                          })
                        }}
                      >
                        Alterar Senha
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="notificacoes">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100">
                        <div>
                          <h4 className="font-medium">Notificações Push</h4>
                          <p className="text-sm text-gray-500">Receba notificações em tempo real</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            <Card className="border-0 shadow-sm md:col-span-2">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Ações da Conta</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-2 hover:border-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      notifications.info({
                        title: 'Pagamento',
                        description: 'Redirecionando para a página de pagamento',
                        icon: Wallet2,
                      })
                    }}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Gerenciar Pagamento
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-2 hover:border-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      notifications.info({
                        title: 'Logout',
                        description: 'Você será desconectado em instantes',
                        icon: LogOut,
                      })
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sair
                  </Button>

                  <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="h-12 rounded-xl hover:bg-red-700"
                      >
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Excluir Conta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Você tem certeza que deseja excluir sua conta?</DialogTitle>
                        <DialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirmation(false)}
                          className="rounded-xl"
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          className="rounded-xl"
                        >
                          Sim, excluir minha conta
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}