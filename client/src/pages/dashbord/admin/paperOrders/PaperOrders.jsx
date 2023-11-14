import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    List,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { GetOrders } from "../../../../apiCalls/product.order";
import { useMessage } from "../../../../hooks/message/Message";

import BeenhereIcon from "@mui/icons-material/Beenhere";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import {
    RefundPaperOrderPayment,
    ReleasePaymentFromHold,
    getPaymentDetailsByUserId,
} from "../../../../apiCalls/payment";
import { async } from "q";

function PaperOrders() {
    const [orders, setOrders] = useState([]);
    const [bankDetails, setBankDetails] = useState({});
    const dispatch = useDispatch();
    const message = useMessage();

    const calDate = (date) => {
        const orderDate = moment(date);
        const futureDate = orderDate.clone().add(30, "days");
        const currentDate = moment();
        return futureDate.diff(currentDate, "days");
    };

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetOrders();

            if (response.success) {
                setOrders(response.data);
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
            const response = await ReleasePaymentFromHold(id);

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
            const response = await RefundPaperOrderPayment(id);

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

    const getBankDetails = async (id) => {
        try {
            dispatch(SetLoader(true));
            const response = await getPaymentDetailsByUserId(id);

            if (response.success) {
                setBankDetails(response.data.bank);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell align="right">Product Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Added On</TableCell>
                            <TableCell align="right">Remaining Days</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders?.map((order) => (
                            <>
                                <TableRow
                                    key={order._id}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {order._id}
                                    </TableCell>
                                    <TableCell align="right">{order.product.name}</TableCell>
                                    <TableCell align="right">{order.quantity}</TableCell>
                                    <TableCell align="right">{order.price}</TableCell>
                                    <TableCell
                                        align="right"
                                        sx={
                                            order.status === "pending" ||
                                            order.status === "refunded"
                                                ? { color: "red" }
                                                : { color: "green" }
                                        }
                                    >
                                        {order.status.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {moment(order.createdAt).format("DD-MM-YYYY hh-mm A")}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography
                                            color={calDate(order.createdAt) > 0 ? "green" : "red"}
                                        >
                                            {calDate(order.createdAt)} Days
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* deliver */}
                                        <Button
                                            variant="outlined"
                                            startIcon={<BeenhereIcon />}
                                            fullWidth
                                            onClick={() => releasePayment(order._id)}
                                            disabled={
                                                order.status === "pending" ||
                                                order.status === "completed" ||
                                                order.status === "refunded"
                                            }
                                        >
                                            Release Payment
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<WebAssetOffIcon />}
                                            fullWidth
                                            onClick={() => refund(order._id)}
                                            disabled={
                                                order.status === "completed" ||
                                                order.status === "refunded"
                                            }
                                        >
                                            Refund
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell>
                                        <Accordion>
                                            {getBankDetails(order.product.seller._id)}
                                            <AccordionSummary
                                                expandIcon={<ExpandCircleDownIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="h6">Buyer Details</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <List>
                                                    <ListItemText>
                                                        {" "}
                                                        Name : {bankDetails.bank_name}
                                                    </ListItemText>
                                                    <ListItemText>
                                                        {" "}
                                                        Address : {bankDetails.branch_name}
                                                    </ListItemText>
                                                    <ListItemText>
                                                        {" "}
                                                        E-mail : {bankDetails.account_number}
                                                    </ListItemText>
                                                    <ListItemText>
                                                        {" "}
                                                        Phone Number :{" "}
                                                        {bankDetails.account_holder_name}
                                                    </ListItemText>
                                                </List>
                                            </AccordionDetails>
                                        </Accordion>
                                    </TableCell>
                                </TableRow> */}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PaperOrders;
