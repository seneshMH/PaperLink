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

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import moment from "moment";
import AdvertismentForm from "./AdvertismentForm";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import {
	deleteAdvertisment,
	getAdvertisments,
} from "../../../../apiCalls/advertisments";

function Advertisments() {
	const message = useMessage();
	const [showAdvertismentForm, setShowAdvertismentForm] = useState(false);
	const [advertisments, setAdvertisments] = useState();
	const [selectedAdvertisment, setSelectedAdvertisment] = useState(null);

	const { user } = useSelector((state) => state.users);

	const dispatch = useDispatch();

	const getData = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await getAdvertisments({
				buyer: user._id,
			});

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
	}, []);

	const deleteProduct = async (id) => {
		try {
			dispatch(SetLoader(true));
			const response = await deleteAdvertisment(id);
			if (response.success) {
				message.success(response.message);
				getData();
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
		<Box sx={{ paddingBottom: "4px" }}>
			<Button
				variant="contained"
				endIcon={<AddIcon />}
				onClick={() => {
					setSelectedAdvertisment(null);
					setShowAdvertismentForm(true);
				}}
				sx={{ marginBottom: "10px" }}
			>
				Add Advertisment
			</Button>

			<TableContainer component={Paper}>
				<Table
					sx={{ minWidth: 650 }}
					size="small"
					aria-label="a dense table"
				>
					<TableHead>
						<TableRow>
							<TableCell align="right">Title</TableCell>
							<TableCell align="right">Description</TableCell>
							<TableCell align="right">Chemical</TableCell>
							<TableCell align="right">Tool</TableCell>
							<TableCell align="right">Material</TableCell>
							<TableCell align="right">status</TableCell>
							<TableCell align="right">Added On</TableCell>
							<TableCell align="right">Actions</TableCell>
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
								<TableCell align="right">
									{advertisment.title}
								</TableCell>
								<TableCell align="right">
									{advertisment.description}
								</TableCell>
								<TableCell align="right">
									{advertisment.isChemical === "on"
										? "Yes"
										: "No"}
								</TableCell>
								<TableCell align="right">
									{advertisment.isTool === "on"
										? "Yes"
										: "No"}
								</TableCell>
								<TableCell align="right">
									{advertisment.isMaterial === "on"
										? "Yes"
										: "No"}
								</TableCell>
								<TableCell align="right">
									{advertisment.status}
								</TableCell>
								<TableCell align="right">
									{moment(advertisment.createdAt).format(
										"DD-MM-YYYY hh-mm A"
									)}
								</TableCell>
								<TableCell align="right">
									<Button
										variant="outlined"
										startIcon={<EditIcon />}
										onClick={() => {
											setSelectedAdvertisment(
												advertisment
											);
											setShowAdvertismentForm(true);
										}}
									>
										Edit
									</Button>
									<Button
										variant="outlined"
										color="error"
										startIcon={<DeleteIcon />}
										onClick={() =>
											deleteProduct(advertisment._id)
										}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{showAdvertismentForm && (
				<AdvertismentForm
					showAdvertismentForm={showAdvertismentForm}
					setShowAdvertismentForm={setShowAdvertismentForm}
					selectedAdvertisment={selectedAdvertisment}
					setSelectedAdvertisment={setSelectedAdvertisment}
					getData={getData}
				/>
			)}
		</Box>
	);
}

export default Advertisments;
