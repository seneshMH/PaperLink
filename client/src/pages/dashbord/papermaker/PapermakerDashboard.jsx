import React from "react";

import Box from "@mui/material/Box";
import {
	Container,
	Divider,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import styled from "@emotion/styled";

import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

import NewspaperIcon from "@mui/icons-material/Newspaper";
import Product from "./product/Product";
import Advertisments from "./advertisments/Advertisments";
import Bids from "./bids/Bids";
import Orders from "./orders/Orders";
import Payments from "./payments/Payments";
import { Payment } from "@mui/icons-material";
import PaidBids from "./paidbids/PaidBids";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		border: "none",
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",
		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

function PapermakerDashboard() {
	const pages = [
		"Products",
		"Advertismetns",
		"Bids",
		"Paid Bids",
		"Orders",
		"Payments",
	];
	const [page, setPage] = React.useState(pages[0]);
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	return (
		<Box
			sx={{
				display: "flex",
				position: "fixed",
			}}
		>
			<Drawer
				variant="permanent"
				open={open}
				sx={{ borderRight: "1px solid gray" }}
			>
				<Toolbar
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						px: [1],
					}}
				>
					<EnergySavingsLeafIcon
						sx={{
							display: { xs: "none", md: "flex" },
							mr: 1,
						}}
					/>
					<Typography variant="h5" noWrap component="div" p={2}>
						Paper Link
					</Typography>
					<IconButton onClick={toggleDrawer}>
						<ChevronLeftIcon />
					</IconButton>
				</Toolbar>

				<Divider />
				<List component="nav" sx={{ height: "100%" }}>
					<ListItemButton onClick={() => setPage("Products")}>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary="Products" />
					</ListItemButton>
					<Divider sx={{ my: 1 }} />
					<ListItemButton onClick={() => setPage("Advertismetns")}>
						<ListItemIcon>
							<NewspaperIcon />
						</ListItemIcon>
						<ListItemText primary="Advertismetns" />
					</ListItemButton>
					<Divider sx={{ my: 1 }} />
					<ListItemButton onClick={() => setPage("Bids")}>
						<ListItemIcon>
							<PointOfSaleIcon />
						</ListItemIcon>
						<ListItemText primary="Bids" />
					</ListItemButton>
					<Divider sx={{ my: 1 }} />
					<ListItemButton onClick={() => setPage("Paid Bids")}>
						<ListItemIcon>
							<MonetizationOnIcon />
						</ListItemIcon>
						<ListItemText primary="Paid Bids" />
					</ListItemButton>
					<Divider sx={{ my: 1 }} />
					<ListItemButton onClick={() => setPage("Orders")}>
						<ListItemIcon>
							<InventoryIcon />
						</ListItemIcon>
						<ListItemText primary="Orders" />
					</ListItemButton>
					<Divider sx={{ my: 1 }} />
					<ListItemButton onClick={() => setPage("Payments")}>
						<ListItemIcon>
							<Payment />
						</ListItemIcon>
						<ListItemText primary="Payments" />
					</ListItemButton>
					<Divider sx={{ my: 1 }} />
				</List>
			</Drawer>
			<Box
				component="main"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === "light"
							? theme.palette.grey[100]
							: theme.palette.grey[900],
					flexGrow: 1,
					width: `calc(100vw - ${open ? drawerWidth : 24}px)`,
					height: "100vh",
					overflow: "auto",
				}}
			>
				<Container maxWidth="lg" sx={{ mt: 2, mb: 6 }}>
					{page === "Products" && <Product />}
					{page === "Advertismetns" && <Advertisments />}
					{page === "Bids" && <Bids />}
					{page === "Paid Bids" && <PaidBids />}
					{page === "Orders" && <Orders />}
					{page === "Payments" && <Payments />}
				</Container>
			</Box>
		</Box>
	);
}

export default PapermakerDashboard;
