import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, type PropertyFormData } from "@/schemas/property.schema";
import { useCreateProperty } from "@/hooks/useProperties";
import ImageUploadInput from "@/components/ImageUploadInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_TYPES, PROPERTY_STATUS, BHK_OPTIONS, FURNISHED_OPTIONS } from "@/lib/constants";
import { ChevronLeft, ChevronRight, CheckCircle, Upload } from "lucide-react";

const STEPS = [
  { id: 1, title: "Basic Info", description: "Property details" },
  { id: 2, title: "Location", description: "Address information" },
  { id: 3, title: "Details", description: "Area & amenities" },
  { id: 4, title: "Images", description: "Upload photos" },
];

export default function AddListingPage() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();
  const createProperty = useCreateProperty();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: "apartment",
      status: "sale",
      bhk: 2,
      furnished: "unfurnished",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof PropertyFormData)[] = [];
    if (step === 1) fieldsToValidate = ["title", "description", "type", "status", "bhk", "price"];
    if (step === 2) fieldsToValidate = ["address", "city", "state", "pincode"];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data: PropertyFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });
    images.forEach((img) => formData.append("images", img));

    createProperty.mutate(formData, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Add New Listing</h1>
      <p className="text-muted-foreground mb-8">
        Fill in the details to list your property
      </p>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  step > s.id
                    ? "bg-emerald-500 text-white"
                    : step === s.id
                    ? "gradient-primary text-white shadow-lg shadow-blue-500/25"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.id ? <CheckCircle className="h-5 w-5" /> : s.id}
              </div>
              <span className="text-xs mt-1.5 font-medium hidden sm:block">
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  step > s.id ? "bg-emerald-500" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form 
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
      >
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Spacious 3BHK Apartment in Bandra"
                  {...register("title")}
                  className="mt-1.5"
                />
                {errors.title && (
                  <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  rows={5}
                  {...register("description")}
                  className="mt-1.5"
                />
                {errors.description && (
                  <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Property Type</Label>
                  <Select
                    value={watch("type")}
                    onValueChange={(v) => setValue("type", v as PropertyFormData["type"])}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Listing For</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(v) => setValue("status", v as PropertyFormData["status"])}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_STATUS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>BHK</Label>
                  <Select
                    value={String(watch("bhk"))}
                    onValueChange={(v) => setValue("bhk", Number(v))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BHK_OPTIONS.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g. 5000000"
                    {...register("price")}
                    className="mt-1.5"
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive mt-1">{errors.price.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  {...register("address")}
                  className="mt-1.5"
                />
                {errors.address && (
                  <p className="text-xs text-destructive mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Mumbai"
                    {...register("city")}
                    className="mt-1.5"
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="e.g. Maharashtra"
                    {...register("state")}
                    className="mt-1.5"
                  />
                  {errors.state && (
                    <p className="text-xs text-destructive mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="e.g. 400050"
                  {...register("pincode")}
                  className="mt-1.5"
                />
                {errors.pincode && (
                  <p className="text-xs text-destructive mt-1">{errors.pincode.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Area (sq.ft)</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="e.g. 1200"
                    {...register("area")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Furnished Status</Label>
                  <Select
                    value={watch("furnished") || "unfurnished"}
                    onValueChange={(v) =>
                      setValue("furnished", v as PropertyFormData["furnished"])
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FURNISHED_OPTIONS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="amenities">Amenities</Label>
                <Input
                  id="amenities"
                  placeholder="e.g. Parking, Swimming Pool, Gym, Garden"
                  {...register("amenities")}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate with commas
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Images */}
        {step === 4 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploadInput
                images={images}
                onImagesChange={setImages}
                maxImages={5}
              />
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <Button 
              key="next-btn" 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                nextStep();
              }}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {step === 4 && (
            <Button
              key="submit-btn"
              type="submit"
              disabled={createProperty.isPending}
              className="gradient-primary border-0"
            >
              {createProperty.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Publish Listing
                </span>
              )}
            </Button>
          )}
        </div>

        {createProperty.isError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
            {(createProperty.error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message || "Failed to create listing. Please try again."}
          </div>
        )}
      </form>
    </div>
  );
}
