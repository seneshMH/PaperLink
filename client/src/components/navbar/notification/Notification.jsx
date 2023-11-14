import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment/moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loaderSlice";
import { DeleteNotification } from "../../../apiCalls/notifications";
import { useMessage } from "../../../hooks/message/Message";
import { useNotification } from "../../../context/NotificationContext";

function Notification({ showNotifications, setShowNotifications }) {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const message = useMessage();

	const { notifications, removeNotification } = useNotification();

	const deleteNotification = async (id) => {
		try {
			dispatch(SetLoader(true));
			const response = await DeleteNotification(id);

			if (response.success) {
				message.success(response.message);
				removeNotification(id);
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
				open={showNotifications}
				onClose={() => {
					setShowNotifications(false);
				}}
				PaperProps={{
					sx: {
						width: "500px",
					},
				}}
			>
				<DialogTitle>Notifications</DialogTitle>
				<DialogContent>
					{notifications?.map((notification) => (
						<Box
							key={notification._id}
							sx={{
								boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
								cursor: "pointer",
								padding: "5px",
								marginBottom: "2px",
								"&:hover": {
									backgroundColor: "lightgray",
								},
								transition: "background-color 0.2s ease",
							}}
						>
							<Box
								onClick={() => {
									navigate(notification.onClick);
									setShowNotifications(false);
								}}
							>
								<Typography>
									{notification.message} <br></br>
								</Typography>
								<Typography variant="caption">
									{moment(notification.createdAt).fromNow()}
								</Typography>
							</Box>
							<IconButton
								aria-label="delete"
								onClick={() => {
									deleteNotification(notification._id);
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					))}
				</DialogContent>
			</Dialog>
		</Box>
	);
}

export default Notification;
