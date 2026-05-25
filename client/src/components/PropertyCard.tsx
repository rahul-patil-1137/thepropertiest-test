import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Maximize, IndianRupee } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const placeholderImg =
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop";

  return (
    <Link to={`/property/${property._id}`}>
      <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={property.images[0] || placeholderImg}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Status badge */}
          <Badge
            className="absolute top-3 left-3"
            variant={property.status === "sale" ? "default" : "info"}
          >
            For {property.status === "sale" ? "Sale" : "Rent"}
          </Badge>

          {/* Type badge */}
          <Badge className="absolute top-3 right-3 capitalize" variant="secondary">
            {property.type}
          </Badge>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white text-lg font-bold flex items-center gap-0.5">
              <IndianRupee className="h-4 w-4" />
              {formatPrice(property.price)}
              {property.status === "rent" && (
                <span className="text-xs font-normal opacity-80">/mo</span>
              )}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="text-sm line-clamp-1">
              {property.location.city}, {property.location.state}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BedDouble className="h-4 w-4" />
              <span>{property.bhk} BHK</span>
            </div>
            {property.area && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Maximize className="h-4 w-4" />
                <span>{property.area} sq.ft</span>
              </div>
            )}
            <Badge variant="outline" className="ml-auto text-xs capitalize">
              {property.furnished}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
