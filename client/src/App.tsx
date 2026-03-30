import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ReportItem from "@/pages/report-item";
import ItemsList from "@/pages/items-list";
import ItemDetail from "@/pages/item-detail";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/items" component={ItemsList} />
        <Route path="/items/:id" component={ItemDetail} />
        <Route path="/report/lost">
          {() => <ReportItem type="lost" />}
        </Route>
        <Route path="/report/found">
          {() => <ReportItem type="found" />}
        </Route>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/admin" component={Admin} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AuthListener() {
  // Global listener for auth state to handle 401 redirects if needed globally
  // Though most pages handle it individually, this is good for app-wide consistency
  const { isAuthenticated, isLoading } = useAuth();
  
  // This component doesn't render anything, just logic hook
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthListener />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
