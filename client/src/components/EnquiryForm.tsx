import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormData } from "@/schemas/enquiry.schema";
import { useCreateEnquiry } from "@/hooks/useEnquiries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle } from "lucide-react";
import { useState } from "react";

interface EnquiryFormProps {
  propertyId: string;
}

export default function EnquiryForm({ propertyId }: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const createEnquiry = useCreateEnquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = (data: EnquiryFormData) => {
    createEnquiry.mutate(
      { ...data, property: propertyId },
      {
        onSuccess: () => {
          reset();
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 5000);
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
        <h3 className="text-lg font-semibold">Enquiry Submitted!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The agent will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="enquiry-name">Full Name</Label>
        <Input
          id="enquiry-name"
          placeholder="Your full name"
          {...register("name")}
          className="mt-1.5"
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="enquiry-email">Email</Label>
        <Input
          id="enquiry-email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          className="mt-1.5"
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="enquiry-phone">Phone</Label>
        <Input
          id="enquiry-phone"
          placeholder="+91 98765 43210"
          {...register("phone")}
          className="mt-1.5"
        />
        {errors.phone && (
          <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="enquiry-message">Message</Label>
        <Textarea
          id="enquiry-message"
          placeholder="I'm interested in this property..."
          rows={4}
          {...register("message")}
          className="mt-1.5"
        />
        {errors.message && (
          <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createEnquiry.isPending}
      >
        {createEnquiry.isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Enquiry
          </span>
        )}
      </Button>

      {createEnquiry.isError && (
        <p className="text-sm text-destructive text-center">
          Failed to submit enquiry. Please try again.
        </p>
      )}
    </form>
  );
}
