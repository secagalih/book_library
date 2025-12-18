import { Plus, Search, Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BookApi, BorrowingApi } from "~/api/api";
import type { Book } from "~/api/types";
import { toast } from "sonner";



export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "", quantity: 1 })


  async function getBooks() {
    const response = await BookApi.getBooks(searchQuery);
    setBooks(response.data.data.books);
  }

  async function addBook() {
    const response = await BookApi.addBook({ title: newBook.title, author: newBook.author, isbn: newBook.isbn, quantity: 1 });
    setBooks([...books, response.data.data.book]);
    if (response.status === 201) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    setIsAddDialogOpen(false);
  }

  async function borrowBook(bookId: string) {
    const response = await BorrowingApi.addBorrowing({
      bookId: bookId,
      borrowedAt: new Date().toISOString()
    });
    if (response.status === 201) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    await getBooks();
  }

  async function handleAddBook() {
    await addBook();
    await getBooks();
  }
  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Book Collection</h2>
              <p className="text-muted-foreground">Browse and manage your library books</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger >
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                  <DialogDescription>Enter the book details to add it to the library collection.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      placeholder="Enter book title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      placeholder="Enter author name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                      placeholder="Enter ISBN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      value={newBook.quantity}
                      onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) })}
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBook}>Add Book</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Button variant="outline" onClick={getBooks}>Search</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <Card key={book.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg text-balance">{book.title}</CardTitle>
                    {book.quantity > 0 ? (
                      <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                        <Check className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        <X className="h-3 w-3 mr-1" />
                        Empty
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">ISBN: {book.isbn}</p>
                  <p className="text-sm text-muted-foreground mb-4">Quantity: {book.quantity}</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled={!book.quantity || book.quantity === 0} onClick={() => borrowBook(book.id)}>
                    {book.quantity && book.quantity > 0 ? "Borrow Book" : "Currently Unavailable"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}