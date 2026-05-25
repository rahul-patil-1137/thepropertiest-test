import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Search,
  Shield,
  TrendingUp,
  ArrowRight,
  Home,
  Building,
  Castle,
} from "lucide-react";

export default function HomePage() {
  const { data, isLoading } = useProperties({ limit: "6" });
  const properties = data?.data || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Trusted by 10,000+ property seekers
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight animate-fade-in">
              Find Your
              <span className="block text-gradient">Dream Property</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in">
              Discover premium apartments, houses, villas, and commercial spaces
              across India. Your perfect property is just a search away.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Button
                size="lg"
                className="text-base px-8 gradient-primary border-0 hover:opacity-90 shadow-lg shadow-blue-500/25"
                asChild
              >
                <Link to="/listings">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Properties
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-white/30 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link to="/register">
                  List Your Property
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full" preserveAspectRatio="none">
            <path
              fill="hsl(var(--background))"
              d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z"
            />
          </svg>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore Property Types
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              From cozy apartments to luxurious villas, find the perfect property type for your needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Home, label: "Apartments", type: "apartment", color: "from-blue-500 to-blue-600" },
              { icon: Building, label: "Houses", type: "house", color: "from-emerald-500 to-emerald-600" },
              { icon: Castle, label: "Villas", type: "villa", color: "from-purple-500 to-purple-600" },
              { icon: Building2, label: "Commercial", type: "commercial", color: "from-amber-500 to-amber-600" },
            ].map((item) => (
              <Link
                key={item.type}
                to={`/listings?type=${item.type}`}
                className="group"
              >
                <div className="flex flex-col items-center p-6 md:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="mt-4 font-semibold">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked properties just for you
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/listings">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-52 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30" />
              <p className="text-lg text-muted-foreground mt-4">
                No properties listed yet. Be the first to list!
              </p>
              <Button className="mt-4" asChild>
                <Link to="/register">List a Property</Link>
              </Button>
            </div>
          )}

          <div className="flex justify-center mt-8 sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/listings">
                View All Properties
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose The Propertist
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Listings",
                description:
                  "Every property is verified by our team to ensure authenticity and accuracy.",
              },
              {
                icon: Search,
                title: "Smart Search",
                description:
                  "Powerful filters to find exactly what you need — by city, type, BHK, price range.",
              },
              {
                icon: TrendingUp,
                title: "Best Deals",
                description:
                  "Compare prices across listings to find the best deals in your preferred location.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 md:p-16 text-white text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-3xl md:text-4xl font-bold relative z-10">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-lg text-white/80 mt-4 max-w-lg mx-auto relative z-10">
              Join thousands of property seekers who found their perfect home through The Propertist.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 shadow-lg"
                asChild
              >
                <Link to="/listings">Start Browsing</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link to="/register">Register as Agent</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
