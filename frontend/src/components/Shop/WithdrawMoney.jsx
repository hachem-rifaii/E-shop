import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import styles from "../../style/style";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { loadShop } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(false);
  const { seller } = useSelector((state) => state.seller);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankAccountNumber: null,
    bankSwiftCode: null,
    bankHolderName: "",
    bankAddress: "",
  });
  //
  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > seller?.availableBalance ) {
      toast.error(
        "Withdraw amount should be greater than 50 and less than available balance"
      );
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw amount request created successfully");
        })
        .catch((err) => {
          toast.error("Failed to create withdraw amount request");
        });
    }
  };

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };
    await axios
      .put(
        `${server}/shop/update-withdraw-methods`,
        { withdrawMethod },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("withdraw method updated");
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankAccountNumber: null,
          bankSwiftCode: null,
          bankHolderName: "",
          bankAddress: "",
        });
        setPaymentMethods(false);
        dispatch(loadShop());
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-methods`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("withdraw method deleted");
        setPaymentMethods(false);
        dispatch(loadShop());
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  const error = () => {
    toast.error("Insufficient balance to withdraw");
  };
  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="text-[20px] pb-4">
          Available balance ${seller?.availableBalance}
        </h5>
        <div
          className={`${styles.button} text-[#fff] !h-[42px] !rounded-[4px]`}
          onClick={() =>
            seller?.availableBalance === 0 && NaN ? error() : setOpen(true)
          }
        >
          Withdraw
        </div>
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex justify-center items-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white shadow ${
              paymentMethods ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } rounded min-h-[40vh] p-3`}
          >
            <div className="w-full flex justify-end ">
              <RxCross1
                size={20}
                onClick={() => setOpen(false) || setPaymentMethods(false)}
                className="cursor-pointer"
              />
            </div>
            {paymentMethods ? (
              <div>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Add new Payment Method
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="pt-2">
                    <label>
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      required
                      placeholder="Enter your bank Name!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-2">
                    <label>
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter Your Bank Country!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-2">
                    <label>
                      Bank Swift code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank swift code!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-2">
                    <label>
                      Bank Account Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter Your bank account number!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-2">
                    <label>
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter Your Bank Holder Number!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-2">
                    <label>
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter Your Bank Address!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`${styles.button} mb-3 text-white`}
                  >
                    Submit
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h3 className="text-[22px] font-Poppins">
                  Availble withdraw methods:
                </h3>
                {seller && seller?.withdrawMethod ? (
                  <div>
                    <div className="800px:flex w-full justify-between items-center">
                      <div
                        className="800px:w-[50%]
                     "
                      >
                        <h5>
                          Account Number :{" "}
                          {"*".repeat(
                            seller.withdrawMethod.bankAccountNumber.length - 3
                          ) + seller.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name : {seller.withdrawMethod.bankName}</h5>
                      </div>
                      <div className="800px:w-[50%]">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={() => deleteHandler()}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>Availble Balance : {seller?.availableBalance}$</h4>
                    <br />
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="800px:w-[100px] w-full border 800px:mr-3 p-1 rounded"
                      />
                      <div
                        className={`${styles.button} !h-[42px] text-white`}
                        onClick={withdrawHandler}
                      >
                        Withdraw
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <p>No withdraw methods found.</p>
                    <div className="w-full flex items-center">
                      <div
                        className={`${styles.button} text-[#fff] text-[18px] mt-4`}
                        onClick={() => setPaymentMethods(true)}
                      >
                        Add new
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
