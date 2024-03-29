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
import Orders from "./orders/Orders";

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

function BuyerDashboard() {
	const pages = ["Orders"];
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
					<ListItemButton onClick={() => setPage("Orders")}>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary="Orders" />
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
					{page === "Orders" && <Orders />}
				</Container>
			</Box>
		</Box>
	);
}

export default BuyerDashboard;
