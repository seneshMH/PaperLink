import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
import { SetLoader } from "../../../../redux/loaderSlice";
import { useMessage } from "../../../../hooks/message/Message";
import moment from "moment";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import { GetAllUsers, UpdateUserStatus } from "../../../../apiCalls/users";

function Users() {
	const dispatch = useDispatch();
	const message = useMessage();
	const [users, setUsers] = useState([]);

	const onStatusUpdate = async (id, status) => {
		try {
			dispatch(SetLoader(true));
			const response = await UpdateUserStatus(id, status);
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
			const response = await GetAllUsers();
			dispatch(SetLoader(false));

			if (response.success) {
				setUsers(response.data);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
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
							<TableCell align="right">Name</TableCell>
							<TableCell align="right">Email</TableCell>
							<TableCell align="right">Role</TableCell>
							<TableCell align="right">Created At</TableCell>
							<TableCell align="right">Status</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users?.map((user) => (
							<TableRow
								key={user._id}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
								}}
							>
								<TableCell align="right">{user.name}</TableCell>
								<TableCell align="right">
									{user.email}
								</TableCell>
								<TableCell align="right">{user.role}</TableCell>
								<TableCell align="right">
									{moment(user.createdAt).format(
										"DD-MM-YYYY hh-mm A"
									)}
								</TableCell>
								<TableCell align="right">
									{user.status}
								</TableCell>
								<TableCell align="right">
									{user.status === "active" && (
										<Button
											variant="outlined"
											color="error"
											startIcon={<WebAssetOffIcon />}
											onClick={() =>
												onStatusUpdate(
													user._id,
													"blocked"
												)
											}
										>
											Block
										</Button>
									)}
									{user.status === "blocked" && (
										<Button
											variant="outlined"
											startIcon={<BeenhereIcon />}
											onClick={() =>
												onStatusUpdate(
													user._id,
													"active"
												)
											}
										>
											Unblock
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

export default Users;
