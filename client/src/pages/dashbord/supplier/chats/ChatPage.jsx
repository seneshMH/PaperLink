// ChatPage.js
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
	TextField,
	Button,
	Container,
	Paper,
	Typography,
	Box,
	List,
	ListItem,
	ListItemText,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid,
	Avatar,
	IconButton,
	Rating,
	Drawer,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { findOrCreateConversation } from "../../../../apiCalls/conversations";
import { useMessage } from "../../../../hooks/message/Message";
import { SetLoader } from "../../../../redux/loaderSlice";
import {
	createMessage,
	deleteMessage,
	getMessagesByConversationId,
} from "../../../../apiCalls/messages";
import { getAdvertismentById } from "../../../../apiCalls/advertisments";
import {
	addBid,
	createCheckoutSession,
	deleteBid,
	getBids,
} from "../../../../apiCalls/bids";

import { GetUserById } from "../../../../apiCalls/users";
import {
	disconnectSocket,
	emitAddBid,
	emitDeleteBid,
	emitDeleteMessage,
	emitNewMessage,
	emitNewNotification,
	emitStopTyping,
	emitTyping,
	setupAddBidListener,
	setupConnectedListener,
	setupConversation,
	setupDeleteBidListener,
	setupDeleteMessageListener,
	setupNewMessageListener,
	setupStopTypingListener,
	setupTypingListener,
} from "../../../../socket/socket";

import typingAnimation from "./animations/typing.json";
import Lottie from "lottie-react";

