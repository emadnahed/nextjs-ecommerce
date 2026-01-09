import { getAllProductsFromDB, getProductCategoriesFromDB, getTopLevelCategoriesFromDB } from "@/lib/serverDataAccess";
import SidebarItems from "./sidebar-items";
import PriceInput from "./price-input";

const SidebarProducts = async () => {
  const data = await getAllProductsFromDB();
  const categories = await getProductCategoriesFromDB();
  const topLevelCategories = await getTopLevelCategoriesFromDB();

  return (
    <div className="w-1/6 max-sm:w-full p-4 flex flex-col gap-y-4">
      <SidebarItems categories={categories} topLevelCategories={topLevelCategories} />
      <PriceInput data={data} />
    </div>
  );
};

export default SidebarProducts;
