import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMessage } from "../../../../hooks/message/Message";
import { SetLoader } from "../../../../redux/loaderSlice";
import {
	getAdvertisments,
	updateAdvertismentStatus,
} from "../../../../apiCalls/advertisments";

import BeenhereIcon from "@mui/icons-material/Beenhere";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";

function Advertisments() {
	const dispatch = useDispatch();
	const message = useMessage();
	const [advertisments, setAdvertisments] = useState([]);

	const onStatusUpdate = async (id, status) => {
		try {
			dispatch(SetLoader(true));
			const response = await updateAdvertismentStatus(id, status);
			dispatch(SetLoader(false));

			if (response.success) {
				message.success(response.message);
				getData();
			} else {
				message.error(response.message);
			}
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
		}
	};

	const getData = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await getAdvertisments();

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

	return (
		<div>
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
							<TableCell align="right">Buyer</TableCell>
							<TableCell align="right">Chemical</TableCell>
							<TableCell align="right">Tool</TableCell>
							<TableCell align="right">Material</TableCell>
							<TableCell align="right">Created At</TableCell>
							<TableCell align="right">Status</TableCell>
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
									{advertisment.buyer.name}
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
									{moment(advertisment.createdAt).format(
										"DD-MM-YYYY hh-mm A"
									)}
								</TableCell>
								<TableCell align="right">
									{advertisment.status}
								</TableCell>
								<TableCell align="right">
									{advertisment.status === "pending" && (
										<Button
											variant="outlined"
											startIcon={<BeenhereIcon />}
											onClick={() =>
												onStatusUpdate(
													advertisment._id,
													"approved"
												)
											}
										>
											Approve
										</Button>
									)}
									{advertisment.status === "approved" && (
										<Button
											variant="outlined"
											color="error"
											startIcon={<WebAssetOffIcon />}
											onClick={() =>
												onStatusUpdate(
													advertisment._id,
													"blocked"
												)
											}
										>
											Block
										</Button>
									)}
									{advertisment.status === "blocked" && (
										<Button
											variant="outlined"
											startIcon={<BeenhereIcon />}
											onClick={() =>
												onStatusUpdate(
													advertisment._id,
													"approved"
												)
											}
										>
											UnBlock
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default Advertisments;
