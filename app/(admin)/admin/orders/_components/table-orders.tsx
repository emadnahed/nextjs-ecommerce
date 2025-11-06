"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { toast } from "react-hot-toast";
import TitleHeader from "@/app/(admin)/_components/title-header";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";

type OrderItem = {
  id: string;
  orderId: string;
  productName: string;
  product?: {
    id: string;
    name: string;
    imageUrl?: string;
    imageIds?: string[];
    images?: Array<{ url: string }> | string;
  };
};

type Order = {
  id: string;
  isPaid: boolean;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'UNPAID';
  orderStatus: 'PENDING' | 'DELIVERED' | 'CANCELLED' | 'ON-HOLD';
  customerName: string;
  phone: string;
  address: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
};

const TableOrders = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { 
      orderId: string; 
      status: 'PENDING' | 'DELIVERED' | 'CANCELLED' | 'ON-HOLD' 
    }) => {
      const { data } = await axios.patch(`/api/orders/${orderId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update order status");
    },
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({
      orderId,
      paymentStatus
    }: {
      orderId: string;
      paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
    }) => {
      const { data } = await axios.patch(`/api/orders/${orderId}/payment`, { 
        paymentStatus: paymentStatus // This will be mapped in the API
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Payment status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update payment status");
    },
  });

  const handleStatusChange = (orderId: string, event: SelectChangeEvent) => {
    const newStatus = event.target.value as 'PENDING' | 'DELIVERED' | 'CANCELLED' | 'ON-HOLD';
    updateOrderStatus.mutate({ orderId, status: newStatus });
  };

  const handlePaymentStatusChange = (orderId: string, event: SelectChangeEvent) => {
    const newPaymentStatus = event.target.value as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    updatePaymentStatus.mutate({ orderId, paymentStatus: newPaymentStatus });
  };

  const { error, data, isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/orders");
        console.log("Orders data:", data); // Debug log
        return sortByDate(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        return [];
      }
    },
  });

  const offset = currentPage * productsPerPage;
  const currentProducts = data?.slice(offset, offset + productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Something went wrong!</p>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'ON-HOLD':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    // Normalize status to uppercase for comparison
    const normalizedStatus = status.toUpperCase();
    
    if (normalizedStatus === 'PAID' || normalizedStatus === 'SUCCESS') {
      return 'bg-green-100 text-green-800';
    }
    // All other statuses are considered UNPAID
    return 'bg-yellow-100 text-yellow-800';
  };
  
  // Helper to format status for display
  const formatPaymentStatus = (status: string): string => {
    const normalizedStatus = status.toUpperCase();
    return (normalizedStatus === 'PAID' || normalizedStatus === 'SUCCESS') ? 'PAID' : 'UNPAID';
  };

  const getProductImage = (orderItem: OrderItem) => {
    // Helper to get the first valid image URL
    const getFirstValidImage = (): string | null => {
      // Try imageIds first
      if (Array.isArray(orderItem?.product?.imageIds) && orderItem.product.imageIds.length > 0) {
        return orderItem.product.imageIds[0];
      }
      
      // Then try imageUrl
      if (orderItem?.product?.imageUrl) {
        return orderItem.product.imageUrl;
      }
      
      // Then try images array
      if (Array.isArray(orderItem?.product?.images) && orderItem.product.images.length > 0) {
        const firstImage = orderItem.product.images[0];
        if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
          return firstImage.url;
        } else if (typeof firstImage === 'string') {
          return firstImage;
        }
      }
      
      // Finally try if images is a string
      if (typeof orderItem?.product?.images === 'string') {
        return orderItem.product.images;
      }
      
      return null;
    };

    const imageUrl = getFirstValidImage();

    if (imageUrl) {
      return (
        <img 
          src={imageUrl}
          alt={orderItem.productName || 'Product'} 
          className="w-10 h-10 object-cover rounded"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
      );
    }

    return (
      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
        <span className="text-xs text-gray-500">No Image</span>
      </div>
    );
  };

  return (
    <>
      <TitleHeader
        title="Orders"
        count={data?.length}
        description="Manage orders for your store"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <p className="text-gray-700">Products</p>
              </TableCell>
              <TableCell>
                <p className="text-gray-700">Phone</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Address</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Delivery Status</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Payment Status</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Date</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <div className="flex items-center space-x-2">
                    {getProductImage(order.orderItems[0])}
                    <span className="line-clamp-1">
                      {order.orderItems[0]?.productName || 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell align="left">{order.phone}</TableCell>
                <TableCell align="center">{order.address}</TableCell>
                <TableCell align="center">
                  <Select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e)}
                    size="small"
                    sx={{
                      minWidth: 120,
                      height: 32,
                      '& .MuiSelect-select': {
                        padding: '6px 32px 6px 12px',
                        fontSize: '0.875rem',
                      },
                    }}
                    disabled={updateOrderStatus.isPending}
                  >
                    <MenuItem value="PENDING">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('PENDING')}`}>
                        Pending
                      </span>
                    </MenuItem>
                    <MenuItem value="DELIVERED">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('DELIVERED')}`}>
                        Delivered
                      </span>
                    </MenuItem>
                    <MenuItem value="CANCELLED">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('CANCELLED')}`}>
                        Cancelled
                      </span>
                    </MenuItem>
                    <MenuItem value="ON-HOLD">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('ON-HOLD')}`}>
                        On Hold
                      </span>
                    </MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <Select
                    value={formatPaymentStatus(order.paymentStatus || (order.isPaid ? 'PAID' : 'UNPAID'))}
                    onChange={(e) => handlePaymentStatusChange(order.id, e)}
                    size="small"
                    sx={{
                      minWidth: 120,
                      height: 32,
                      '& .MuiSelect-select': {
                        padding: '6px 32px 6px 12px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                    disabled={updatePaymentStatus.isPending}
                    renderValue={(value) => (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(value as string)}`}>
                        {value as string}
                      </span>
                    )}
                  >
                    {['PAID', 'UNPAID'].map((status) => (
                      <MenuItem key={status} value={status}>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(status)}`}>
                          {status}
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="center">
                  {formatDate(order.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && data.length > 0 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(data?.length / productsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex space-x-2 justify-end mt-4"}
          previousLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          nextLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-700"}
          pageClassName="hidden"
        />
      )}
    </>
  );
};

export default TableOrders;
