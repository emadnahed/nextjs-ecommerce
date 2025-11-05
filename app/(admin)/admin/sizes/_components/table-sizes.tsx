"use client";
import TitleHeader from "@/app/(admin)/_components/title-header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";

type Sizes = {
  id: string;
  name: string;
  category: string;
  createdAt: string;
};

const TableSizes = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/sizes");
      const sortedData = sortByDate(data);
      return sortedData as Sizes[];
    },
  });

  const offset = currentPage * productsPerPage;
  const currentProducts = data?.slice(offset, offset + productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete size "${name}"?\n\nThis will remove this size from all products that use it.`)) {
      return;
    }

    setDeleting(id);
    try {
      const response = await axios.delete(`/api/sizes/${id}`);
      toast.success(response.data.message || "Size deleted successfully");

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    } catch (error: any) {
      console.error("Error deleting size:", error);
      toast.error(error.response?.data?.error || "Failed to delete size");
    } finally {
      setDeleting(null);
    }
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
        title="Sizes"
        count={data?.length}
        description="Manage sizes for your store"
        url="/admin/sizes/new"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <p className="text-gray-700">Value</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Date</p>
              </TableCell>
              <TableCell align="right">
                <p className="text-gray-700">Actions</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="left">
                  {order.name}
                </TableCell>
                <TableCell align="center">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <button
                    onClick={() => handleDelete(order.id, order.name)}
                    disabled={deleting === order.id}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete size"
                  >
                    <DeleteIcon className="text-red-600 hover:text-red-800" />
                  </button>
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

export default TableSizes;
