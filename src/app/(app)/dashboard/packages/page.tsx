'use client';
import { PackageList } from "@/components/dashboard/packages/PackageList";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PackageForm } from "@/components/dashboard/packages/PackageForm";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { toast } from "sonner";


export default function PackagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading && user && !user.is_admin) {
      toast.error("Unauthorized: Admins only");
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <div className="text-primary-700">Loading...</div>;
  if (!user || !user.is_admin) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary-700">Packages</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <Plus className="size-4" /> New package
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="max-w-md w-full overflow-y-auto max-h-screen">
            <SheetHeader>
              <SheetTitle>Add Package</SheetTitle>
            </SheetHeader>
            <PackageForm />
          </SheetContent>
        </Sheet>
      </div>
      <PackageList />
    </div>
  );
}
