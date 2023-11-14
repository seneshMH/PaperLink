import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
	return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);

	// Function to add all notifications
	const addNotifications = (notifications) => {
		setNotifications(notifications);
	};

	// Function to add a new notification
	const addNotification = (notification) => {
		setNotifications((prevNotification) => [
			...prevNotification,
			notification,
		]);
	};

	// Function to remove a notification by ID
	const removeNotification = (notificationId) => {
		setNotifications(notifications.filter((n) => n.id !== notificationId));
	};

	// Function to clear all notifications
	const clearNotifications = () => {
		setNotifications([]);
	};

	const value = {
		notifications,
		addNotification,
		addNotifications,
		removeNotification,
		clearNotifications,
	};

	return (
		<NotificationContext.Provider value={value}>
			{children}
		</NotificationContext.Provider>
	);
};
