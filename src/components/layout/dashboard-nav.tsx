"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Package, ShoppingBasket, ShoppingCart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

// const adminNavItems = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: Home,
//   },
//   {
//     title: "Products",
//     href: "/dashboard/products",
//     icon: Package,
//   },
//   {
//     title: "Orders",
//     href: "/dashboard/orders",
//     icon: ShoppingBasket,
//   },
//   {
//     title: "Analytics",
//     href: "/dashboard/analytics",
//     icon: BarChart3,
//   },
// ]

const customerNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Browse Products",
    href: "/dashboard/browse",
    icon: Package,
  },
  {
    title: "My Cart",
    href: "/dashboard/cart",
    icon: ShoppingCart,
  },
  {
    title: "My Orders",
    href: "/dashboard/orders",
    icon: ShoppingBasket,
  },
  {
    title: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: Users,
  },
]

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Event",
    href: "/admin/event",
    icon: Package,
  },
  {
    title: "Category",
    href: "/admin/category",
    icon: BarChart3,
  },
  // {
  //   title: "Orders",
  //   href: "/dashboard/orders",
  //   icon: ShoppingBasket,
  // },
  // {
  //   title: "Deliveries",
  //   href: "/dashboard/deliveries",
  //   icon: Truck,
  // },
]

export function DashboardNav({ userRole}: {userRole: string}) {
  const pathname = usePathname()

  // Select nav items based on user role
  const navItems =
    userRole === "admin"
      ? adminNavItems
      : customerNavItems

  return (
    <nav className="grid gap-1 px-2">
      {navItems.map((item, index) => (
        <Button key={index} asChild variant={pathname === item.href ? "secondary" : "ghost"} className="justify-start">
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}