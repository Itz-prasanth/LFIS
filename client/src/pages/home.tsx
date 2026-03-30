import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useStats } from "@/hooks/use-stats";

export default function Home() {
  const { data: stats } = useStats();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
                New Feature: AI Matching
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-foreground leading-[1.1]">
                Find what you've lost, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  return what you've found.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                A community-driven platform to reconnect people with their lost belongings. 
                Simple, fast, and secure reporting for everyone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/report/lost">
                  <Button size="lg" className="text-base h-12 px-8 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                    I Lost Something
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/report/found">
                  <Button variant="outline" size="lg" className="text-base h-12 px-8">
                    I Found Something
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Secure contact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Instant alerts</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Abstract decorative elements */}
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
              
              {/* Unsplash Image with Overlay */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 glass-card">
                 {/* hero image: minimalist lost and found items flatlay */}
                <img 
                  src="https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800&q=80" 
                  alt="Lost and Found Concept" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="font-semibold text-lg">Over {stats?.totalFound || 120}+ items found this month</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Items Lost", value: stats?.totalLost || "0", color: "text-red-500" },
              { label: "Items Found", value: stats?.totalFound || "0", color: "text-green-500" },
              { label: "Successfully Returned", value: stats?.totalClaimed || "0", color: "text-primary" },
              { label: "Community Members", value: stats?.totalUsers || "0", color: "text-accent" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-4xl font-bold font-display mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Our platform streamlines the process of reporting and recovering lost items through a simple 3-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="h-10 w-10 text-primary" />}
              title="Search & Browse"
              description="Browse through our extensive database of found items or search for specific keywords."
              link="/items"
              linkText="Browse Items"
            />
            <FeatureCard 
              icon={<Plus className="h-10 w-10 text-destructive" />}
              title="Report Lost Item"
              description="Create a detailed report of what you lost, where, and when to help others find it."
              link="/report/lost"
              linkText="Report Loss"
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-green-600" />}
              title="Report Found Item"
              description="Found something? Be a hero and report it so the owner can be reunited with their property."
              link="/report/found"
              linkText="Report Find"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, linkText }: any) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="mb-6 p-4 rounded-full bg-background shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-8 flex-1">{description}</p>
      <Link href={link}>
        <Button variant="outline" className="w-full">
          {linkText}
        </Button>
      </Link>
    </div>
  );
}
