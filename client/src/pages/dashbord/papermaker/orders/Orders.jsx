import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { useMessage } from "../../../../hooks/message/Message";
import { GetOrderBySeller, UpdateOrderStatus } from "../../../../apiCalls/product.order";
import moment from "moment";

function Orders() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);
    const message = useMessage();

    const [orders, setOrders] = useState();

    const getData = async () => {
        try {
            if (!user) return;

            dispatch(SetLoader(true));
            const response = await GetOrderBySeller(user._id);

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

    const handleChangeOrderStatus = async (orderId, status) => {
        try {
            dispatch(SetLoader(true));
            const response = await UpdateOrderStatus(orderId, status);

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

    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);

    return (
        <Box sx={{ paddingBottom: "4px" }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Buyer</TableCell>
                            <TableCell align="right">E-mail</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="right">Phone</TableCell>
                            <TableCell align="right">Purchased On</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders?.map((order) => (
                            <TableRow
                                key={order._id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell align="right">{order.product.name}</TableCell>
                                <TableCell align="right">rs. {order.product.price}</TableCell>
                                <TableCell align="right">{order.quantity}</TableCell>
                                <TableCell align="right">{order.buyer.name}</TableCell>
                                <TableCell align="right">{order.buyer.email}</TableCell>
                                <TableCell align="right">{order.buyer.address}</TableCell>
                                <TableCell align="right">{order.buyer.phone}</TableCell>
                                <TableCell align="right">
                                    {moment(order.createdAt).format("DD-MM-YYYY hh-mm A")}
                                </TableCell>
                                <TableCell align="right">
                                    {order.status === "pending" ? (
                                        <Typography color="red">Pending</Typography>
                                    ) : (
                                        <Typography color="green">Delivered</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {order.status === "pending" && (
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                handleChangeOrderStatus(order._id, "deliver");
                                            }}
                                        >
                                            Set to Deliver
                                        </Button>
                                    )}

                                    {order.status === "deliver" && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => {
                                                handleChangeOrderStatus(order._id, "pending");
                                            }}
                                        >
                                            Set to Pending
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* {showAdvertismentForm && (
				<AdvertismentForm
					showAdvertismentForm={showAdvertismentForm}
					setShowAdvertismentForm={setShowAdvertismentForm}
					selectedAdvertisment={selectedAdvertisment}
					setSelectedAdvertisment={setSelectedAdvertisment}
					getData={getData}
				/>
			)} */}
        </Box>
    );
}

export default Orders;
