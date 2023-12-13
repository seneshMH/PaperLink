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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMessage } from "../../../../hooks/message/Message";
import { SetLoader } from "../../../../redux/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetOrderByBuyer } from "../../../../apiCalls/product.order";
import moment from "moment/moment";
import FeedbackForm from "./FeedbackForm";

function Orders() {
	const message = useMessage();
	const [orders, setOrders] = useState();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.users);

	const [showFeedbackForm, setShowFeedbackForm] = useState(false);
	const [productId, setProductId] = useState();

	const getData = async () => {
		try {
			if (!user) return;

			dispatch(SetLoader(true));
			const response = await GetOrderByBuyer(user._id);

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

	useEffect(() => {
		getData();
	}, []);

	return (
		<Box sx={{ paddingBottom: "4px" }}>
			<TableContainer component={Paper}>
				<Table
					sx={{ minWidth: 650 }}
					size="small"
					aria-label="a dense table"
				>
					<TableHead>
						<TableRow>
							<TableCell align="right">Product Name</TableCell>
							<TableCell align="right">Seller</TableCell>
							<TableCell align="right">Price</TableCell>
							<TableCell align="right">Quantity</TableCell>
							<TableCell align="right">Purchased On</TableCell>
							<TableCell align="right">Status</TableCell>
							<TableCell align="right">Actions</TableCell>
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
								<TableCell align="right">
									{order.product.name}
								</TableCell>
								<TableCell align="right">
									{order.product.seller.name}
								</TableCell>
								<TableCell align="right">
									{order.product.price}
								</TableCell>
								<TableCell align="right">
									{order.quantity}
								</TableCell>
								<TableCell align="right">
									{moment(order.createdAt).format(
										"DD-MM-YYYY hh-mm A"
									)}
								</TableCell>
								<TableCell align="right">
									{order.status}
								</TableCell>
								<TableCell align="right">
									<Button
										variant="outlined"
										color="warning"
										// startIcon={<ImageIcon />}
										onClick={() => {
											setProductId(order.product._id);
											setShowFeedbackForm(true);
										}}
									>
										Give Feedback
									</Button>
									<Button
										variant="outlined"
										color="error"
										// startIcon={<ImageIcon />}
										onClick={() => {}}
									>
										Report
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{showFeedbackForm && (
				<FeedbackForm
					showFeedbackForm={showFeedbackForm}
					setShowFeedbackForm={setShowFeedbackForm}
					productId={productId}
				/>
			)}
		</Box>
	);
}

export default Orders;
