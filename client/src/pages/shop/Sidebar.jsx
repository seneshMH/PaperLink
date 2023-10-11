import React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ClassIcon from "@mui/icons-material/Class";
import { Collapse, Divider } from "@mui/material";

function Sidebar({ setFilters, filters }) {
	const [checked, setChecked] = React.useState([]);

	const [open, setOpen] = React.useState(true);

	const handleClick = () => {
		setOpen(!open);
	};

	const categories = [
		"A0",
		"A1",
		"A2",
		"A3",
		"A4",
		"A5",
		"A6",
		"A7",
		"A8",
		"A9",
	];

	const handleToggle = (index, value) => () => {
		const currentIndex = checked.indexOf(index);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(index);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);

		const selectedCategories = newChecked.map((idx) => categories[idx]);
		setFilters({ ...filters, category: selectedCategories });
	};
	return (
		<Box
			sx={{
				borderRight: "1px solid #ccc",
				borderRadius: "4px",
				padding: "8px",
				height: "100vh",
			}}
		>
			<List
				sx={{
					width: "100%",
					maxWidth: 360,
					bgcolor: "background.paper",
				}}
				disablePadding
			>
				<ListItemText primary="Filters" />
				<Divider />
				<List component="div" disablePadding>
					<ListItemButton onClick={handleClick}>
						<ListItemIcon>
							<ClassIcon />
						</ListItemIcon>
						<ListItemText secondary="Categories" />
						{open ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							{categories.map((value, index) => {
								const labelId = `checkbox-list-label-${value}`;

								return (
									<ListItem key={index} disablePadding>
										<ListItemButton
											role={undefined}
											onClick={handleToggle(index, value)}
											dense
											disablePadding
										>
											<ListItemIcon>
												<Checkbox
													edge="start"
													checked={checked.includes(
														index
													)}
													tabIndex={-1}
													disableRipple
													inputProps={{
														"aria-labelledby":
															labelId,
													}}
												/>
											</ListItemIcon>
											<ListItemText
												id={labelId}
												primary={`${value} papers`}
											/>
										</ListItemButton>
									</ListItem>
								);
							})}
						</List>
					</Collapse>
				</List>
			</List>
		</Box>
	);
}

export default Sidebar;
