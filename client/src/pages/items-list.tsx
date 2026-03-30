import { useState } from "react";
import { useItems } from "@/hooks/use-items";
import { ItemCard } from "@/components/item-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, FilterX } from "lucide-react";
import { motion } from "framer-motion";

export default function ItemsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState<"lost" | "found" | "all">("all");
  
  // Debounce search could be added here, but for simplicity passing direct
  const { data: items, isLoading, isError } = useItems({ 
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    type: type !== "all" ? type : undefined,
  });

  const categories = ["Electronics", "Clothing", "Keys", "Wallet", "Documents", "Other"];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">Browse Items</h1>
            <p className="text-muted-foreground mt-1">
              Search through reported lost and found items.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearch("");
                setCategory("all");
                setType("all");
              }}
              disabled={!search && category === "all" && type === "all"}
            >
              <FilterX className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(val: any) => setType(val)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="found">Found</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading items...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-24 text-destructive">
            <p>Failed to load items. Please try again later.</p>
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No items found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              We couldn't find any items matching your filters. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ItemCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
