import {
    Badge,
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMessage } from "../../../../hooks/message/Message";

import EmailIcon from "@mui/icons-material/Email";
import moment from "moment";
// import AdvertismentForm from "./AdvertismentForm";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { getAdvertisments } from "../../../../apiCalls/advertisments";
import { useNavigate } from "react-router-dom";

function Advertisments() {
    const message = useMessage();
    const [advertisments, setAdvertisments] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await getAdvertisments({ status: "approved" });

            if (response.success) {
                setAdvertisments(response.data);
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
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Chemical</TableCell>
                            <TableCell align="right">Tool</TableCell>
                            <TableCell align="right">Material</TableCell>
                            <TableCell align="right">Added On</TableCell>
                            <TableCell align="right">Messages</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {advertisments?.map((advertisment) => (
                            <TableRow
                                key={advertisment._id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell align="right">{advertisment.title}</TableCell>
                                <TableCell align="right">{advertisment.description}</TableCell>
                                <TableCell align="right">
                                    {advertisment.isChemical === "on" ? "Yes" : "No"}
                                </TableCell>
                                <TableCell align="right">
                                    {advertisment.isTool === "on" ? "Yes" : "No"}
                                </TableCell>
                                <TableCell align="right">
                                    {advertisment.isMaterial === "on" ? "Yes" : "No"}
                                </TableCell>
                                <TableCell align="right">
                                    {moment(advertisment.createdAt).format("DD-MM-YYYY hh-mm A")}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            navigate(`/chats/${advertisment._id}`);
                                        }}
                                    >
                                        <Badge>
                                            <EmailIcon />
                                        </Badge>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Advertisments;
