import { useSearchParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import FilterBar from "@/components/FilterBar";
import { useProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyFilters } from "@/types";

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: PropertyFilters = {
    city: searchParams.get("city") || undefined,
    bhk: searchParams.get("bhk") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    type: searchParams.get("type") || undefined,
    status: searchParams.get("status") || undefined,
    page: searchParams.get("page") || "1",
    limit: "12",
  };

  const { data, isLoading } = useProperties(filters);
  const properties = data?.data || [];
  const pagination = data?.pagination;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Browse Properties</h1>
        <p className="text-muted-foreground mt-2">
          {pagination
            ? `${pagination.total} properties found`
            : "Discover your next home"}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterBar />
      </div>

      {/* Property Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-52 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                disabled={pagination.page <= 1}
                onClick={() => goToPage(pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.pages ||
                    Math.abs(p - pagination.page) <= 2
                )
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-muted-foreground">…</span>
                    )}
                    <Button
                      variant={p === pagination.page ? "default" : "outline"}
                      size="icon"
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </Button>
                  </span>
                ))}

              <Button
                variant="outline"
                size="icon"
                disabled={pagination.page >= pagination.pages}
                onClick={() => goToPage(pagination.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mt-4">No properties found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
}
