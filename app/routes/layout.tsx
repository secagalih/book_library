import { Outlet, Link, useLocation } from "react-router"
import { BookOpen } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useLogout } from "~/hooks/useLogout";


export default function Layout() {


  const { logout } = useLogout();
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Library System</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/books">Books</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/members">Members</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/borrowing">Borrowing</Link>
            </Button>
            <Button onClick={logout} >Logout</Button>
          </div>

        </div>
      </header>
      <Outlet />
    </div>
  )
}
