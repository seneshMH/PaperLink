import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { GetCurrentUser } from "../../apiCalls/users";
import { SetUser } from "../../redux/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../../hooks/message/Message";
import Navbar from "../navbar/Navbar";
import { GetAllNotifications } from "../../apiCalls/notifications";
import { useNotification } from "../../context/NotificationContext";

import { setupJoin, setupNotificationListener } from "../../socket/socket";

function ProtectedPage({ children }) {
	const { user } = useSelector((state) => state.users);

	const { notifications, addNotifications, addNotification } =
		useNotification();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const message = useMessage();
	const location = useLocation();

	const validateToken = async () => {
		try {
			dispatch(SetLoader(true));
			const response = await GetCurrentUser();
			if (response.success) {
				dispatch(SetUser(response.data));
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			navigate("/login");
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	useEffect(() => {
		if (!user) return;

		setupJoin(user._id);
		setupNotificationListener(addNotification);

		// return () => {
		// 	socket.disconnect();
		// };

		// eslint-disable-next-line
	}, [user?._id]);

	const GetNotifications = async () => {
		try {
			const response = await GetAllNotifications();
			if (response.success) {
				addNotifications(response.data);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	useEffect(() => {
		if (localStorage.getItem("token")) {
			validateToken();
			GetNotifications();
		} else {
			if (location.pathname !== "/") {
				navigate("/login");
			}
		}

		// eslint-disable-next-line
	}, []);

	return (
		<div>
			{user && (
				<>
					<Navbar
						hideIcons={false}
						notifications={notifications}
						GetNotifications={GetNotifications}
					/>
					{children}
				</>
			)}

			{!user && (
				<>
					<Navbar
						hideIcons={true}
						notifications={notifications}
						GetNotifications={GetNotifications}
					/>
					{children}
				</>
			)}
		</div>
	);
}

export default ProtectedPage;
