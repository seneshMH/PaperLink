import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { useMessage } from "../../../../hooks/message/Message";

import BeenhereIcon from "@mui/icons-material/Beenhere";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import { GetPaidBids } from "../../../../apiCalls/bids";
import { RefundBidPayment, ReleaseBidPaymentFromHold } from "../../../../apiCalls/payment";

function BidPayments() {
  const [bids, setBids] = useState([]);
  const dispatch = useDispatch();
  const message = useMessage();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetPaidBids();

      if (response.success) {
        setBids(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const releasePayment = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await ReleaseBidPaymentFromHold(id);

      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const refund = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await RefundBidPayment(id);

      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const calDate = (date) => {
    const orderDate = moment(date);
    const futureDate = orderDate.clone().add(30, "days");
    const currentDate = moment();
    return futureDate.diff(currentDate, "days");
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Advertisement</TableCell>
              <TableCell align="right">Seller Name</TableCell>
              <TableCell align="right">Buyer Name</TableCell>
              <TableCell align="right">Bid Amount</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Added On</TableCell>
              <TableCell align="right">Remaining Days</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids?.map((bid) => (
              <TableRow
                key={bid._id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {bid.advertisement.title}
                </TableCell>
                <TableCell align="right">{bid.seller.name}</TableCell>
                <TableCell align="right">{bid.buyer.name}</TableCell>
                <TableCell align="right">{bid.bidAmount}</TableCell>
                <TableCell align="right" sx={bid.status === "pending" || bid.status === "refunded" ? { color: "red" } : { color: "green" }}>
                  {bid.status}
                </TableCell>
                <TableCell align="right">{moment(bid.createdAt).format("DD-MM-YYYY hh-mm A")}</TableCell>
                <TableCell align="right">
                  <Typography color={calDate(bid.createdAt) > 0 ? "green" : "red"}>{calDate(bid.createdAt)} Days</Typography>
                </TableCell>
                <TableCell align="right">
                  {/* deliver */}
                  <Button variant="outlined" startIcon={<BeenhereIcon />} fullWidth onClick={() => releasePayment(bid._id)} disabled={bid.status === "pending" || bid.status === "refunded"}>
                    Release Payment
                  </Button>
                  <Button variant="outlined" color="error" startIcon={<WebAssetOffIcon />} fullWidth disabled={bid.status === "refunded"} onClick={() => refund(bid._id)}>
                    Refund
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BidPayments;
