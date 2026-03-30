import { useItem, useUpdateItem, useDeleteItem } from "@/hooks/use-items";
import { useAuth } from "@/hooks/use-auth";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  Tag, 
  User as UserIcon, 
  Mail, 
  ArrowLeft,
  Loader2,
  Trash2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ItemDetail() {
  const [match, params] = useRoute("/items/:id");
  const id = params?.id || "";
  const { data: item, isLoading, error } = useItem(id);
  const { user } = useAuth();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Item Not Found</h2>
        <Link href="/items">
          <Button variant="outline">Back to Items</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.userId;

  const handleStatusChange = (status: "pending" | "claimed") => {
    updateItem.mutate({ id: item.id, status });
  };

  const handleDelete = () => {
    deleteItem.mutate(item.id, {
      onSuccess: () => {
        window.location.href = "/items";
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/items" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Items
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image */}
        <div className="space-y-6">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted border shadow-lg relative">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted/50 text-muted-foreground">
                <Tag className="h-24 w-24 opacity-20" />
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className={`text-sm px-3 py-1 font-bold shadow-lg ${
                item.type === 'lost' ? 'bg-destructive' : 'bg-primary'
              }`}>
                {item.type.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-sm">
                {item.category}
              </Badge>
              {item.status === 'claimed' && (
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold font-display text-foreground mb-4 leading-tight">
              {item.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          <Card className="p-6 space-y-4 bg-muted/30 border-muted">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(item.date), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{item.author?.firstName || 'Anonymous'}</span>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <p className="font-mono text-sm">{item.contactInfo}</p>
            </div>
          </div>

          {/* Admin Actions */}
          {isOwner && (
            <div className="border-t pt-6 flex flex-wrap gap-4">
              {item.status === 'pending' ? (
                <Button 
                  onClick={() => handleStatusChange('claimed')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Mark as Resolved
                </Button>
              ) : (
                <Button 
                  onClick={() => handleStatusChange('pending')}
                  variant="outline"
                  className="flex-1"
                >
                  Mark as Pending
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this item report.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
