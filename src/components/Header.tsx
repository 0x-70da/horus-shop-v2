import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import {
  Book,
  ChevronDown,
  Dumbbell,
  Heart,
  Home,
  Laptop,
  Menu,
  Puzzle,
  Search,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkle,
  User,
  Watch,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCategories } from "../features/categories/categories.hooks";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/auth.hooks";
import { useWishlist } from "@/features/wishlist/wishlist.hooks";
import { useCart } from "@/features/cart/cart.hooks";

const categoryIcons: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="h-4 w-4" />,
  laptop: <Laptop className="h-4 w-4" />,
  book: <Book className="h-4 w-4" />,
  shirt: <Shirt className="h-4 w-4" />,
  watch: <Watch className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  sofa: <Sofa className="h-4 w-4" />,
  sparkle: <Sparkle className="h-4 w-4" />,
  puzzle: <Puzzle className="h-4 w-4" />,
  dumbbell: <Dumbbell className="h-4 w-4" />,
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { categories, isLoading, isError, errorMessage } = useCategories();
  const { wishlistItems } = useWishlist();
  const { items: cartItems } = useCart();

  const wishlistItemsCount = wishlistItems.length;
  const cartItemsCount =
    useMemo(() => {
      return cartItems?.reduce(
        (total: number, item: { quantity: number }) => total + item.quantity,
        0,
      );
    }, [cartItems]) ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Top bar - Promo */}
      <div className="bg-primary py-1.5 text-center text-xs text-primary-foreground">
        <span className="font-medium">
          🎉 Black Friday Sale — Up to 40% Off!
        </span>
        <Link to="/products" className="ml-2 underline hover:no-underline">
          Shop Now
        </Link>
      </div>

      <div className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="hidden text-xl font-bold sm:inline-block">
              Tech<span className="text-primary">Store</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form className="hidden flex-1 md:flex md:max-w-md lg:max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, brands, categories..."
                // value={}
                // onChange={}
                className="w-full pl-10 pr-4"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {isLoading ? (
                  <DropdownMenuLabel>Loading categories...</DropdownMenuLabel>
                ) : isError ? (
                  <DropdownMenuLabel className="text-destructive">
                    {errorMessage || "Failed to load categories"}
                  </DropdownMenuLabel>
                ) : categories ? (
                  categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        to={`/category/${category.id}`}
                        className="flex items-center gap-2"
                      >
                        {categoryIcons[category.icon]}
                        {category.name}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {category.products_count}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuLabel>No categories found</DropdownMenuLabel>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/products">
              <Button
                variant={
                  location.pathname === "/products" ? "secondary" : "ghost"
                }
              >
                All Products
              </Button>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search button - Mobile */}
            <Link to="/search" className="md:hidden">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]"
                  >
                    {wishlistItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]"
                  >
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  {isAuthenticated && user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>
                      Hi, {user?.firstName}!
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-destructive"
                    >
                      Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <nav className="flex flex-col gap-2 py-4">
                <Link
                  to="/products"
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors hover:bg-accent rounded-md",
                    location.pathname === "/products" && "bg-accent",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
                {categories &&
                  !isError &&
                  !isLoading &&
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-accent rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {categoryIcons[category.icon]}
                      {category.name}
                    </Link>
                  ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
