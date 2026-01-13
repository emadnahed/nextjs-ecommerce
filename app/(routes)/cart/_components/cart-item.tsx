import Image from "next/image";

import useCart, { type CartItem } from "@/hooks/use-cart";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils/currency";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface CartItemProps {
  data: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemoveAll = () => {
    cart.removeAll(data);
  };

  const onRemove = () => {
    cart.removeItem(data);
  };

  const onAdd = () => {
    cart.addItem(data);
  };

  // Format price from integer to INR
  const formatLocalPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.image || "/placeholder.png"}
          alt={data.title}
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <button
            onClick={onRemoveAll}
            className="rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{data.title}</p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.category}</p>
          </div>
          <div className="flex flex-col mt-2 gap-y-3 max-md:flex-row max-md:justify-between max-md:items-center">
            <p className="text-lg text-gray-900 font-semibold">
              {data.totalPrice
                ? formatLocalPrice(data.totalPrice)
                : formatLocalPrice(data.price)}
            </p>
            <div className="flex max-md:justify-end w-full">
              <div className="border border-gray-300 w-32 rounded-full p-1 gap-2 flex justify-between items-center bg-gray-50">
                <button onClick={onRemove} className="p-1 rounded-full hover:bg-white hover:shadow-sm text-primary transition">
                  <RemoveIcon fontSize="small" />
                </button>
                <p className="font-semibold text-gray-900">{data.quantity}</p>
                <button onClick={onAdd} className="p-1 rounded-full hover:bg-white hover:shadow-sm text-primary transition">
                  <AddIcon fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
