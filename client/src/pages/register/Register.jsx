import React, { useState } from "react";
import {
	Container,
	Typography,
	TextField,
	Button,
	Link,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	styled,
	Grid,
	Box,
	Avatar,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { useMessage } from "../../hooks/message/Message";
import { RegisterUser, UploadProfilePicture } from "../../apiCalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";

const MyContainer = styled(Container)(({ theme }) => ({
	marginTop: theme.spacing(2),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
}));

const MyForm = styled("form")(({ theme }) => ({
	width: "100%",
	marginTop: theme.spacing(1),
}));

const MySubmitButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(3, 0, 2),
}));

const RegistrationPage = () => {
	const [role, setRole] = useState("buyer"); // State for selected role

	const [isEmailInvalid, setIsEmailInvalid] = useState(false);
	const [arePasswordsMismatched, setArePasswordsMismatched] = useState(false);
	const [isPhoneValid, setIsPhoneValid] = useState(false);
	const [profilePicture, setProfilePicture] = useState(null);

	const message = useMessage();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleRoleChange = (e) => {
		setRole(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const name = e.target.name.value;
		const email = e.target.email.value;
		const address = e.target.address.value;
		const phone = e.target.phone.value;
		const password = e.target.password.value;
		const confirmPassword = e.target.confirmPassword.value;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailRegex.test(email);

		const phoneRegex = /^\d{10}$/;
		const isValidPhone = phoneRegex.test(phone);

		try {
			setIsEmailInvalid(!isValidEmail);
			setArePasswordsMismatched(password !== confirmPassword);
			setIsPhoneValid(!isValidPhone);

			if (!isValidEmail) {
				throw new Error("Invalid email address");
			}

			if (password !== confirmPassword) {
				throw new Error("Passwords do not match");
			}

			if (!isValidPhone) {
				throw new Error("Invalid phone number");
			}

			const payload = {
				name,
				email,
				address,
				phone,
				password,
				role,
			};

			dispatch(SetLoader(true));
			const response = await RegisterUser(payload);

			if (response.success) {
				message.success(response.message);

				if (profilePicture) {
					const formData = new FormData();
					formData.append("file", profilePicture);
					formData.append("user", response.data._id);

					const uploadResponse = await UploadProfilePicture(formData);

					if (uploadResponse.success) {
						message.success(uploadResponse.message);
					} else {
						throw new Error(uploadResponse.message);
					}
				}

				navigate("/login");
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		} finally {
			dispatch(SetLoader(false));
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setProfilePicture(file);
	};

	return (
		<>
			<Navbar hideIcons={true} />
			<MyContainer component="main" maxWidth="sm">
				<Avatar
					sx={{ width: 40, height: 40 }}
					alt="profile"
					src={profilePicture && URL.createObjectURL(profilePicture)}
				/>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<MyForm onSubmit={handleSubmit}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							gap: "10px",
						}}
					>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="name"
							label="Name"
							name="name"
							autoFocus
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							error={isEmailInvalid}
						/>
					</Box>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="address"
						label="Address"
						name="address"
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="phone"
						label="Phone"
						name="phone"
						type="number"
						error={isPhoneValid}
					/>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							gap: "10px",
						}}
					>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							error={arePasswordsMismatched}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							autoComplete="current-password"
							error={arePasswordsMismatched}
						/>
					</Box>
					<FormControl component="fieldset" sx={{ mt: 2 }}>
						<FormLabel component="legend">Who You Are</FormLabel>
						<RadioGroup
							aria-label="Who You Are"
							name="role"
							value={role}
							onChange={handleRoleChange}
						>
							<Grid container spacing={1}>
								<Grid item>
									<FormControlLabel
										value="buyer"
										control={<Radio />}
										label="Buyer"
									/>
								</Grid>
								<Grid item>
									<FormControlLabel
										value="papermaker"
										control={<Radio />}
										label="Papermaker"
									/>
								</Grid>
								<Grid item>
									<FormControlLabel
										value="supplier"
										control={<Radio />}
										label="Supplier"
									/>
								</Grid>
							</Grid>
						</RadioGroup>
					</FormControl>
					{/* Add file upload field for profile picture */}
					<Button
						variant="contained"
						component="label"
						fullWidth
						sx={{ mt: 2 }}
					>
						Upload Profile Picture
						<input
							accept="image/*"
							id="image-upload"
							type="file"
							hidden
							onChange={handleFileChange}
						/>
					</Button>
					<MySubmitButton
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign Up
					</MySubmitButton>
				</MyForm>

				<Grid container>
					<Grid item>
						<Link href="/login" variant="body2">
							Already have an account? Sign in
						</Link>
					</Grid>
				</Grid>
			</MyContainer>
			<Footer />
		</>
	);
};

export default RegistrationPage;
