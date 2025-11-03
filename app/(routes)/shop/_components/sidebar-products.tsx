import { getAllProducts, getProductTypes, getGenders, getColors } from "@/lib/apiCalls";
import SidebarItems from "./sidebar-items";
import PriceInput from "./price-input";

const SidebarProducts = async () => {
  const data = await getAllProducts();
  const types = await getProductTypes();
  const genders = await getGenders();
  const colors = await getColors();

  return (
    <div className="w-1/6 max-sm:w-full p-4 flex flex-col gap-y-4">
      <SidebarItems types={types} genders={genders} colors={colors} />
      <PriceInput data={data} />
    </div>
  );
};

export default SidebarProducts;
