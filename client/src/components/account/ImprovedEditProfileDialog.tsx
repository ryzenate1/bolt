"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast-notification";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldToEdit: "name" | "email" | "phoneNumber" | "password";
  onSuccess?: () => void;
}

export function ImprovedEditProfileDialog({ 
  open, 
  onOpenChange, 
  fieldToEdit, 
  onSuccess 
}: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      [fieldToEdit]: fieldToEdit !== 'password' ? (user?.[fieldToEdit as keyof typeof user] as string || "") : "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const getFieldLabel = () => {
    switch (fieldToEdit) {
      case "name": return "Full Name";
      case "email": return "Email Address";
      case "phoneNumber": return "Phone Number";
      case "password": return "Password";
      default: return "";
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate a delay to show loading state (remove in production)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Handle password update separately
      if (fieldToEdit === 'password') {
        if (data.newPassword !== data.confirmPassword) {
          setError("New passwords don't match");
          setIsLoading(false);
          return;
        }
        
        // Use any type to handle password update which isn't in the User type
        const result = await updateUserProfile({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        } as any);
        
        if (result.success) {
          // Update was successful
          reset();
          onOpenChange(false);
          
          // Delay the toast slightly to ensure dialog closes first
          setTimeout(() => {
            showToast({
              message: "Password updated successfully",
              type: "success"
            });
            if (onSuccess) onSuccess();
          }, 100);
        } else {
          setError(result.message || "Failed to update password");
        }
      } else {
        // Handle other profile fields
        const result = await updateUserProfile({
          [fieldToEdit]: data[fieldToEdit]
        });
        
        if (result.success) {
          // Update was successful
          onOpenChange(false);
          
          // Delay the toast slightly to ensure dialog closes first
          setTimeout(() => {
            showToast({
              message: `Your ${getFieldLabel().toLowerCase()} has been updated successfully`,
              type: "success"
            });
            if (onSuccess) onSuccess();
          }, 100);
        } else {
          setError(result.message || `Failed to update ${getFieldLabel().toLowerCase()}`);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-medium">
            Edit {getFieldLabel()}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          {fieldToEdit !== 'password' ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={fieldToEdit}>{getFieldLabel()}</Label>
                <Input
                  id={fieldToEdit}
                  {...register(fieldToEdit, { 
                    required: `${getFieldLabel()} is required`,
                    ...(fieldToEdit === 'email' && {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }),
                    ...(fieldToEdit === 'phoneNumber' && {
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits"
                      }
                    })
                  })}
                  placeholder={`Enter your ${getFieldLabel().toLowerCase()}`}
                  className="col-span-3"
                />
                {errors[fieldToEdit] && (
                  <p className="text-sm text-red-500">{errors[fieldToEdit]?.message as string}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register('currentPassword', { required: "Current password is required" })}
                  placeholder="Enter your current password"
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword.message as string}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword', { 
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  placeholder="Enter your new password"
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword.message as string}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { 
                    required: "Please confirm your new password",
                    validate: (value, formValues) => 
                      value === formValues.newPassword || "Passwords don't match"
                  })}
                  placeholder="Confirm your new password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message as string}</p>
                )}
              </div>
            </div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 text-tendercuts-red rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full sm:w-auto order-2 sm:order-1" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full sm:w-auto bg-tendercuts-red hover:bg-tendercuts-red-dark order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
