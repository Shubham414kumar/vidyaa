import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Menu, GraduationCap, User, LogOut } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/batches", label: "Batches" },
    { href: "/notes", label: "Notes" },
    { href: "/pyq", label: "PYQ" },
    { href: "/attendance", label: "Attendance" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-accent rounded-lg">
              <GraduationCap className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">VidyaSphere</span>
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild>
                <Link to={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Desktop Auth Buttons (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Button variant="secondary" asChild><Link to="/donate">Donate</Link></Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url || ""} alt={user.fullName || user.email} />
                        <AvatarFallback>{user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}><User className="mr-2 h-4 w-4" /><span>Dashboard</span></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" asChild><Link to="/login">Login</Link></Button>
                <Button asChild><Link to="/signup">Sign Up</Link></Button>
                <Button variant="secondary" asChild><Link to="/donate">Donate</Link></Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button (only visible on mobile) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button key={item.href} variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link to={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/dashboard'); setIsOpen(false); }}>Dashboard</Button>
                      <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>Log Out</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full" onClick={() => setIsOpen(false)}><Link to="/login">Login</Link></Button>
                      <Button asChild className="w-full" onClick={() => setIsOpen(false)}><Link to="/signup">Sign Up</Link></Button>
                    </>
                  )}
                  <Button variant="secondary" asChild className="w-full" onClick={() => setIsOpen(false)}><Link to="/donate">Donate</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;