import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2, Trash2, Users, PackageSearch, MessageSquare,
  ShieldAlert, CheckCircle, Clock, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// ── helpers ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

type Tab = "users" | "items" | "messages";

// ── component ─────────────────────────────────────────────────────────────────
export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const qc = useQueryClient();
  const { toast } = useToast();

  // Redirect non-admins
  if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
    window.location.href = "/";
    return null;
  }

  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => fetch("/api/admin/users", { credentials: "include" }).then(r => r.json()),
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/items"],
    queryFn: () => fetch("/api/admin/items", { credentials: "include" }).then(r => r.json()),
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/messages"],
    queryFn: () => fetch("/api/admin/messages", { credentials: "include" }).then(r => r.json()),
    enabled: isAuthenticated && user?.role === "admin",
  });

  // ── mutations ────────────────────────────────────────────────────────────
  const deleteUser = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/users"] }); toast({ title: "User deleted" }); },
    onError: () => toast({ title: "Failed to delete user", variant: "destructive" }),
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/items/${id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/items"] }); toast({ title: "Item deleted" }); },
    onError: () => toast({ title: "Failed to delete item", variant: "destructive" }),
  });

  const toggleItemStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/admin/items/${id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/items"] }); toast({ title: "Status updated" }); },
    onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
  });

  const deleteMessage = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/messages/${id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/messages"] }); toast({ title: "Message deleted" }); },
    onError: () => toast({ title: "Failed to delete message", variant: "destructive" }),
  });

  if (authLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: "users", label: "Users", icon: Users, count: users.length },
    { key: "items", label: "Items", icon: PackageSearch, count: items.length },
    { key: "messages", label: "Messages", icon: MessageSquare, count: messages.length },
  ];

  const lostCount = items.filter((i: any) => i.type === "lost").length;
  const foundCount = items.filter((i: any) => i.type === "found").length;
  const claimedCount = items.filter((i: any) => i.status === "claimed").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-100 rounded-xl">
          <ShieldAlert className="h-7 w-7 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Monitor and manage the Lost &amp; Found platform</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
        <StatCard label="Lost Items" value={lostCount} icon={PackageSearch} color="bg-orange-500" />
        <StatCard label="Found Items" value={foundCount} icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Claimed" value={claimedCount} icon={Clock} color="bg-purple-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Users Tab ──────────────────────────────────────────────────────── */}
      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6" /></div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-left">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Joined</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-medium">{u.firstName} {u.lastName}</td>
                        <td className="py-3 text-muted-foreground">{u.email}</td>
                        <td className="py-3">
                          <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 text-right">
                          {u.role !== "admin" && (
                            <Button
                              variant="ghost" size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (confirm(`Delete user ${u.email}?`)) deleteUser.mutate(u.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Items Tab ──────────────────────────────────────────────────────── */}
      {activeTab === "items" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Reported Items</CardTitle>
          </CardHeader>
          <CardContent>
            {itemsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6" /></div>
            ) : items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-left">
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-medium max-w-[180px] truncate">{item.title}</td>
                        <td className="py-3">
                          <Badge variant={item.type === "lost" ? "destructive" : "default"}>
                            {item.type}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">{item.category}</td>
                        <td className="py-3">
                          <Badge variant={item.status === "claimed" ? "secondary" : "outline"}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 text-right flex items-center justify-end gap-1">
                          <Button
                            variant="ghost" size="sm"
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title={item.status === "claimed" ? "Mark as Pending" : "Mark as Claimed"}
                            onClick={() =>
                              toggleItemStatus.mutate({
                                id: item.id,
                                status: item.status === "claimed" ? "pending" : "claimed",
                              })
                            }
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (confirm(`Delete item "${item.title}"?`)) deleteItem.mutate(item.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Messages Tab ───────────────────────────────────────────────────── */}
      {activeTab === "messages" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messagesLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6" /></div>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <div key={msg.id} className="border rounded-xl p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{msg.name}</span>
                          <span className="text-xs text-muted-foreground">{msg.email}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                      </div>
                      <Button
                        variant="ghost" size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        onClick={() => {
                          if (confirm("Delete this message?")) deleteMessage.mutate(msg.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
