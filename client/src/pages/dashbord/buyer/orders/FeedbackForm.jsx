import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Rating,
} from "@mui/material";
import React, { useState } from "react";
import { useMessage } from "../../../../hooks/message/Message";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import { GiveRatingToProduct } from "../../../../apiCalls/products";

function FeedbackForm({ showFeedbackForm, setShowFeedbackForm, productId }) {
	const [value, setValue] = useState(0.0);
	const message = useMessage();
	const dispatch = useDispatch();

	const handleFeedback = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await GiveRatingToProduct(productId, {
				rating: value,
			});

			if (response.success) {
				setShowFeedbackForm(false);
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

	return (
		<Box>
			<Dialog
				open={showFeedbackForm}
				onClose={() => {
					setShowFeedbackForm(false);
				}}
				PaperProps={{
					sx: {
						width: "500px",
					},
				}}
			>
				<DialogTitle>Give Rating</DialogTitle>
				<DialogContent>
					<Rating
						name="half-rating"
						defaultValue={0.0}
						precision={0.5}
						size="large"
						onChange={(event, newValue) => {
							setValue(newValue);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowFeedbackForm(false)}>
						Cancel
					</Button>

					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							handleFeedback();
						}}
					>
						Give Rate
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default FeedbackForm;
