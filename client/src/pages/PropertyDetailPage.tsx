import { useParams } from "react-router-dom";
import { useProperty } from "@/hooks/useProperties";
import ImageCarousel from "@/components/ImageCarousel";
import EnquiryForm from "@/components/EnquiryForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  BedDouble,
  Maximize,
  IndianRupee,
  Calendar,
  User,
  Mail,
  Phone,
  Sofa,
  Tag,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { User as UserType } from "@/types";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProperty(id || "");
  const property = data?.data;
  const agent = property?.agent as UserType | undefined;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-1/2 mb-3" />
        <Skeleton className="h-4 w-1/3 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Property not found</h2>
        <p className="text-muted-foreground mt-2">
          This property may have been removed or doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Image Carousel */}
      <ImageCarousel images={property.images} title={property.title} />

      {/* Title + Price */}
      <div className="mt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge variant={property.status === "sale" ? "default" : "info"}>
              For {property.status === "sale" ? "Sale" : "Rent"}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {property.type}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {property.furnished}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span>
              {property.location.address}, {property.location.city},{" "}
              {property.location.state} - {property.location.pincode}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1 text-3xl font-bold text-primary shrink-0">
          <IndianRupee className="h-6 w-6" />
          {formatPrice(property.price)}
          {property.status === "rent" && (
            <span className="text-base font-normal text-muted-foreground">
              /month
            </span>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left — Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">BHK</p>
                    <p className="font-semibold">{property.bhk} BHK</p>
                  </div>
                </div>
                {property.area && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Maximize className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Area</p>
                      <p className="font-semibold">{property.area} sq.ft</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Sofa className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Furnished</p>
                    <p className="font-semibold capitalize">{property.furnished}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Listed</p>
                    <p className="font-semibold">{formatDate(property.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="py-1.5 px-3">
                      <Tag className="h-3 w-3 mr-1.5" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Agent Info */}
          {agent && typeof agent === "object" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listed By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">Agent</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{agent.email}</span>
                  </div>
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enquiry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interested?</CardTitle>
            </CardHeader>
            <CardContent>
              <EnquiryForm propertyId={property._id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
