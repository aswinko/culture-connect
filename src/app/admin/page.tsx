import { ArrowRight, Package, ShoppingBasket, Truck } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { getUserRole } from "../actions/auth-actions"
import { createClient } from "@/utils/supabase/server"

export default async function DashboardPage() {
  // This is a demo dashboard that shows different content based on user role
  // In a real app, you would fetch the user's role from the server

  const userRole = await getUserRole();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

    // 🔹 Redirect if the user is not a farmer
    if (userRole != "admin") {
      redirect("/"); // 🔹 Redirect to unauthorized page
    }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Next delivery: Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$249.45</div>
            <p className="text-xs text-muted-foreground">+$24.20 from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>You have 3 orders scheduled for delivery this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order #1234</p>
                  <p className="text-sm text-muted-foreground">March 14, 2023</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Items</p>
                  <p className="text-sm text-muted-foreground">5 items</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-sm text-muted-foreground">$45.00</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order #1233</p>
                  <p className="text-sm text-muted-foreground">March 12, 2023</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Items</p>
                  <p className="text-sm text-muted-foreground">3 items</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-sm text-muted-foreground">$27.50</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order #1232</p>
                  <p className="text-sm text-muted-foreground">March 10, 2023</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Items</p>
                  <p className="text-sm text-muted-foreground">7 items</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-sm text-muted-foreground">$52.25</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/orders">
                View all orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
            <CardDescription>Your recurring deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Daily Milk Delivery</p>
                    <p className="text-sm text-green-600 font-medium">Active</p>
                  </div>
                  <p className="text-sm text-muted-foreground">2 liters, every day except Sunday</p>
                  <p className="text-sm text-muted-foreground">Next delivery: Tomorrow, 7:00 AM</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Weekly Vegetable Box</p>
                    <p className="text-sm text-green-600 font-medium">Active</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Mixed seasonal vegetables, every Monday</p>
                  <p className="text-sm text-muted-foreground">Next delivery: March 20, 2023</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Monthly Pantry Essentials</p>
                    <p className="text-sm text-green-600 font-medium">Active</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Rice, flour, oil, and spices, first of every month</p>
                  <p className="text-sm text-muted-foreground">Next delivery: April 1, 2023</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/subscriptions">
                Manage subscriptions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}