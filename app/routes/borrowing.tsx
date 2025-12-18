import { useEffect, useState } from "react"
import { BookOpen, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Label } from "~/components/ui/label"
import { toast } from "sonner"
import { BorrowingApi } from "~/api/api"
import type { Book } from "~/api/types"
import { Badge } from "~/components/ui/badge"

export default function BorrowingPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<{
    id: string;
    title: string;
    author: string;
    isbn: string;
    quantity: number;
    borrowedAt: string;
    dueDate: string;
    returnedAt: string | null;
    status: string;
  }[]>([])

  const getCurrentBorrowedBooks = async () => {
    const response = await BorrowingApi.getBorrowings();
    setBorrowedBooks(response.data.data.borrowedBooks);
  }

  const returnBook = async (id: string) => {
    const response = await BorrowingApi.updateBorrowing({ bookId: id, returnedAt: new Date().toISOString(), status: "RETURNED" });
    if (response.status === 201) {
      toast.success(response.data.message || "Book returned successfully");
    } else {
      toast.error(response.data.message);
    }
    await getCurrentBorrowedBooks();
  }

  useEffect(() => {
    getCurrentBorrowedBooks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Borrowing Management</h2>
            <p className="text-muted-foreground">Handle book checkouts and returns</p>
          </div>


          <div className="space-y-4">
            {borrowedBooks.map((item) => (

              <Card key={item.id} >
                <CardHeader>
                  <CardTitle>{<div className=" flex flex-row justify-between"><p>{item.title}</p>
                    <Badge variant={item.status === "BORROWED" ? "default" : item.status === "RETURNED" ? "secondary" : "destructive"}>
                      {item.status}</Badge></div>}</CardTitle>
                  <CardDescription>{<div className="flex-row justify-between"><p>{item.author}</p> <p>{item.isbn}</p></div>}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">Borrowed: {new Date(item.borrowedAt).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                    </div>
                    {item.status === "BORROWED" && <Button onClick={() => returnBook(item.id)}>
                      Return Book
                    </Button>}
                  </div>
                </CardContent>
              </Card>
            ))}

            {borrowedBooks.length === 0 && (
              <div className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No books currently borrowed.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
