"use client"

import { useEffect, useState } from "react"
import { Search, User as UserIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { AuthApi } from "~/api/api"
import type { User } from "~/api/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"



export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [members, setMembers] = useState<User[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)


  async function getAllUsers() {
    const response = await AuthApi.getAllUsers(searchQuery)
    setMembers(response.data.data.users)
  }

  function handleViewBorrowingHistory(member: User) {
    setIsAddDialogOpen(true)
    setSelectedMember(member)
  }

  useEffect(() => {
    getAllUsers()
  }, [])




  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Library Members</h2>
              <p className="text-muted-foreground">Manage member accounts and track borrowing</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Borrowing History</DialogTitle>
                  <DialogDescription>View the borrowing history of a member.</DialogDescription>
                </DialogHeader>
                <div className="py-4 max-h-[500px] overflow-y-auto">
                  {selectedMember?.borrowedBooks?.map((book, int) => (
                    <div key={int} className="rounded-lg border border-border p-4 mb-4">
                      <h3 className="text-lg font-bold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">Author: {book.author}</p>
                      <p className="text-sm text-muted-foreground">Borrowed At: {new Date(book.borrowedAt).toLocaleDateString()}</p>
                      <p className="text-sm font-bold text-red-500">Due Date: {new Date(book.dueDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Returned At: {book.returnedAt ? new Date(book.returnedAt).toLocaleDateString() : "Not Returned"}</p>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Button variant="outline" onClick={getAllUsers}>Search</Button>
          </div>

          <div className="grid gap-4">
            {members.map((member, int) => (
              <Card key={int} className="cursor-pointer" onClick={() => handleViewBorrowingHistory(member)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {member.borrowedBooks?.length || 0} books borrowed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Member since: {member.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
