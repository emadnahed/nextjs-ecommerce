"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { type SizeProduct, type createData } from "./edit-product";
import Image from "next/image";
import axios from "axios";

type EditFormProps = {
  data: createData;
  onSubmit: (formData: FormData) => void;
};

type InitialType = {
  title: string;
  description: string;
  price: number;
  type: string;
  gender: string;
  colors: string[];
  material: string;
  files: File[];
  isFeatured: boolean;
  productSizes?: SizeProduct[];
  discount?: number;
  sku?: string;
};

const PRODUCT_TYPES = ["T-Shirt", "Hoodie", "Shirt", "Dashiki", "Blouse", "Long Sleeve", "Jacket"];
const GENDERS = ["Men", "Women", "Unisex"];
const COLORS = [
  "Black", "White", "Navy", "Gray", "Blue", "Red", "Green",
  "Pink", "Yellow", "Orange", "Purple", "Brown", "Beige",
  "Plaid", "Multicolor", "Lavender", "Mint", "Peach", "Other"
];

const EditForm = ({ data, onSubmit }: EditFormProps) => {
  const {
    title,
    description,
    imageURLs,
    type,
    gender,
    colors,
    material,
    price,
    featured,
    productSizes,
    discount,
    sku,
  } = data;

  const initialState = {
    title,
    description,
    price,
    type,
    gender,
    colors: colors || [],
    material: material || "Cotton",
    files: [],
    isFeatured: featured,
    productSizes: productSizes,
    discount,
    sku: sku || "",
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkbox, setCheckBox] = useState<boolean>(featured);
  const [previewImage, setPreviewImage] = useState<string[]>();
  const [dataForm, setDataForm] = useState<InitialType>(initialState);
  const [allSizes, setAllSizes] = useState([]);

  const handleCheckboxChange = () => {
    setCheckBox((prevCheck) => !prevCheck);
  };

  useEffect(() => {
    setCheckBox(featured);
  }, [featured]);

  useEffect(() => {
    setPreviewImage(imageURLs);
  }, [imageURLs]);

  useEffect(() => {
    setDataForm({
      title,
      description,
      price,
      type,
      gender,
      colors: colors || [],
      material: material || "Cotton",
      files: [],
      isFeatured: featured,
      productSizes,
      discount,
      sku: sku || "",
    });
  }, [
    featured,
    title,
    description,
    price,
    type,
    gender,
    colors,
    material,
    imageURLs,
    productSizes,
    discount,
    sku,
  ]);

  useEffect(() => {
    const fetchAllSizes = async () => {
      try {
        const response = await axios.get(`/api/sizes`);
        setAllSizes(response.data);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    };

    fetchAllSizes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files as FileList;
    setDataForm((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...Array.from(selectedFiles)],
    }));

    if (selectedFiles.length > 0) {
      const imagePreviews: string[] = Array.from(selectedFiles).map(
        (file) => URL.createObjectURL(file) as string
      );
      setPreviewImage(imagePreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("isFeatured", checkbox.toString());
    formData.append("productSizes", JSON.stringify(dataForm.productSizes));
    formData.append("colors", JSON.stringify(dataForm.colors));
    await onSubmit(formData);

    setIsLoading(false);
  };

  const handleSizeClick = (sizeId: string, sizeName: string) => {
    setDataForm((prevData: any) => {
      const updatedProductSizes: { sizeId: string; name: string }[] =
        prevData.productSizes || [];
      const newSize = { sizeId, name: sizeName };
      if (!updatedProductSizes.some((size) => size.sizeId === newSize.sizeId)) {
        updatedProductSizes.push(newSize);
      }

      return { ...prevData, productSizes: updatedProductSizes };
    });
  };

  const handleColorClick = (color: string) => {
    setDataForm((prevData) => {
      const currentColors = prevData.colors || [];
      if (!currentColors.includes(color)) {
        return {
          ...prevData,
          colors: [...currentColors, color],
        };
      } else {
        return {
          ...prevData,
          colors: currentColors.filter((c) => c !== color),
        };
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-2 max-md:min-w-[90%] min-w-[70%] border p-4"
    >
      <label htmlFor="name">Enter Product Name</label>
      <Input
        value={dataForm.title}
        type="text"
        id="name"
        name="name"
        required
        placeholder="Enter Product name"
        onChange={(e) => setDataForm({ ...dataForm, title: e.target.value })}
      />

      <label htmlFor="price">Enter Product Price</label>
      <Input
        value={dataForm.price}
        type="number"
        id="price"
        min={1}
        name="price"
        required
        placeholder="Enter Product price"
        onChange={(e) => setDataForm({ ...dataForm, price: +e.target.value })}
      />

      <label htmlFor="discount">Enter Product Discount (%)</label>
      <Input
        value={dataForm.discount || ""}
        type="number"
        id="discount"
        min={5}
        max={70}
        name="discount"
        placeholder="Enter Product discount (optional)"
        onChange={(e) =>
          setDataForm({ ...dataForm, discount: +e.target.value })
        }
      />

      <label htmlFor="description">Enter Product Description</label>
      <Input
        value={dataForm.description}
        type="text"
        id="description"
        name="description"
        required
        placeholder="Enter Product description"
        onChange={(e) =>
          setDataForm({ ...dataForm, description: e.target.value })
        }
      />

      <label htmlFor="type">Product Type</label>
      <select
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        name="type"
        id="type"
        required
        value={dataForm.type}
        onChange={(e) => setDataForm({ ...dataForm, type: e.target.value })}
      >
        <option value="">Select product type</option>
        {PRODUCT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label htmlFor="gender">Gender</label>
      <select
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        name="gender"
        id="gender"
        required
        value={dataForm.gender}
        onChange={(e) =>
          setDataForm({ ...dataForm, gender: e.target.value })
        }
      >
        <option value="">Select gender</option>
        {GENDERS.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>

      <label htmlFor="colors">Colors (Select multiple)</label>
      <div className="flex flex-wrap gap-2 border rounded-md p-3">
        {COLORS.map((color) => (
          <Button
            key={color}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleColorClick(color)}
            className={
              dataForm.colors?.includes(color)
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                : ""
            }
          >
            {color}
          </Button>
        ))}
      </div>
      {dataForm.colors && dataForm.colors.length > 0 && (
        <p className="text-sm text-gray-600">
          Selected: {dataForm.colors.join(", ")}
        </p>
      )}

      <label htmlFor="material">Material</label>
      <Input
        value={dataForm.material}
        type="text"
        id="material"
        name="material"
        placeholder="e.g., Cotton, Cotton Blend, Linen"
        onChange={(e) =>
          setDataForm({ ...dataForm, material: e.target.value })
        }
      />

      <label htmlFor="sku">SKU (Stock Keeping Unit) - Optional</label>
      <Input
        value={dataForm.sku}
        type="text"
        id="sku"
        name="sku"
        placeholder="e.g., TSH-BLK-001"
        onChange={(e) =>
          setDataForm({ ...dataForm, sku: e.target.value })
        }
      />

      {allSizes.length > 0 && (
        <label htmlFor="size" className="pb-2">
          Select sizes for this product
        </label>
      )}
      <ul className="flex items-center gap-4 flex-wrap">
        {allSizes.map((size: any) => {
          return (
            <Button
              type="button"
              key={size.id}
              onClick={() => handleSizeClick(size.id, size.name)}
              className={
                dataForm.productSizes?.some(
                  (productSize: any) => productSize.sizeId === size.id
                )
                  ? "bg-green-500 text-white"
                  : ""
              }
            >
              {size.name}
            </Button>
          );
        })}
      </ul>

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <div>
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={checkbox}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="space-y-1 leading-none">
          <p className="font-semibold">Featured</p>
          <div>This product will appear on the home page</div>
        </div>
      </div>

      <label htmlFor="image">Change Product Images</label>
      <Input
        type="file"
        id="image"
        name="image"
        onChange={handleFileChange}
        multiple
        accept="image/*"
      />
      <div className="flex gap-2 flex-wrap">
        {previewImage?.map((preview, index) => {
          // Check if it's a local uploaded image (starts with /uploads/)
          const isLocalImage = preview.startsWith('/uploads/');
          const imagePath = isLocalImage ? preview : preview;

          return (
            <Image
              key={index}
              src={imagePath}
              alt={`Preview ${index}`}
              width={100}
              height={100}
              className="rounded-sm object-cover"
              priority={true}
            />
          );
        })}
      </div>

      <Button disabled={isLoading} type="submit" className="mt-2 bg-green-600">
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default EditForm;
