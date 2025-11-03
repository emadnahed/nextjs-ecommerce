"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

type SidebarItemsProps = {
  types: string[];
  genders: string[];
  colors: string[];
};

const SidebarItems = ({ types, genders, colors }: SidebarItemsProps) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentType = searchParams.get("type");
  const currentGender = searchParams.get("gender");
  const currentColor = searchParams.get("color");

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
      {/* Product Type Filter */}
      <div>
        <p className="font-semibold mb-2">Product Type</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleFilterClick('type', null)}
            className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
              !currentType ? "underline font-medium" : ""
            }`}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => handleFilterClick('type', type)}
              className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
                currentType === type ? "underline font-medium" : ""
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <p className="font-semibold mb-2">Gender</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleFilterClick('gender', null)}
            className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
              !currentGender ? "underline font-medium" : ""
            }`}
          >
            All
          </button>
          {genders.map((gender) => (
            <button
              key={gender}
              onClick={() => handleFilterClick('gender', gender)}
              className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
                currentGender === gender ? "underline font-medium" : ""
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <p className="font-semibold mb-2">Color</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleFilterClick('color', null)}
            className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
              !currentColor ? "underline font-medium" : ""
            }`}
          >
            All
          </button>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleFilterClick('color', color)}
              className={`text-left hover:underline underline-offset-4 tracking-wide text-sm ${
                currentColor === color ? "underline font-medium" : ""
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarItems;
