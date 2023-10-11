import React, { useEffect, useState } from "react";
import {
	createBankAccount,
	createPaymentDetails,
	getPaymentDetails,
} from "../../../../apiCalls/payment";
import { useMessage } from "../../../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { Box, Typography, TextField, Button } from "@mui/material";

function Payments() {
	const [paymentDetails, setPaymentDetails] = useState({});
	const [bankDetails, setBankDetails] = useState({
		account_number: "000123456789",
		account_holder_name: "user1",
		country: "US",
		routing_number: "110000000",
		currency: "usd",
	});
	const message = useMessage();
	const dispatch = useDispatch();

	const getData = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await getPaymentDetails();

			if (response.success) {
				if (!response.data) {
					const paymentDetails = await createPaymentDetails();

					if (paymentDetails.success) {
						message.success(paymentDetails.message);
						setPaymentDetails(paymentDetails.data);
					} else {
						throw new Error(paymentDetails.message);
					}
				} else {
					setPaymentDetails(response.data);
					if (response.data.bank) {
						setBankDetails(response.data.bank);
					}
				}
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	const handleBankDetailsChange = (e) => {
		const { name, value } = e.target;
		setBankDetails({ ...bankDetails, [name]: value });
	};

	const saveBankDetails = async () => {
		try {
			dispatch(SetLoader(true));

			const response = await createBankAccount({ account: bankDetails });

			if (response.success) {
				message.success(response.message);
				// You can optionally update the displayed bank details here.
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
		<Box
			sx={{
				padding: 2,
				backgroundColor: "#f0f0f0",
				borderRadius: 2,
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Typography
				variant="h4"
				sx={{
					marginBottom: 2,
					color: "#333",
				}}
			>
				Payments
			</Typography>
			<Typography
				variant="h6"
				sx={{
					marginBottom: 1,
					color: "#555",
				}}
			>
				Payment Details
			</Typography>
			<Typography
				variant="body1"
				sx={{
					color: "#666",
				}}
			>
				Hold: {paymentDetails.hold}
			</Typography>
			<Typography
				variant="body1"
				sx={{
					color: "#666",
				}}
			>
				Fund: {paymentDetails.fund}
			</Typography>

			{/* New section for bank details */}
			<Typography variant="h6" sx={{ marginTop: 2, color: "#555" }}>
				Bank Details
			</Typography>
			<TextField
				name="account_number"
				label="Account Number"
				variant="outlined"
				fullWidth
				margin="normal"
				value={bankDetails.account_number}
				onChange={handleBankDetailsChange}
				required
			/>
			<TextField
				name="account_holder_name"
				label="Account Holder Name"
				variant="outlined"
				fullWidth
				margin="normal"
				value={bankDetails.account_holder_name}
				onChange={handleBankDetailsChange}
				required
			/>
			<TextField
				name="country"
				label="Country"
				variant="outlined"
				fullWidth
				margin="normal"
				value={bankDetails.country}
				onChange={handleBankDetailsChange}
				required
			/>
			<TextField
				name="routing_number"
				label="Routing number"
				variant="outlined"
				fullWidth
				margin="normal"
				value={bankDetails.routing_number}
				onChange={handleBankDetailsChange}
				required
			/>
			<TextField
				name="currency"
				label="Currency"
				variant="outlined"
				fullWidth
				margin="normal"
				value={bankDetails.currency}
				onChange={handleBankDetailsChange}
				required
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={saveBankDetails}
				sx={{ marginTop: 2 }}
			>
				Save Bank Details
			</Button>
		</Box>
	);
}

export default Payments;
