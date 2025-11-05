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
};

type Order = {
  id: string;
  isPaid: boolean;
  phone: string;
  address: string;
  createdAt: string;
  orderStatus: 'PENDING' | 'DELIVERED' | 'CANCELLED' | 'ON-HOLD';
  orderItems: OrderItem[];
};

const TableOrders = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
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

  const handleStatusChange = (orderId: string, event: SelectChangeEvent) => {
    const newStatus = event.target.value as 'PENDING' | 'DELIVERED' | 'CANCELLED' | 'ON-HOLD';
    updateOrderStatus.mutate({ orderId, status: newStatus });
  };

  const { error, data, isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders");
      const sortedData = sortByDate(data);
      return sortedData;
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
                <p className="text-gray-700">Status</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Paid</p>
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
                  {order.orderItems[0].productName || ""}
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
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    <MenuItem value="ON-HOLD">On Hold</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </TableCell>
                <TableCell align="center">
                  {formatDate(order.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
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
