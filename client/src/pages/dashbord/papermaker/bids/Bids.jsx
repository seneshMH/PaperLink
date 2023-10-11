import {
	Badge,
	Box,
	Divider,
	IconButton,
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
import { useMessage } from "../../../../hooks/message/Message";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { getAdvertisments } from "../../../../apiCalls/advertisments";

import { getBids } from "../../../../apiCalls/bids";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

function Bids() {
	const message = useMessage();
	const [advertisments, setAdvertisments] = useState();
	const { user } = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getData = async () => {
		try {
			dispatch(SetLoader(true));

			// Fetch advertisements
			const advertisementResponse = await getAdvertisments({
				buyer: user._id,
			});

			if (advertisementResponse.success) {
				const advertisements = advertisementResponse.data;

				if (advertisements.length === 0) return;

				// Create an array of advertisement IDs
				const advertisementIds = advertisements.map(
					(advertisement) => advertisement._id
				);

				// Fetch bids for all advertisements concurrently
				const bidResponses = await Promise.all(
					advertisementIds.map((advertisementId) =>
						getBids({ advertisement: advertisementId })
					)
				);

				// Combine advertisements with bids into an array of objects
				const advertisementsWithBids = advertisements.map(
					(advertisement, index) => ({
						advertisement: advertisement,
						bids: bidResponses[index].success
							? bidResponses[index].data
							: [],
					})
				);

				// Filter advertisements that have bids
				const filteredAdvertisements = advertisementsWithBids.filter(
					(advertisementData) => advertisementData.bids.length > 0
				);

				setAdvertisments(filteredAdvertisements);
			} else {
				throw new Error(advertisementResponse.message);
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
				{advertisments?.map((advertisment) => (
					<>
						<Box sx={{ padding: "20px" }}>
							<Typography
								variant="h6"
								gutterBottom
								component="div"
							>
								Advertisment :{" "}
								{advertisment.advertisement.title}
							</Typography>
							<Typography
								variant="body2"
								gutterBottom
								component="div"
							>
								Description :{" "}
								{advertisment.advertisement.description}
							</Typography>
							<Typography
								variant="body2"
								gutterBottom
								component="div"
							>
								Created At :{" "}
								{moment(
									advertisment.advertisement.createdAt
								).format("DD-MM-YYYY hh-mm A")}
							</Typography>
						</Box>
						<Divider
							sx={{ margin: "20px", backgroundColor: "green" }}
						/>
						<Table
							key={advertisment.advertisement._id}
							sx={{ minWidth: 650 }}
							size="small"
							aria-label="a dense table"
						>
							<TableHead>
								<TableRow>
									<TableCell align="right">No.</TableCell>
									<TableCell align="right">Seller</TableCell>
									<TableCell align="right">
										Bid Amount
									</TableCell>
									<TableCell align="right">Message</TableCell>
									<TableCell align="right">
										Created At
									</TableCell>
									<TableCell align="right">Contact</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{advertisment.bids.map((bid, index) => (
									<TableRow key={bid._id}>
										<TableCell align="right">
											{index + 1}
										</TableCell>
										<TableCell align="right">
											{bid.seller.name}
										</TableCell>
										<TableCell align="right">
											Rs. {bid.bidAmount}
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
											<IconButton
												color="primary"
												onClick={() => {
													navigate(
														`/chats/${advertisment.advertisement._id}-${bid.seller._id}`
													);
												}}
											>
												<Badge color="error">
													<EmailIcon />
												</Badge>
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Divider
							sx={{ margin: "20px", backgroundColor: "green" }}
						/>
					</>
				))}
			</TableContainer>
		</Box>
	);
}

export default Bids;
