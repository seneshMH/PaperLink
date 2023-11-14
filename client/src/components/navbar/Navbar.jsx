import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Badge } from "@mui/material";

import Notification from "./notification/Notification";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "../../hooks/message/Message";
import { ReadAllNotifications } from "../../apiCalls/notifications";
import { SetUser } from "../../redux/userSlice";

import logo from "./plLogo.png";
import { useState } from "react";
import Cart from "./cart/Cart";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";

function NavBar({ hideIcons }) {
	const [showNotifications, setShowNotifications] = useState(false);
	const [showCart, setShowCart] = useState(false);
	const { cartItems, addToCart, removeFromCart, updateCartItemQuantity } =
		useCart();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const message = useMessage();
	const { user } = useSelector((state) => state.users);
	const { notifications } = useNotification();

	const handleClose = () => {
		setAnchorElNav(null);
		setAnchorElUser(null);
	};

	const readNotifications = async () => {
		try {
			const response = await ReadAllNotifications();
			if (response.success) {
				notifications?.map(
					(notification) => (notification.read = true)
				);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<>
			<AppBar position="sticky">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								mr: 1,
							}}
						>
							<img
								src={logo}
								alt="logo"
								width={"140px"}
								height={"50px"}
							/>
						</Box>

						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "flex", md: "none" },
							}}
						>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								<MenuItem
									onClick={() => {
										handleCloseNavMenu();
										navigate("/");
									}}
								>
									<Typography textAlign="center">
										HOME
									</Typography>
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleCloseNavMenu();
										navigate("/aboutUS");
									}}
								>
									<Typography textAlign="center">
										ABOUT
									</Typography>
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleCloseNavMenu();
										navigate("/shop");
									}}
								>
									<Typography textAlign="center">
										SHOP
									</Typography>
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleCloseNavMenu();
										navigate("/contactUS");
									}}
								>
									<Typography textAlign="center">
										CONTACT US
									</Typography>
								</MenuItem>
							</Menu>
						</Box>

						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
							}}
						>
							<Button
								onClick={() => {
									handleCloseNavMenu();
									navigate("/");
								}}
								sx={{
									my: 2,
									color: "white",
									display: "block",
								}}
							>
								HOME
							</Button>
							<Button
								onClick={() => {
									handleCloseNavMenu();
									navigate("/aboutUS");
								}}
								sx={{
									my: 2,
									color: "white",
									display: "block",
								}}
							>
								ABOUT
							</Button>
							<Button
								onClick={() => {
									handleCloseNavMenu();
									navigate("/shop");
								}}
								sx={{
									my: 2,
									color: "white",
									display: "block",
								}}
							>
								SHOP
							</Button>
							<Button
								onClick={() => {
									handleCloseNavMenu();
									navigate("/contactUS");
								}}
								sx={{
									my: 2,
									color: "white",
									display: "block",
								}}
							>
								CONTACT US
							</Button>
						</Box>

						{!hideIcons && (
							<Box sx={{ flexGrow: 0 }}>
								<IconButton
									color="inherit"
									onClick={() => {
										setShowNotifications(true);
										readNotifications();
									}}
								>
									<Badge
										badgeContent={
											notifications?.filter(
												(notification) =>
													!notification.read
											).length
										}
										color="error"
									>
										<NotificationsIcon />
									</Badge>
								</IconButton>
								<IconButton
									color="inherit"
									onClick={() => {
										setShowCart(true);
									}}
								>
									<Badge
										badgeContent={cartItems?.length}
										color="error"
									>
										<ShoppingCartIcon />
									</Badge>
								</IconButton>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<Tooltip title="Open settings">
									<IconButton
										onClick={handleOpenUserMenu}
										sx={{ p: 0 }}
									>
										<Avatar
											alt="profile"
											src={user.profilePicture}
										/>
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: "45px" }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									keepMounted
									transformOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									<MenuItem onClick={handleClose}>
										<Typography>
											{user.name}&nbsp;({user.role})
										</Typography>
									</MenuItem>
									<MenuItem
										onClick={() => {
											if (user.role === "admin") {
												navigate("/admin-dashboard");
											} else if (
												user.role === "papermaker"
											) {
												navigate(
													"/papermaker-dashboard"
												);
											} else if (
												user.role === "supplier"
											) {
												navigate("/supplier-dashboard");
											} else if (user.role === "buyer") {
												navigate("/buyer-dashboard");
											}
											handleClose();
										}}
									>
										Dashboard
									</MenuItem>
									<MenuItem
										onClick={() => {
											localStorage.clear();
											dispatch(SetUser(null));
											handleClose();
											window.location.href = "/";
										}}
									>
										Logout
									</MenuItem>
								</Menu>
							</Box>
						)}
						{hideIcons && (
							<Box sx={{ flexGrow: 0 }}>
								<Button
									color="inherit"
									endIcon={<LoginIcon />}
									onClick={() => {
										navigate("/login");
									}}
								>
									LOGIN
								</Button>
								&nbsp;&nbsp;
								<Button
									color="inherit"
									endIcon={<HowToRegIcon />}
									onClick={() => {
										navigate("/register");
									}}
								>
									REGISTER
								</Button>
							</Box>
						)}
					</Toolbar>
				</Container>
			</AppBar>
			<Notification
				showNotifications={showNotifications}
				setShowNotifications={setShowNotifications}
			/>
			<Cart
				showCart={showCart}
				setShowCart={setShowCart}
				cartItems={cartItems}
				addToCart={addToCart}
				removeFromCart={removeFromCart}
				updateCartItemQuantity={updateCartItemQuantity}
			/>
		</>
	);
}
export default NavBar;
