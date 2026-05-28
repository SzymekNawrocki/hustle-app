"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAccount } from "@/hooks/use-account";
import { getApiError } from "@/lib/api";
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "@/lib/schemas";

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;

// ---------------------------------------------------------------------------
// Profile section
// ---------------------------------------------------------------------------

function ProfileSection() {
  const { data: user } = useCurrentUser();
  const { updateProfile } = useAccount();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { full_name: user?.full_name ?? "" },
  });

  const onSubmit = async (data: UpdateProfileValues) => {
    setSuccess(false);
    await updateProfile.mutateAsync(data);
    setSuccess(true);
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-display text-foreground tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Update your display name.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        {updateProfile.isError && (
          <Alert variant="destructive" className="rounded-xl border-none text-xs py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <AlertDescription className="text-xs">{getApiError(updateProfile.error)}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="rounded-xl border-success/30 bg-success/10 text-xs py-3">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
            <AlertDescription className="text-xs text-success">Profile updated.</AlertDescription>
          </Alert>
        )}
        <div>
          <label className="text-xs font-display opacity-40 tracking-wider uppercase">Full name</label>
          <Input
            {...register("full_name")}
            className="mt-1 bg-background/40 border-border/60 rounded-xl"
          />
          {errors.full_name && (
            <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-display opacity-40 tracking-wider uppercase">Email</label>
          <Input
            value={user?.email ?? ""}
            disabled
            className="mt-1 bg-background/20 border-border/30 rounded-xl opacity-60"
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="font-display tracking-wide">
          {isSubmitting ? (
            <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Password section
// ---------------------------------------------------------------------------

function PasswordSection() {
  const { changePassword } = useAccount();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    await changePassword.mutateAsync({
      current_password: data.current_password,
      new_password: data.new_password,
    });
    reset();
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-display text-foreground tracking-tight">Password</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Changing your password will log you out of all sessions.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        {changePassword.isError && (
          <Alert variant="destructive" className="rounded-xl border-none text-xs py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <AlertDescription className="text-xs">{getApiError(changePassword.error)}</AlertDescription>
          </Alert>
        )}
        <div>
          <label className="text-xs font-display opacity-40 tracking-wider uppercase">Current password</label>
          <div className="relative mt-1">
            <Input
              {...register("current_password")}
              type={showCurrent ? "text" : "password"}
              className="bg-background/40 border-border/60 rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.current_password && (
            <p className="text-xs text-destructive mt-1">{errors.current_password.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-display opacity-40 tracking-wider uppercase">New password</label>
          <div className="relative mt-1">
            <Input
              {...register("new_password")}
              type={showNew ? "text" : "password"}
              className="bg-background/40 border-border/60 rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.new_password && (
            <p className="text-xs text-destructive mt-1">{errors.new_password.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-display opacity-40 tracking-wider uppercase">Confirm new password</label>
          <div className="relative mt-1">
            <Input
              {...register("confirm_password")}
              type={showNew ? "text" : "password"}
              className="bg-background/40 border-border/60 rounded-xl"
            />
          </div>
          {errors.confirm_password && (
            <p className="text-xs text-destructive mt-1">{errors.confirm_password.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="font-display tracking-wide">
          {isSubmitting ? (
            <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
          ) : (
            "Change password"
          )}
        </Button>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Danger zone section
// ---------------------------------------------------------------------------

function DangerZoneSection() {
  const { deleteAccount } = useAccount();
  const { data: user } = useCurrentUser();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = async (data: DeleteAccountValues) => {
    await deleteAccount.mutateAsync({ password: data.password });
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-display text-foreground tracking-tight text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
      </div>
      <Button
        variant="outline"
        className="border-destructive/40 text-destructive hover:bg-destructive/10 font-display tracking-wide gap-2"
        onClick={() => setShowModal(true)}
        disabled={user?.is_demo ?? false}
      >
        <Trash2 className="w-4 h-4" />
        Delete my account
      </Button>
      {user?.is_demo && (
        <p className="text-xs text-muted-foreground">Demo accounts cannot be deleted.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border/60 rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-display text-foreground tracking-tight">Delete account?</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently delete <span className="text-foreground font-medium">{user?.email}</span> and all your data. Enter your password to confirm.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {deleteAccount.isError && (
                <Alert variant="destructive" className="rounded-xl border-none text-xs py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <AlertDescription className="text-xs">{getApiError(deleteAccount.error)}</AlertDescription>
                </Alert>
              )}
              <div>
                <label className="text-xs font-display opacity-40 tracking-wider uppercase">Password</label>
                <Input
                  {...register("password")}
                  type="password"
                  className="mt-1 bg-background/40 border-border/60 rounded-xl"
                  autoFocus
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 font-display"
                  onClick={() => { setShowModal(false); reset(); deleteAccount.reset(); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1 font-display"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 rounded-full border-2 border-destructive-foreground/40 border-t-destructive-foreground animate-spin" />
                  ) : (
                    "Delete account"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <div className="container max-w-2xl py-8 px-4 space-y-10">
      <div>
        <h1 className="text-3xl font-display text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account preferences.</p>
      </div>

      <Separator className="border-white/10" />
      <ProfileSection />

      <Separator className="border-white/10" />
      <PasswordSection />

      <Separator className="border-white/10" />
      <DangerZoneSection />
    </div>
  );
}
