import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../style/style";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState([]);
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "product Id", minWidth: 150, flex: 0.7 },
    { field: "shopId", headerName: "Shop ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "request given at",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <>
            <BsPencil
              size={20}
              className={`${
                params.row.status === "Processing" ? "block" : "hidden"
              } mr-5 cursor-pointer`}
              onClick={() => setOpen(true) || setWithdrawData(params.row)}
            />
          </>
        );
      },
    },
  ];
  const row = [];
  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "US$" + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });
  console.log(withdrawData.shopId);

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id} `,
        {
          sellerID: withdrawData.shopId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("withdraw updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={20} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              update Withdraw status
            </h1>
            <br />
            <select
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="border rounded w-[200px] h-[35px]"
            >
              <option value={withdrawData.status}>{withdrawData.status}</option>
              <option value={withdrawData.status}>Succeed</option>
            </select>
            <button
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
