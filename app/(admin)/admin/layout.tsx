import Navbar from "../_components/Navbar";
import Sidebar from "../_components/Sidebar";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { isAdminByEmail } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin | E-Commerce Store",
  description: `Admin panel for e-commerce store management`,
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  console.log('[Admin Layout] Checking access:', {
    userId: user?.id,
    hasUser: !!user,
  });

  // Check if user is authenticated
  if (!user) {
    console.log('[Admin Layout] No user found, redirecting to sign-in');
    redirect("/sign-in");
  }

  // Check if user is in admin whitelist
  const userEmail = user.emailAddresses[0]?.emailAddress;
  const isAdmin = isAdminByEmail(userEmail || '');

  console.log('[Admin Layout] User authentication check:', {
    userId: user.id,
    userEmail,
    isAdmin,
    adminEmails: process.env.ADMIN_EMAILS,
  });

  if (!userEmail || !isAdmin) {
    console.log('[Admin Layout] User not authorized, redirecting to access-denied');
    redirect("/access-denied");
  }

  console.log('[Admin Layout] Access granted for admin user:', userEmail);

  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-14 flex h-full gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
