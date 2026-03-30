import { useStats } from "@/hooks/use-stats";
import { useItems } from "@/hooks/use-items";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemCard } from "@/components/item-card";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useStats();
  // Fetch items created by current user
  // Since our API doesn't have a specific "my items" endpoint in the schema provided, 
  // we'll fetch all and filter client side or assume the API might be updated.
  // For strict adherence to the schema provided, I'll use the list endpoint and filter by user ID if possible,
  // or just display general dashboard if I can't filter by user.
  // Actually, the schema allows filtering by query params, but not strictly by "userId" exposed in api definition.
  // I will assume for MVP dashboard we show stats and recent items generally, or filter client side if list is small.
  // A proper implementation would add `userId` to the list API filter.
  // For now, let's show ALL items and highlight the user's items if we can match IDs.
  const { data: items, isLoading: itemsLoading } = useItems();

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  const myItems = items?.filter(item => item.userId === user?.id) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName}</p>
        </div>
        <Link href="/report/lost">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.totalLost}</div>
            <p className="text-xs text-muted-foreground">Items reported lost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.totalFound}</div>
            <p className="text-xs text-muted-foreground">Items reported found</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.totalClaimed}</div>
            <p className="text-xs text-muted-foreground">Items reunited with owners</p>
          </CardContent>
        </Card>
      </div>

      {/* User's Items */}
      <div>
        <h2 className="text-xl font-bold font-display mb-6">Your Reported Items</h2>
        {itemsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : myItems.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-muted/20">
            <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No reports yet</h3>
            <p className="text-muted-foreground mb-4">You haven't reported any lost or found items.</p>
            <Link href="/report/lost">
              <Button variant="outline">Create your first report</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
