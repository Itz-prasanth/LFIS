import { Link } from "wouter";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Tag } from "lucide-react";
import type { Item, User } from "@shared/schema";

interface ItemCardProps {
  item: Item & { author?: User };
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full border-border/50">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/50 text-muted-foreground">
            <Tag className="h-12 w-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={item.type === "lost" ? "destructive" : "default"}
            className="shadow-sm uppercase tracking-wider font-bold text-[10px]"
          >
            {item.type}
          </Badge>
        </div>
        {item.status === "claimed" && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] flex items-center justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-1 font-bold border-2 border-primary/20">
              CLAIMED
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {item.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {item.description}
        </p>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/items/${item.id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:bg-primary/5">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
