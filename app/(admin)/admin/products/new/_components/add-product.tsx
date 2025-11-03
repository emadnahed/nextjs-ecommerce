"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RequestData, SelectedSize } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type initialState = {
  title: string;
  description: string;
  price: string;
  type: string;
  gender: string;
  colors: string[];
  material: string;
  files: File[];
  isFeatured: boolean;
  sizes: SelectedSize[];
  discount?: string;
  sku?: string;
};

const PRODUCT_TYPES = ["T-Shirt", "Hoodie", "Shirt", "Dashiki", "Blouse", "Long Sleeve", "Jacket"];
const GENDERS = ["Men", "Women", "Unisex"];
const COLORS = [
  "Black", "White", "Navy", "Gray", "Blue", "Red", "Green",
  "Pink", "Yellow", "Orange", "Purple", "Brown", "Beige",
  "Plaid", "Multicolor", "Lavender", "Mint", "Peach", "Other"
];

const AddProduct = () => {
  const router = useRouter();
  const [selectedSizes, setSelectedSizes] = useState<SelectedSize[]>([]);

  const initialState = {
    title: "",
    description: "",
    price: "",
    type: "",
    gender: "",
    colors: [],
    material: "Cotton",
    files: [],
    isFeatured: false,
    sizes: selectedSizes,
    discount: "",
    sku: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [dataForm, setDataForm] = useState<initialState>(initialState);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [availableSizes, setAvailableSizes] = useState([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
    files: "",
    type: "",
    gender: "",
    colors: "",
  });

  useEffect(() => {
    const fetchAllSizes = async () => {
      try {
        const response = await axios.get(`/api/sizes`);
        setAvailableSizes(response.data);
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
      setImagePreviews((prev) => [...prev, ...imagePreviews]);
    }
  };

  const handleCheckboxChange = (isChecked: boolean) => {
    setDataForm((prevData) => ({ ...prevData, isFeatured: isChecked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({
      title: "",
      description: "",
      price: "",
      files: "",
      type: "",
      gender: "",
      colors: "",
    });

    if (
      !dataForm.title ||
      dataForm.title.length < 4 ||
      !dataForm.description ||
      dataForm.description.length < 4 ||
      !dataForm.price ||
      dataForm.files.length === 0 ||
      !dataForm.type ||
      !dataForm.gender ||
      dataForm.colors.length === 0
    ) {
      setIsLoading(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        title:
          dataForm.title.length < 4
            ? "Title must be at least 4 characters"
            : "",
        description:
          dataForm.description.length < 4
            ? "Description must be at least 4 characters"
            : "",
        price: !dataForm.price ? "Please enter a price" : "",
        files:
          dataForm.files.length === 0 ? "Please select at least one file" : "",
        type: !dataForm.type ? "Please select a product type" : "",
        gender: !dataForm.gender ? "Please select a gender" : "",
        colors: dataForm.colors.length === 0 ? "Please select at least one color" : "",
      }));

      return;
    }

    const convPrice = +dataForm.price;

    const requestData: RequestData = {
      title: dataForm.title,
      description: dataForm.description,
      price: convPrice,
      files: dataForm.files,
      featured: dataForm.isFeatured,
      type: dataForm.type,
      gender: dataForm.gender,
      colors: dataForm.colors,
      material: dataForm.material || "Cotton",
      sizes: selectedSizes,
      sku: dataForm.sku || undefined,
    };

    if (dataForm.discount !== undefined && dataForm.discount !== "") {
      requestData.discount = +dataForm.discount;
    }

    const formData = new FormData();

    Array.from(dataForm.files).forEach((file) => {
      formData.append("files", file);
    });

    formData.append("requestData", JSON.stringify(requestData));

    try {
      const res = await axios.post("/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product created successfully");

      router.push("/admin/products");
      setIsLoading(false);
      setImagePreviews([]);
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleSizeClick = (sizeId: string, sizeName: string) => {
    if (!selectedSizes.some((size) => size.id === sizeId)) {
      setSelectedSizes((prevSelected) => [
        ...prevSelected,
        { id: sizeId, name: sizeName },
      ]);
    } else {
      setSelectedSizes((prevSelected) =>
        prevSelected.filter((size) => size.id !== sizeId)
      );
    }
  };

  const handleColorClick = (color: string) => {
    if (!dataForm.colors.includes(color)) {
      setDataForm((prevData) => ({
        ...prevData,
        colors: [...prevData.colors, color],
      }));
    } else {
      setDataForm((prevData) => ({
        ...prevData,
        colors: prevData.colors.filter((c) => c !== color),
      }));
    }
  };

  return (
    <div className="flex justify-center items-center max-md:justify-start">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-2 max-md:min-w-[90%] min-w-[70%] border p-4 "
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
        {errors.title && <p className="text-red-500">{errors.title}</p>}

        <label htmlFor="price">Enter Product Price</label>
        <Input
          value={dataForm.price}
          type="number"
          id="price"
          min={1}
          name="price"
          required
          placeholder="Enter Product price"
          onChange={(e) => setDataForm({ ...dataForm, price: e.target.value })}
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}

        <label htmlFor="discount">Enter Product Discount (%)</label>
        <Input
          value={dataForm.discount}
          type="number"
          id="discount"
          min={5}
          max={70}
          name="discount"
          placeholder="Enter Product discount (optional)"
          onChange={(e) =>
            setDataForm({ ...dataForm, discount: e.target.value })
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
        {errors.description && (
          <p className="text-red-500">{errors.description}</p>
        )}

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
        {errors.type && <p className="text-red-500">{errors.type}</p>}

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
        {errors.gender && <p className="text-red-500">{errors.gender}</p>}

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
                dataForm.colors.includes(color)
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                  : ""
              }
            >
              {color}
            </Button>
          ))}
        </div>
        {dataForm.colors.length > 0 && (
          <p className="text-sm text-gray-600">
            Selected: {dataForm.colors.join(", ")}
          </p>
        )}
        {errors.colors && <p className="text-red-500">{errors.colors}</p>}

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

        <div className="my-2 gap-2 flex flex-wrap flex-col">
          {availableSizes.length > 0 && (
            <label htmlFor="size" className="pb-2">
              Select sizes for this product
            </label>
          )}
          <ul className="flex items-center gap-4 flex-wrap">
            {availableSizes.map((size: any) => (
              <Button
                type="button"
                onClick={() => handleSizeClick(size.id, size.name)}
                className={
                  selectedSizes.some(
                    (selectedSize) => selectedSize.id === size.id
                  )
                    ? "bg-green-600"
                    : ""
                }
                key={size.id}
              >
                {size.name}
              </Button>
            ))}
          </ul>
        </div>

        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <div>
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={dataForm.isFeatured}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            />
          </div>
          <div className="space-y-1 leading-none">
            <p className="font-semibold">Featured</p>
            <div>This product will appear on the home page</div>
          </div>
        </div>

        <label htmlFor="image">Add Product Images</label>
        <Input
          type="file"
          id="image"
          name="image"
          required
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
        {errors.files && <p className="text-red-500">{errors.files}</p>}
        <div className="flex gap-2 flex-wrap">
          {imagePreviews.map((preview, index) => (
            <Image
              key={index}
              src={preview}
              alt={`Preview ${index}`}
              width={100}
              height={100}
              className="rounded-sm object-cover"
            />
          ))}
        </div>

        <Button disabled={isLoading} className="mt-2 bg-green-600">
          {isLoading ? "Creating..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
