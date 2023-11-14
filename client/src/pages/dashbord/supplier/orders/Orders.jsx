import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
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
import React, { useEffect, useState } from "react";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { useMessage } from "../../../../hooks/message/Message";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { ChangeBidStatus, GetPaidBidsBySellerId } from "../../../../apiCalls/bids";

function Orders() {
    const [bids, setBids] = useState();
    const message = useMessage();
    const { user } = useSelector((state) => state.users);

    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));

            const response = await GetPaidBidsBySellerId(user._id);

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

    const changeBidStatus = async (id, status) => {
        try {
            dispatch(SetLoader(true));

            const response = await ChangeBidStatus(id, status);

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
                {bids?.map((bid) => (
                    <Box key={bid._id}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Advertisement</TableCell>
                                    <TableCell align="right">Advertisement Description</TableCell>
                                    <TableCell align="right">Bid Amount</TableCell>
                                    <TableCell align="right">Chemical</TableCell>
                                    <TableCell align="right">Tool</TableCell>
                                    <TableCell align="right">Material</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                    <TableCell align="right">Added On</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell align="right">{bid.advertisement.title}</TableCell>
                                    <TableCell align="right">
                                        {bid.advertisement.description}
                                    </TableCell>
                                    <TableCell align="right">{bid.bidAmount}</TableCell>
                                    <TableCell align="right">
                                        {bid.advertisement.isChemical === "on" ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {bid.advertisement.isTool === "on" ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {bid.advertisement.isMaterial === "on" ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={
                                            bid.status === "pending"
                                                ? { color: "red" }
                                                : { color: "green" }
                                        }
                                    >
                                        {bid.status.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {moment(bid.createdAt).format("DD-MM-YYYY hh-mm A")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {bid.status === "pending" && (
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    changeBidStatus(bid._id, "deliver");
                                                }}
                                            >
                                                Set to Deliver
                                            </Button>
                                        )}

                                        {bid.status === "deliver" && (
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => {
                                                    changeBidStatus(bid._id, "pending");
                                                }}
                                            >
                                                Set to Pending
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Divider />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandCircleDownIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6">Buyer Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    <ListItemText> Name : {bid.buyer.name}</ListItemText>
                                    <ListItemText> Address : {bid.buyer.address}</ListItemText>
                                    <ListItemText> E-mail : {bid.buyer.email}</ListItemText>
                                    <ListItemText> Phone Number : {bid.buyer.phone}</ListItemText>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                        <Divider />
                    </Box>
                ))}
            </TableContainer>
        </Box>
    );
}

export default Orders;
