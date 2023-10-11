import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button, Container, TextField, Typography } from "@mui/material";
import { sendMail } from "../../apiCalls/mail";
import { useMessage } from "../../hooks/message/Message";
import { SetLoader } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";

const Section = styled.div`
	min-height: 100vh;
	width: 100vw;
	overflow: hidden;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	background: linear-gradient(
		to right,
		rgba(52, 152, 219, 0.1),
		rgba(41, 128, 185, 0.2)
	);
`;

const FormContainer = styled(Container)`
	background-color: rgba(
		255,
		255,
		255,
		0.8
	); /* Add a semi-transparent white background */
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Add a subtle shadow */
`;

function Contact() {
	const message = useMessage();
	const dispatch = useDispatch();
	const [isEmailInvalid, setIsEmailInvalid] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const name = e.target.name.value;
		const email = e.target.email.value;
		const text = e.target.message.value;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailRegex.test(email);

		try {
			setIsEmailInvalid(!isValidEmail);

			if (!isValidEmail) {
				throw new Error("Invalid email address");
			}

			dispatch(SetLoader(true));
			const response = await sendMail({ name, email, text });

			if (response.success) {
				message.success(response.message);
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
		<Section id="contact">
			<FormContainer maxWidth="md">
				<Typography
					variant="h4"
					sx={{ fontSize: "28px", marginBottom: "1rem" }}
				>
					Contact Us
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Name"
						variant="outlined"
						fullWidth
						margin="normal"
						id="name"
						name="name"
						required
					/>
					<TextField
						label="Email"
						variant="outlined"
						fullWidth
						margin="normal"
						id="email"
						name="email"
						type="email"
						required
						error={isEmailInvalid}
					/>
					<TextField
						label="Message"
						variant="outlined"
						fullWidth
						margin="normal"
						id="message"
						name="message"
						multiline
						rows={4}
						required
					/>
					<Button
						variant="contained"
						color="primary"
						type="submit"
						sx={{
							marginTop: "1rem",
							transition: "background-color 0.3s",
						}}
					>
						Send
					</Button>
				</form>
			</FormContainer>
		</Section>
	);
}

export default Contact;
