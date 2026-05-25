import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { PROPERTY_TYPES, PROPERTY_STATUS, BHK_OPTIONS } from "@/lib/constants";
import { debounce } from "@/lib/utils";

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") || "");

  // Debounced city search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetCity = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("city", value);
      } else {
        params.delete("city");
      }
      params.delete("page");
      setSearchParams(params);
    }, 300),
    [searchParams]
  );

  useEffect(() => {
    debouncedSetCity(city);
  }, [city, debouncedSetCity]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const clearFilters = () => {
    setCity("");
    setSearchParams({});
  };

  const hasFilters =
    searchParams.has("city") ||
    searchParams.has("bhk") ||
    searchParams.has("type") ||
    searchParams.has("status") ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice");

  return (
    <div className="bg-card border rounded-xl p-4 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* City Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* BHK Select */}
        <Select
          value={searchParams.get("bhk") || "all"}
          onValueChange={(v) => handleFilterChange("bhk", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="BHK" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All BHK</SelectItem>
            {BHK_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Select */}
        <Select
          value={searchParams.get("type") || "all"}
          onValueChange={(v) => handleFilterChange("type", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PROPERTY_TYPES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Select */}
        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(v) => handleFilterChange("status", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Buy & Rent</SelectItem>
            {PROPERTY_STATUS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price range + Clear */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <Input
          type="number"
          placeholder="Min Price"
          value={searchParams.get("minPrice") || ""}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          className="w-36"
        />
        <span className="text-muted-foreground text-sm">to</span>
        <Input
          type="number"
          placeholder="Max Price"
          value={searchParams.get("maxPrice") || ""}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          className="w-36"
        />
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
