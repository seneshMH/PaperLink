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
import moment from "moment";
import React, { useEffect, useState } from "react";
import FeedbackForm from "./FeedbackForm";
import { useMessage } from "../../../../hooks/message/Message";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { getBidByBuyerId } from "../../../../apiCalls/bids";

function PaidBids() {
	const [showFeedbackForm, setShowFeedbackForm] = useState(false);
	const [sellerId, setSellerId] = useState("");

	const [bids, setBids] = useState([]);

	const { user } = useSelector((state) => state.users);

	const message = useMessage();
	const dispatch = useDispatch();

	const getData = async () => {
		try {
			dispatch(SetLoader(true));

			const response = await getBidByBuyerId(user._id);

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

	useEffect(() => {
		getData();

		// eslint-disable-next-line
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
							<TableCell align="right">Advertisement</TableCell>
							<TableCell align="right">Seller</TableCell>
							<TableCell align="right">Bid Amount</TableCell>
							<TableCell align="right">Message</TableCell>
							<TableCell align="right">Created On</TableCell>
							<TableCell align="right">Status</TableCell>
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
								<TableCell align="right">
									{bid.advertisement.title}
								</TableCell>
								<TableCell align="right">
									{bid.seller.name}
								</TableCell>
								<TableCell align="right">
									{bid.bidAmount}
								</TableCell>
								<TableCell align="right">
									{bid.message}
								</TableCell>
								<TableCell align="right">
									{moment(bid.createdAt).format(
										"DD-MM-YYYY hh-mm A"
									)}
								</TableCell>
								<TableCell align="right">
									{bid.status === "pending" ? (
										<Typography color="red">
											Pending
										</Typography>
									) : (
										<Typography color="green">
											Delivered
										</Typography>
									)}
								</TableCell>
								<TableCell align="right">
									<Button
										variant="contained"
										color="warning"
										// startIcon={<ImageIcon />}
										onClick={() => {
											setSellerId(bid.seller._id);
											setShowFeedbackForm(true);
										}}
									>
										Give Feedback
									</Button>
									&nbsp;
									<Button
										variant="contained"
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
					sellerId={sellerId}
				/>
			)}
		</Box>
	);
}

export default PaidBids;
