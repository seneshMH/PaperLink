import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

function BidCancel() {
	const { bidId } = useParams();

	return (
		<Box
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%,-50%)",
			}}
		>
			<Typography variant="h4">Bid Cancled : {bidId}</Typography>
		</Box>
	);
}

export default BidCancel;
