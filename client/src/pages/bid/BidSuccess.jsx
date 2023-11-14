import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMessage } from "../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { changeBidPaidStatus } from "../../apiCalls/bids";
import Footer from "../../components/footer/Footer";

function BidSuccess() {
	const { bidId } = useParams();
	const message = useMessage();
	const dispatch = useDispatch();

	const orderSuccess = async () => {
		try {
			if (bidId === undefined) {
				throw new Error("No bid found");
			}

			dispatch(SetLoader(true));

			const response = await changeBidPaidStatus({
				bidId: bidId,
				paid: true,
			});

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
		orderSuccess();
		// eslint-disable-next-line
	}, []);
	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<Typography variant="h4">Bid success : # {bidId}</Typography>
			</Box>
			<Footer />
		</>
	);
}

export default BidSuccess;
