"use client";
import { useState, useRef, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Camera, User } from "lucide-react";
import { Country, CountryDropdown } from "@/components/ui/country-dropdown";
import { ImageCropper } from "@/components/forms/profile/image-cropper";
import { countries } from "country-data-list";

const sortedCountries = countries.all
  .filter((country) => country.status === "assigned")
  .sort((a, b) => a.name.localeCompare(b.name));

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

type PersonalInfoStepProps = {
  userRole: string;
};

export default function PersonalInfoStep({ userRole }: PersonalInfoStepProps) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Image handling state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | ArrayBuffer | null>(
    null
  );

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setTempImageSrc(reader.result);
        setShowImageCropper(true);
      });
      reader.readAsDataURL(file);
    }
    // Handle crop completion
    const handleCroppedImage = (croppedImageUrl: string) => {
      setProfileImage(croppedImageUrl);
      setValue("profilePicture", croppedImageUrl);
      setShowImageCropper(false);
    };
    setShowImageCropper(false);
  };

  // Handle country change
  const handleCountryChange = (country: Country) => {
    if (country) {
      setValue("country", country.alpha2);
      const callingCode =
        country.countryCallingCodes && country.countryCallingCodes.length > 0
          ? country.countryCallingCodes[0]
          : "+1";
      setValue("countryCode", callingCode);
    }
  };

  // Remove profile image
  const removeImage = () => {
    setProfileImage(null);
    setValue("profilePicture", null);
  };

  function handleCroppedImage(croppedImageUrl: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-2 border-muted">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="bg-muted">
                  <User className="w-12 h-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById("profile-image");
                    if (input) input.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {profileImage ? "Change" : "Upload"}
                </Button>
                {profileImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                )}
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  aria-label="Upload profile picture"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Upload a professional profile picture (Optional)
                <br />
                Max size: 5MB
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={
                          userRole === "recruiter"
                            ? "Enter your company email"
                            : "Enter your personal email"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {userRole === "recruiter"
                        ? "Please use your company email address."
                        : "Please use your personal email address."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Input Section */}
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={control}
                        name="countryCode"
                        render={({ field: countryCodeField }) => (
                          <FormField
                            control={control}
                            name="country"
                            render={({ field: countryField }) => (
                              <div className="w-[120px]">
                                <CountryDropdown
                                  defaultValue={countryField.value}
                                  onChange={(country) => {
                                    countryField.onChange(country.alpha2);
                                    handleCountryChange(country);
                                    countryCodeField.onChange(
                                      country.countryCallingCodes[0] || "+1"
                                    );
                                  }}
                                  slim={true}
                                />
                              </div>
                            )}
                          />
                        )}
                      />
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit phone number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your full address"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal/ZIP Code *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your postal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Country Selection */}
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>
              <FormControl>
                <CountryDropdown
                  defaultValue={field.value}
                  onChange={(country) => {
                    field.onChange(country.alpha2);
                    handleCountryChange(country);
                  }}
                  placeholder="Select your country"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {genderOptions.map((option) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={option.value}
                          aria-label={option.label}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormField
            control={control}
            name="resume"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="w-full">
                <FormLabel>Resume/CV *</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      {...field}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      id="resume-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size > 2 * 1024 * 1024) {
                          alert("File size should be less than 2MB");
                          e.target.value = "";
                          return;
                        }
                        onChange(file);
                      }}
                      aria-label="Upload resume"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("resume-upload")?.click()
                      }
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {value ? "Change Resume" : "Upload Resume"}
                    </Button>
                    {value && (
                      <span className="text-sm text-muted-foreground">
                        {value instanceof File ? value.name : "Resume uploaded"}
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your resume (PDF, DOC, DOCX). Max size: 2MB
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Summary/Bio *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief summary about yourself (max 200 words)"
                  className="min-h-[150px]"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>
              <FormDescription>
                Highlight your key strengths, experience, and career goals (max
                200 words)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Image Cropper Component */}
      {showImageCropper && tempImageSrc && (
        <ImageCropper
          imageSrc={typeof tempImageSrc === "string" ? tempImageSrc : ""}
          onCroppedImage={handleCroppedImage}
          onCancel={() => setShowImageCropper(false)}
          aspectRatio={1}
        />
      )}
    </div>
  );
}
