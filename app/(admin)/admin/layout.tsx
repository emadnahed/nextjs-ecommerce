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

  // Check if user is authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is in admin whitelist
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (!userEmail || !isAdminByEmail(userEmail)) {
    redirect("/access-denied");
  }

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