const ChatPage = () => {
	const { id } = useParams();
	const { user } = useSelector((state) => state.users);
	const [advertisementId, seller] = id.split("-");

	const message = useMessage();
	const dispatch = useDispatch();
	const messagesEndRef = useRef(null);

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
	const [bidDetails, setBidDetails] = useState({ message: "", bidAmount: 0 });
	const [bids, setBids] = useState([]);

	const [conversation, setConversation] = useState(null);
	const [advertisement, setAdvertisement] = useState(null);
	const [socketConnected, setSocketConnected] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const [sender, setSender] = useState(null);
	const [receiver, setReceiver] = useState(null);

	const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false); // State for left section mobile drawer
	const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false); // State for right section mobile drawer

	const openLeftDrawer = () => {
		setIsLeftDrawerOpen(true);
	};

	const closeLeftDrawer = () => {
		setIsLeftDrawerOpen(false);
	};

	const openRightDrawer = () => {
		setIsRightDrawerOpen(true);
	};

	const closeRightDrawer = () => {
		setIsRightDrawerOpen(false);
	};

	let getUserIdByType = (result) => {
		//check user is papermaker/buyer or supplier/seller and set sellerId and buyerId
		let sellerId = null;
		let buyerId = null;

		if (user.role === "papermaker") {
			sellerId = seller;
			buyerId = user._id;
		} else if (user.role === "supplier") {
			sellerId = user._id;
			buyerId = result.buyer._id;
		} else {
			throw new Error("Invalid user role");
		}

		return { sellerId, buyerId };
	};

	const fetchData = async () => {
		if (!user) return;
		try {
			dispatch(SetLoader(true));

			//frst get the advertisement
			const response = await getAdvertismentById(advertisementId);
			if (response.success) {
				setAdvertisement(response.data);
			} else {
				throw new Error(response.message);
			}

			//create conversation
			const { sellerId, buyerId } = getUserIdByType(response.data);
			const conversationResponse = await findOrCreateConversation({
				sellerId: sellerId,
				buyerId: buyerId,
			});

			if (conversationResponse.success) {
				setConversation(conversationResponse.data);
			} else {
				throw new Error(conversationResponse.message);
			}

			//get sender and resiver user data by id
			//get seller data
			const sellerResponse = await GetUserById(sellerId);
			if (!sellerResponse.success) {
				throw new Error(sellerResponse.message);
			}

			//get buyer data
			const buyerResponse = await GetUserById(buyerId);
			if (!buyerResponse.success) {
				throw new Error(buyerResponse.message);
			}

			//find sender and resiver
			if (user._id === sellerResponse.data._id) {
				setSender(sellerResponse.data);
				setReceiver(buyerResponse.data);
			} else {
				setSender(buyerResponse.data);
				setReceiver(sellerResponse.data);
			}

			//get messages by conversation id
			const messageResponse = await getMessagesByConversationId(
				conversationResponse.data._id
			);

			if (messageResponse.success) {
				setMessages(messageResponse.data);
			} else {
				throw new Error(messageResponse.message);
			}

			//get all bids
			const bidResponse = await getBids({
				advertisement: response.data._id,
				seller: sellerId,
				buyer: buyerId,
			});

			if (bidResponse.success) {
				setBids(bidResponse.data);
			} else {
				throw new Error(bidResponse.message);
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!user || !conversation) return;

		setupConversation(conversation._id);
		setupConnectedListener(setSocketConnected);

		if (!socketConnected) return;
		setupTypingListener(setIsTyping, user._id);
		setupStopTypingListener(setIsTyping, user._id);
		setupNewMessageListener(setMessages);
		setupDeleteMessageListener(setMessages);
		setupAddBidListener(setBids);
		setupDeleteBidListener(setBids);

		// Clean up socket connection on component unmount
		return () => {
			disconnectSocket();
		};

		// eslint-disable-next-line
	}, [conversation?._id, socketConnected]);

	const handleSendMessage = async () => {
		try {
			if (newMessage.trim() !== "") {
				const response = await createMessage({
					conversationId: conversation._id,
					userId: user._id,
					desc: newMessage,
				});

				if (response.success) {
					emitNewMessage(response.data);

					const notification = {
						title: `New Message by ${sender.name}`,
						message: response.data.desc,
						onClick: "",
						user: receiver._id,
						read: false,
					};

					emitNewNotification({
						userId: receiver._id,
						notification: notification,
					});
				} else {
					throw new Error(response.message);
				}
			}

			setNewMessage("");
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleTyping = () => {
		if (!socketConnected) return;

		if (!isTyping) {
			emitTyping({
				conversationId: conversation._id,
				userId: user._id,
			});
		}

		// Set a new timer to clear the typing indicator
		const timer = setTimeout(() => {
			emitStopTyping({
				conversationId: conversation._id,
				userId: user._id,
			});
		}, 3000);

		// Return a function to clear the timer
		return () => clearTimeout(timer);
	};

	const handleDeleteMessage = async (messageId) => {
		try {
			if (!messageId) {
				// Check if messageId is undefined or null
				throw new Error("Invalid messageId");
			}

			dispatch(SetLoader(true));

			// Remove the message from the database
			const response = await deleteMessage(messageId);

			if (response.success) {
				emitDeleteMessage({
					conversationId: conversation._id,
					messageId: messageId,
				});
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	const handleAddBid = async () => {
		try {
			dispatch(SetLoader(true));

			const updatedBidDetails = {
				...bidDetails,
				advertisement: advertisement._id,
				seller: user._id,
				buyer: advertisement.buyer._id,
			};

			setBidDetails(updatedBidDetails);

			const response = await addBid(updatedBidDetails);

			if (response.success) {
				emitAddBid({
					conversationId: conversation._id,
					bid: response.data,
				});
			} else {
				throw new Error(response.message);
			}

			setIsBidDialogOpen(false);
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	const handleDeleteBid = async (bidId) => {
		try {
			dispatch(SetLoader(true));
			// Remove the bid from the bids array based on its ID
			const updatedBids = bids.filter((bid) => bid._id !== bidId);
			setBids(updatedBids);

			const response = await deleteBid(bidId);

			if (response.success) {
				emitDeleteBid({
					conversationId: conversation._id,
					bidId: bidId,
				});
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	const handleBidState = async (bidId) => {
		try {
			dispatch(SetLoader(true));

			const response = await createCheckoutSession(bidId);

			if (response.success) {
				window.location = response.data;
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isTyping]);

	return (
		<Container maxWidth="lg">
			{/* Mobile Drawer for Left Section (Show Users) */}
			<Drawer
				anchor="left"
				open={isLeftDrawerOpen}
				onClose={closeLeftDrawer}
			>
				{/* Content for the left section mobile drawer */}
				<Box sx={{ width: 250, marginLeft: 2 }}>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Users
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<List>
						<ListItem>
							<Avatar
								sx={{ mr: 1 }}
								src={sender?.profilePicture}
							/>

							<ListItemText primary={`${sender?.name} (Me)`} />
						</ListItem>
						<ListItem>
							<Avatar
								sx={{ mr: 1 }}
								src={receiver?.profilePicture}
							/>

							<ListItemText
								primary={receiver?.name + " (Receiver)"}
							/>
						</ListItem>
					</List>
					<Divider sx={{ mb: 2 }} />
					<Typography variant="h6">
						{receiver?.role === "papermaker"
							? "Paper Maker"
							: "Seller"}{" "}
						Details
					</Typography>
					<List dense>
						{receiver?.role === "supplier" && (
							<ListItem>
								<Rating
									name="read-only"
									value={receiver?.rating}
									precision={0.5}
									readOnly
									size="small"
								/>
								<ListItemText
									secondary={`${receiver?.totalRatings} reviews`}
								/>
							</ListItem>
						)}
						<ListItem>
							<ListItemText
								secondary={`Name : ${receiver?.name}`}
							/>
						</ListItem>
						<ListItem>
							<ListItemText
								secondary={`E-mail : ${receiver?.email}`}
							/>
						</ListItem>
						<ListItem>
							<ListItemText
								secondary={`Phone No. : ${receiver?.phone}`}
							/>
						</ListItem>
						<ListItem>
							<ListItemText
								secondary={`Address : ${receiver?.address}`}
							/>
						</ListItem>
					</List>
				</Box>
			</Drawer>

			{/* Mobile Drawer for Right Section (Show Bids) */}
			<Drawer
				anchor="right"
				open={isRightDrawerOpen}
				onClose={closeRightDrawer}
			>
				{/* Content for the right section mobile drawer */}
				<Box sx={{ width: 250, marginLeft: 2 }}>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Bids
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<List sx={{ height: "85%", overflowY: "auto" }}>
						{bids.length === 0 && (
							<Typography variant="body1" color="primary">
								Add a bid to start the conversation
							</Typography>
						)}

						{bids.map((bid) => (
							<Box key={bid._id}>
								<ListItem
									sx={{
										mb: 1,
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<ListItemText
										primary={`Bid Amount: Rs .${bid.bidAmount}`}
									/>
									{user.role === "supplier" && (
										<IconButton
											color="primary"
											onClick={() =>
												handleDeleteBid(bid._id)
											}
											disabled={bid.paid}
										>
											<DeleteIcon />
										</IconButton>
									)}
								</ListItem>
								<ListItem>
									<ListItemText
										secondary={`Message : ${bid.message}`}
									/>
								</ListItem>
								{user?.role === "papermaker" && (
									<ListItem>
										<Button
											variant="contained"
											fullWidth
											onClick={() => {
												handleBidState(bid._id);
											}}
											disabled={bid.paid}
										>
											Accept
										</Button>
									</ListItem>
								)}
								<Divider />
							</Box>
						))}
					</List>
				</Box>
			</Drawer>

			{/* Desktop content */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					bgcolor: "#f7f7f7",
					borderRadius: "8px",
					height: "100%",
				}}
			>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					{/* Mobile menu button for Left Section (Show Users) */}
					<Button
						color="primary"
						startIcon={<MenuIcon />}
						onClick={openLeftDrawer}
						sx={{ display: { xs: "block", md: "none" } }}
					>
						Users
					</Button>

					<Typography variant="h4" sx={{ m: 2 }}>
						Messages
					</Typography>

					{/* Mobile menu button for Right Section (Show Bids) */}
					<Button
						color="primary"
						startIcon={<MenuIcon />}
						onClick={openRightDrawer}
						sx={{ display: { xs: "block", md: "none" } }}
					>
						Bids
					</Button>
				</Box>

				<Grid container>
					{/* Left Section - Show Users */}
					<Grid
						item
						xs={12} // On small screens, this will occupy the full width
						md={3} // On medium and larger screens, this will occupy 25% of the width
						sx={{
							p: 2,
							display: { xs: "none", md: "block" }, // Hide on small screens, show on medium and larger screens
						}}
					>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Users
						</Typography>
						<List>
							<ListItem>
								<Avatar
									sx={{ mr: 1 }}
									src={sender?.profilePicture}
								/>

								<ListItemText
									primary={`${sender?.name} (Me)`}
								/>
							</ListItem>
							<ListItem>
								<Avatar
									sx={{ mr: 1 }}
									src={receiver?.profilePicture}
								/>

								<ListItemText
									primary={receiver?.name + " (Receiver)"}
								/>
							</ListItem>
						</List>
						<Divider sx={{ mb: 2 }} />
						<Typography variant="h6">
							{receiver?.role === "papermaker"
								? "Paper Maker"
								: "Seller"}{" "}
							Details
						</Typography>
						<List dense>
							{receiver?.role === "supplier" && (
								<ListItem>
									<Rating
										name="read-only"
										value={receiver?.rating}
										precision={0.5}
										readOnly
										size="small"
									/>
									<ListItemText
										secondary={`${receiver?.totalRatings} reviews`}
									/>
								</ListItem>
							)}
							<ListItem>
								<ListItemText
									secondary={`Name : ${receiver?.name}`}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									secondary={`E-mail : ${receiver?.email}`}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									secondary={`Phone No. : ${receiver?.phone}`}
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									secondary={`Address : ${receiver?.address}`}
								/>
							</ListItem>
						</List>
					</Grid>
					{/* Middle Section - Show Chats */}
					<Grid
						item
						xs={12} // On small screens, this will occupy the full width
						md={6} // On medium and larger screens, this will occupy 50% of the width
						sx={{ p: 2, minHeight: "500px", maxHeight: "500px" }}
					>
						<Paper
							sx={{
								flexGrow: 1,
								p: 2,
								overflowY: "auto",
								height: "90%",
								boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
							}}
						>
							<List>
								{messages.map((message) => (
									<ListItem
										key={message._id}
										sx={{
											mb: 1,
											display: "flex",
											textAlign:
												message.userId === sender?._id
													? "right"
													: "left",
											alignItems: "center",
										}}
									>
										{message.userId !== sender?._id && (
											<Avatar
												sx={{ mr: 1 }}
												src={receiver.profilePicture}
											/>
										)}
										<ListItemText
											primaryTypographyProps={{
												color:
													message.userId ===
													sender?._id
														? "primary"
														: "secondary",
											}}
											primary={
												message.userId === sender?._id
													? "You"
													: receiver?.name
											}
											secondary={message.desc}
										/>
										{message.userId === sender?._id && (
											<IconButton
												color="primary"
												onClick={() => {
													handleDeleteMessage(
														message._id
													);
												}}
											>
												<DeleteIcon />
											</IconButton>
										)}
										<div ref={messagesEndRef} />
									</ListItem>
								))}
								{isTyping && (
									<>
										<Lottie
											animationData={typingAnimation}
											loop={true}
											style={{
												width: "50px",
												height: "50px",
											}}
										/>
									</>
								)}
							</List>
						</Paper>
					</Grid>
					{/* Right Section - Show Bids */}
					<Grid
						item
						xs={12} // On small screens, this will occupy the full width
						md={3} // On medium and larger screens, this will occupy 25% of the width
						sx={{
							p: 2,
							display: { xs: "none", md: "block" }, // Hide on small screens, show on medium and larger screens
						}}
					>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Bids
						</Typography>
						<List sx={{ height: "85%", overflowY: "auto" }}>
							{bids.length === 0 && (
								<Typography variant="body1" color="primary">
									Add a bid to start the conversation
								</Typography>
							)}

							{bids.map((bid) => (
								<Box key={bid._id}>
									<ListItem
										sx={{
											mb: 1,
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<ListItemText
											primary={`Bid Amount: Rs .${bid.bidAmount}`}
										/>
										{user.role === "supplier" && (
											<IconButton
												color="primary"
												onClick={() =>
													handleDeleteBid(bid._id)
												}
												disabled={bid.paid}
											>
												<DeleteIcon />
											</IconButton>
										)}
									</ListItem>
									<ListItem>
										<ListItemText
											secondary={`Message : ${bid.message}`}
										/>
									</ListItem>
									{user?.role === "papermaker" && (
										<ListItem>
											<Button
												variant="contained"
												fullWidth
												onClick={() => {
													handleBidState(bid._id);
												}}
												disabled={bid.paid}
											>
												Accept
											</Button>
										</ListItem>
									)}
									<Divider />
								</Box>
							))}
						</List>
					</Grid>
				</Grid>
				<Divider />
				<Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
					{user?.role === "supplier" && (
						<IconButton
							aria-label="delete"
							size="large"
							sx={{ mr: 2 }}
							onClick={() => {
								setIsBidDialogOpen(true);
							}}
						>
							<AddIcon fontSize="inherit" />
						</IconButton>
					)}

					<TextField
						type="text"
						label="Type your message..."
						value={newMessage}
						onChange={(e) => {
							handleTyping();
							setNewMessage(e.target.value);
						}}
						variant="outlined"
						size="small"
						fullWidth
						sx={{ flex: 1 }}
						disabled={bids.length === 0}
					/>
					<Button
						variant="contained"
						onClick={() => {
							handleSendMessage();
							setNewMessage("");
						}}
						sx={{ ml: 2 }}
						disabled={bids.length === 0}
					>
						Send
					</Button>
				</Box>
				{/* Add Bid Dialog */}
				<Dialog
					open={isBidDialogOpen}
					onClose={() => setIsBidDialogOpen(false)}
				>
					<DialogTitle>Add Bid</DialogTitle>
					<DialogContent>
						<TextField
							type="number"
							label="Bid Amount"
							value={bidDetails.bidAmount}
							onChange={(e) =>
								setBidDetails({
									...bidDetails,
									bidAmount: parseFloat(e.target.value),
								})
							}
							variant="outlined"
							fullWidth
							margin="normal"
						/>
						<TextField
							type="text"
							label="Message"
							value={bidDetails.message}
							onChange={(e) =>
								setBidDetails({
									...bidDetails,
									message: e.target.value,
								})
							}
							variant="outlined"
							fullWidth
							multiline
							rows={4}
							margin="normal"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setIsBidDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleAddBid}
							variant="contained"
							color="primary"
						>
							Add Bid
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Container>
	);
};

export default ChatPage;
