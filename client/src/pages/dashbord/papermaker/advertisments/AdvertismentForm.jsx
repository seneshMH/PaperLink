import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "../../../../hooks/message/Message";
import { SetLoader } from "../../../../redux/loaderSlice";
import {
	addAdvertisment,
	editAdvertisment,
} from "../../../../apiCalls/advertisments";

function AdvertismentForm({
	showAdvertismentForm,
	setShowAdvertismentForm,
	selectedAdvertisment,
	setSelectedAdvertisment,
	getData,
}) {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.users);
	const message = useMessage();

	const [advertisment, setAdvertisment] = useState({
		title: "",
		description: "",
		isChemical: "off",
		isTool: "off",
		isMaterial: "off",
		showBidsOnProductPage: "off",
		buyer: user._id,
		status: "",
	});

	const handleChange = (e) => {
		const { name, value, checked, type } = e.target;

		setAdvertisment((prev) => {
			if (type === "checkbox") {
				return { ...prev, [name]: checked ? "on" : "off" };
			} else {
				return { ...prev, [name]: value };
			}
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(SetLoader(true));
			let response = null;
			if (selectedAdvertisment) {
				advertisment.status = "pending";
				response = await editAdvertisment(
					selectedAdvertisment._id,
					advertisment
				);
			} else {
				advertisment.status = "pending";
				response = await addAdvertisment(advertisment);
			}
			if (response.success) {
				message.success(response.message);
				getData();
				setShowAdvertismentForm(false);
				setSelectedAdvertisment(null);
			} else {
				setSelectedAdvertisment(null);
				setShowAdvertismentForm(false);
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	useEffect(() => {
		if (selectedAdvertisment) {
			setAdvertisment(selectedAdvertisment);
		}
	}, []);

	return (
		<>
			<Box component="form">
				<Dialog
					open={showAdvertismentForm}
					onClose={() => {
						setShowAdvertismentForm(false);
						setSelectedAdvertisment(null);
					}}
				>
					<form onSubmit={handleSubmit}>
						<DialogTitle>
							{selectedAdvertisment
								? "Edit Advertisment"
								: "Add Advertisment"}
						</DialogTitle>
						<DialogContent>
							<FormControl sx={{ minWidth: "100%" }}>
								<TextField
									autoFocus
									margin="dense"
									name="title"
									id="title"
									label="Title"
									type="text"
									fullWidth
									variant="outlined"
									onChange={handleChange}
									defaultValue={
										selectedAdvertisment
											? selectedAdvertisment.title
											: ""
									}
									required
								/>
							</FormControl>

							<FormControl sx={{ minWidth: "100%" }}>
								<TextField
									autoFocus
									margin="dense"
									name="description"
									id="description"
									label="Description"
									type="text"
									fullWidth
									multiline
									rows={4}
									variant="outlined"
									onChange={handleChange}
									defaultValue={
										selectedAdvertisment
											? selectedAdvertisment.description
											: ""
									}
									required
								/>
							</FormControl>
							<FormControl required margin="dense">
								<FormLabel component="legend">
									Select Advertisment Type
								</FormLabel>
								<FormGroup
									sx={{
										display: "flex",
										flexDirection: "row",
										textAlign: "center",
										minWidth: "100%",
									}}
								>
									<FormControlLabel
										name="isChemical"
										id="isChemical"
										control={
											<Checkbox
												defaultChecked={
													selectedAdvertisment
														? selectedAdvertisment.isChemical ===
														  "on"
														: false
												}
												onChange={handleChange}
											/>
										}
										label="Chemical"
										onChange={handleChange}
									/>
									<FormControlLabel
										name="isTool"
										id="isTool"
										control={
											<Checkbox
												defaultChecked={
													selectedAdvertisment
														? selectedAdvertisment.isTool ===
														  "on"
														: false
												}
												onChange={handleChange}
											/>
										}
										label="Tool"
										onChange={handleChange}
									/>
									<FormControlLabel
										name="isMaterial"
										id="isMaterial"
										control={
											<Checkbox
												defaultChecked={
													selectedAdvertisment
														? selectedAdvertisment.isMaterial ===
														  "on"
														: false
												}
												onChange={handleChange}
											/>
										}
										label="Material"
									/>
								</FormGroup>
							</FormControl>
							<Divider />
							<FormControl margin="dense">
								<FormLabel component="legend">
									Show Bids On Product Page
								</FormLabel>
								<FormGroup>
									<FormControlLabel
										name="showBidsOnProductPage"
										id="showBidsOnProductPage"
										control={
											<Checkbox
												defaultChecked={
													selectedAdvertisment
														? selectedAdvertisment.showBidsOnProductPage ===
														  "on"
														: false
												}
												onChange={handleChange}
											/>
										}
										label="Bids On Product Page"
									/>
								</FormGroup>
							</FormControl>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => setShowAdvertismentForm(false)}
							>
								Cancel
							</Button>
							<Button type="submit">
								{selectedAdvertisment
									? "Edit Advertisment"
									: "Add Advertisment"}
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			</Box>
		</>
	);
}

export default AdvertismentForm;
