import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { BookOpen, Users, ArrowRightLeft } from "lucide-react"
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { AuthApi, BookApi, BorrowingApi } from "~/api/api";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Library Borrowing System" },
    { name: "description", content: "Manage your library collection, track members, and handle book borrowing operations" },
  ];
}

export default function Home() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBorrowings, setTotalBorrowings] = useState(0);
  async function getTotalBooks() {
    const response = await BookApi.getTotalBooks();
      console.log(response.data.data.totalBooks);
    setTotalBooks(response.data.data.totalBooks);
  }

  async function getTotalUsers() {
    const response = await AuthApi.getTotalUsers();
      console.log(response.data.data.totalUsers);
    setTotalUsers(response.data.data.totalUsers);
  }

  async function getTotalBorrowings() {
    const response = await BorrowingApi.getTotalBorrowings();
    setTotalBorrowings(response.data.data.totalBorrowings);
  }
  useEffect(() => {
    getTotalBooks();
    getTotalUsers();
    getTotalBorrowings();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-foreground text-balance">Library Borrowing System</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Manage your library collection, track members, and handle book borrowing operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-chart-1" />
                </div>
                <CardTitle>Books</CardTitle>
                <CardDescription>Manage your library collection and track availability</CardDescription>
              </CardHeader>
              <CardContent>
                <Button  className="w-full">
                  <Link to="/books">View Books</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-chart-2" />
                </div>
                <CardTitle>Members</CardTitle>
                <CardDescription>Track library members and their borrowing history</CardDescription>
              </CardHeader>
              <CardContent>
                <Button  className="w-full">
                  <Link to="/members">View Members</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <ArrowRightLeft className="h-8 w-8 text-chart-3" />
                </div>
                <CardTitle>Borrowing</CardTitle>
                <CardDescription>Handle book checkouts and returns efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <Button  className="w-full">
                  <Link to="/borrowing">Manage Borrowing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-foreground">{totalBooks}</div>
                  <div className="text-sm text-muted-foreground">Total Books</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{totalBorrowings}</div>
                  <div className="text-sm text-muted-foreground">Books Borrowed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
