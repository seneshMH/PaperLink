import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CancelOrder } from "../../apiCalls/product.order";
import { useMessage } from "../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { Box, Typography } from "@mui/material";

function Cancle() {
	const { orderId } = useParams();
	const message = useMessage();
	const dispatch = useDispatch();

	const cancleOrder = async () => {
		try {
			if (orderId === undefined) {
				throw new Error("No order id found");
			}
			dispatch(SetLoader(true));

			const response = await CancelOrder(orderId);
			if (response.success) {
				message.success(response.message);
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
		cancleOrder();
		// eslint-disable-next-line
	}, []);

	return (
		<Box
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%,-50%)",
			}}
		>
			<Typography variant="h4">Order Cancled : {orderId}</Typography>
		</Box>
	);
}

export default Cancle;
