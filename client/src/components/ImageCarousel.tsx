import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const placeholder =
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop";

  const displayImages = images.length > 0 ? images : [placeholder];

  const prev = () =>
    setCurrent((c) => (c === 0 ? displayImages.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === displayImages.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-muted">
      {/* Main image */}
      <div className="aspect-[16/10] relative">
        <img
          src={displayImages[current]}
          alt={`${title} - Image ${current + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Navigation arrows */}
      {displayImages.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            onClick={prev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            onClick={next}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Dots */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {displayImages.map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {displayImages.length > 1 && (
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
          {current + 1} / {displayImages.length}
        </div>
      )}
    </div>
  );
}
