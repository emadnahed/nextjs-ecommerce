"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

type SidebarItemsProps = {
  categories: string[];
  topLevelCategories: string[];
};

const SidebarItems = ({ categories, topLevelCategories }: SidebarItemsProps) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("category");
  const currentTopLevel = searchParams.get("topLevelCategory");

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    return params.toString();
  };

  const handleFilterClick = (filterType: string, value: string | null) => {
    const queryString = createQueryString(filterType, value);
    router.push(`${pathName}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="space-y-4">
      {/* Top Level Category Filter */}
      <div>
        <p className="font-semibold mb-2">Department</p>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          <button
            onClick={() => handleFilterClick('topLevelCategory', null)}
            className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
              !currentTopLevel ? "underline font-medium" : ""
            }`}
          >
            All
          </button>
          {topLevelCategories.slice(0, 15).map((topLevel) => (
            <button
              key={topLevel}
              onClick={() => handleFilterClick('topLevelCategory', topLevel)}
              className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
                currentTopLevel === topLevel ? "underline font-medium" : ""
              }`}
            >
              {topLevel}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <p className="font-semibold mb-2">Category</p>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          <button
            onClick={() => handleFilterClick('category', null)}
            className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
              !currentCategory ? "underline font-medium" : ""
            }`}
          >
            All
          </button>
          {categories.slice(0, 20).map((category) => (
            <button
              key={category}
              onClick={() => handleFilterClick('category', category)}
              className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
                currentCategory === category ? "underline font-medium" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarItems;
