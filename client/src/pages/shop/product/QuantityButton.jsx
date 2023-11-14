import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material";

const QuantityButton = ({ onQuant, onRemove, onAdd }) => {
	return (
		<div className="amount">
			<IconButton
				className="minus"
				onClick={onRemove}
				disabled={onQuant === 0}
			>
				<RemoveIcon />
			</IconButton>
			<p>{onQuant}</p>
			<IconButton
				className="plus"
				onClick={onAdd}
				disabled={onQuant === 100}
			>
				<AddIcon />
			</IconButton>
		</div>
	);
};

export default QuantityButton;
