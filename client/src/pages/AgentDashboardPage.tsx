import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyListings, useDeleteProperty } from "@/hooks/useProperties";
import { useMyEnquiries, useUpdateEnquiryStatus } from "@/hooks/useEnquiries";
import StatsCard from "@/components/StatsCard";
import EditProfileForm from "@/components/EditProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MessageSquare,
  Eye,
  Plus,
  Trash2,
  Pencil,
  MapPin,
  IndianRupee,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Property, Enquiry } from "@/types";

export default function AgentDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "profile">("overview");
  const [enquiryFilter, setEnquiryFilter] = useState<string | undefined>();
  const { data: listingsData, isLoading: listingsLoading } = useMyListings();
  const { data: enquiriesData, isLoading: enquiriesLoading } = useMyEnquiries(
    1,
    enquiryFilter
  );
  const deleteProperty = useDeleteProperty();
  const updateStatus = useUpdateEnquiryStatus();

  const listings = (listingsData?.data || []) as Property[];
  const enquiries = (enquiriesData?.data || []) as Enquiry[];

  const activeListings = listings.filter((l) => l.isActive).length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Agent Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings and enquiries
          </p>
        </div>
        <Button asChild>
          <Link to="/add-listing">
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Listings"
          value={listings.length}
          icon={Building2}
          description={`${activeListings} active`}
        />
        <StatsCard
          title="Total Enquiries"
          value={enquiriesData?.pagination?.total || 0}
          icon={MessageSquare}
          description={`${newEnquiries} new`}
        />
        <StatsCard
          title="Active Listings"
          value={activeListings}
          icon={Eye}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b mb-8">
        <button
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Settings
        </button>
      </div>

      {activeTab === 'overview' ? (
        /* Two-column layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Listings</CardTitle>
            <Badge variant="secondary">{listings.length}</Badge>
          </CardHeader>
          <CardContent>
            {listingsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-muted-foreground mt-2 text-sm">
                  No listings yet
                </p>
                <Button size="sm" className="mt-3" asChild>
                  <Link to="/add-listing">Create your first listing</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {listings.map((property) => (
                  <div
                    key={property._id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                      !property.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <img
                      src={
                        property.images[0] ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop"
                      }
                      alt={property.title}
                      className="h-16 w-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/property/${property._id}`}
                        className="font-medium text-sm hover:text-primary line-clamp-1"
                      >
                        {property.title}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {property.location.city}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold flex items-center gap-0.5">
                          <IndianRupee className="h-3 w-3" />
                          {formatPrice(property.price)}
                        </span>
                        {!property.isActive && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            Deleted
                          </Badge>
                        )}
                      </div>
                    </div>
                    {property.isActive && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          asChild
                        >
                          <Link to={`/edit-listing/${property._id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if (confirm("Delete this listing?")) {
                              deleteProperty.mutate(property._id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enquiry Inbox */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Enquiry Inbox</CardTitle>
            <Select
              value={enquiryFilter || "all"}
              onValueChange={(v) =>
                setEnquiryFilter(v === "all" ? undefined : v)
              }
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {enquiriesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : enquiries.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-muted-foreground mt-2 text-sm">
                  No enquiries yet
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {enquiries.map((enquiry) => {
                  const prop = enquiry.property as Property;
                  return (
                    <div
                      key={enquiry._id}
                      className="p-3 rounded-lg border space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {enquiry.name}
                          </p>
                          {prop && typeof prop === "object" && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Re: {prop.title}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            enquiry.status === "new"
                              ? "warning"
                              : enquiry.status === "contacted"
                              ? "info"
                              : "success"
                          }
                          className="text-[10px] shrink-0"
                        >
                          {enquiry.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {enquiry.message}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {enquiry.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {enquiry.phone}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <Clock className="h-3 w-3" />
                          {formatDate(enquiry.createdAt)}
                        </span>
                      </div>

                      {enquiry.status !== "closed" && (
                        <div className="flex gap-2 pt-1">
                          {enquiry.status === "new" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() =>
                                updateStatus.mutate({
                                  id: enquiry._id,
                                  status: "contacted",
                                })
                              }
                            >
                              Mark Contacted
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() =>
                              updateStatus.mutate({
                                id: enquiry._id,
                                status: "closed",
                              })
                            }
                          >
                            Close
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      ) : (
        <div className="max-w-3xl">
          <EditProfileForm />
        </div>
      )}
    </div>
  );
}
