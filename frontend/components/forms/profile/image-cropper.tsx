"use client";

import { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ImageCropperProps {
  imageSrc: string;
  onCroppedImage: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({
  imageSrc,
  onCroppedImage,
  onCancel,
  aspectRatio = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });

  const imageRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!imageRef.current) return;

    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Ensure the canvas size matches the desired crop size
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set the canvas background to white for profile photos
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the cropped image
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Convert canvas to blob and then to a data URL
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onCroppedImage(base64data);
        };
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Crop Profile Picture</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative overflow-hidden rounded-lg border">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspectRatio}
              circularCrop
              className="max-h-[600px] w-full object-contain"
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-h-[600px] w-full object-contain"
              />
            </ReactCrop>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Drag to reposition the crop area. The image will be cropped to a
            circle for your profile picture.
          </p>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={getCroppedImg}>
            Save & Apply
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
