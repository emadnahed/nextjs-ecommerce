"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Package, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/container";

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  size: string | null;
  price: number;
  product: {
    id: string;
    title: string;
    imageIds: string[];
  };
};

type Order = {
  id: string;
  isPaid: boolean;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus?: 'PENDING' | 'DELIVERED' | 'CANCELLED' | 'ON-HOLD';
  customerName: string;
  phone: string;
  address: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
};

const MyOrdersPage = () => {
  const router = useRouter();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/orders");
      return data as Order[];
    },
  });

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-red-500">Failed to load orders. Please try again.</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "ON-HOLD":
        return "text-gray-600 bg-gray-50";
      case "CANCELLED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "cashfree":
        return "Online Payment";
      default:
        return method;
    }
  };

  return (
    <Container>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8" />
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
            <p className="text-gray-500 text-lg">No orders yet</p>
            <Button onClick={() => router.push("/shop")}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
              >
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Order placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order ID: <span className="font-mono">{order.id.slice(0, 8)}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">                    
                    <span>
                    <span className="text-black-500">Delivery Status: </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.orderStatus || 'PENDING'
                      )}`}
                    >
                      {(order.orderStatus || 'PENDING').toUpperCase()}
                    </span>
                    </span>
                    <span>
                    <span className="text-black-500">Payment Status: </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.isPaid || (order.paymentStatus || '').toUpperCase() === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.isPaid || (order.paymentStatus || '').toUpperCase() === 'PAID' ? 'PAID' : 'UNPAID'}
                    </span>
                    </span>
                    {/* paymentMethod */}
                    <span>
                    <span className="text-black-500">Payment Method: </span>
                    <span className="text-sm text-gray-600">                      
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center hover:bg-gray-50 p-2 rounded"
                    >
                      {item.product?.imageIds?.[0] && (
                        <img
                          src={item.product.imageIds[0]}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          <span className="font-medium">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-wrap justify-between items-center pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Delivery Address:</p>
                    <p className="text-sm font-medium">{order.address}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default MyOrdersPage;
