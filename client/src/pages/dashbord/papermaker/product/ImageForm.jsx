import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	ImageList,
	ImageListItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch } from "react-redux";
import { SetLoader } from "../../../../redux/loaderSlice";
import {
	DeleteProductImage,
	UploadProductImage,
} from "../../../../apiCalls/products";

import { useMessage } from "../../../../hooks/message/Message";

function ImageForm({
	showImageForm,
	setShowImageForm,
	selectedProduct,
	setSelectedProduct,
	getData,
}) {
	const message = useMessage();
	const [images, setImages] = useState(selectedProduct.images || []);
	const dispatch = useDispatch();
	const [files, setFiles] = useState([]);

	const handleFileChange = (event) => {
		const selectedFiles = Array.from(event.target.files);
		setFiles([...files, ...selectedFiles]);
	};

	const handleDelete = async (index) => {
		try {
			if (selectedProduct.images && selectedProduct.images.length > 0) {
				const secureUrl = String(selectedProduct.images[index]);
				dispatch(SetLoader(true));
				const response = await DeleteProductImage({
					imgUrl: secureUrl,
					productId: selectedProduct._id,
					index: index,
				});
				dispatch(SetLoader(false));
				if (response.success) {
					message.success(response.message);
				} else {
					throw new Error(response.message);
				}

				const newImages = [...images];
				newImages.splice(index, 1);
				setImages(newImages);
				getData();
			} else {
				const newFiles = [...files];
				newFiles.splice(index, 1);
				setFiles(newFiles);
			}
		} catch (error) {
			console.log(error.message);
			dispatch(SetLoader(false));
			message.error(error.message);
		}
	};

	/*
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file);
            });
            formData.append("productId", selectedProduct._id);

            dispatch(SetLoader(true));
            const response = await UploadProductImages(formData);
            dispatch(SetLoader(false));

            console.log(response);

            if (response.success) {
                dispatch(SetLoader(false));
                setImages([...images, ...response.data]); // Use spread operator to merge the new images
                getData();
            } else {
                throw new Error(response.message);
            }

            setFiles([]);
        } catch (error) {
            dispatch(SetLoader(false));
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };
    */

	const handleUpload = async () => {
		try {
			dispatch(SetLoader(true));
			const uploadPromises = files.map(async (file) => {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("productId", selectedProduct._id);

				const response = await UploadProductImage(formData);

				if (response.success) {
					setImages([...images, ...response.data]); // Use spread operator to merge the new images
					getData();
				} else {
					throw new Error(response.message);
				}

				return response;
			});

			setShowImageForm(false);

			const responses = await Promise.all(uploadPromises);
			responses.forEach((response) => {
				if (response.success) {
					message.success(response.message);
				}
			});

			setFiles([]);
			dispatch(SetLoader(false));
		} catch (error) {
			dispatch(SetLoader(false));
			message.error(error.message);
		}
	};

	useEffect(() => {
		if (selectedProduct.images) {
			setImages(selectedProduct.images); // Set initial images if available
		}
	}, [selectedProduct.images]);

	return (
		<>
			<Box>
				<Dialog
					open={showImageForm}
					onClose={() => {
						setShowImageForm(false);
						setFiles([]);
					}}
					PaperProps={{
						sx: {
							width: "500px",
						},
					}}
				>
					<DialogTitle>Add Images</DialogTitle>
					<DialogContent>
						<div>
							<input
								accept="image/*"
								id="image-upload"
								multiple
								type="file"
								style={{ display: "none" }}
								onChange={handleFileChange}
							/>
							<label htmlFor="image-upload">
								<Button
									variant="outlined"
									component="span"
									aria-label="upload"
									endIcon={<CloudUploadIcon />}
								>
									Select Images to Upload
								</Button>
							</label>
							<ImageList
								variant={"quilted"}
								cols={4}
								rowHeight={100}
								gap={8}
							>
								{images.map((image, index) => (
									<ImageListItem
										key={index}
										sx={{
											position: "relative",
											"& img": {
												width: "100%",
												height: "100%",
												objectFit: "cover",
											},
											"& .deleteButton": {
												position: "absolute",
												top: 2,
												right: 2,
											},
										}}
									>
										<img src={image} alt={`${index + 1}`} />

										<IconButton
											aria-label="delete"
											onClick={() => handleDelete(index)}
											className="deleteButton"
										>
											<DeleteIcon />
										</IconButton>
									</ImageListItem>
								))}
								{files.map((file, index) => (
									<ImageListItem
										key={index}
										sx={{
											position: "relative",
											"& img": {
												width: "100%",
												height: "100%",
												objectFit: "cover",
											},
											"& .deleteButton": {
												position: "absolute",
												top: 2,
												right: 2,
											},
										}}
									>
										<img
											src={URL.createObjectURL(file)}
											alt={`Preview ${index + 1}`}
										/>

										<IconButton
											aria-label="delete"
											onClick={() => handleDelete(index)}
											className="deleteButton"
										>
											<DeleteIcon />
										</IconButton>
									</ImageListItem>
								))}
							</ImageList>
						</div>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowImageForm(false)}>
							Cancel
						</Button>
						{files.length > 0 && (
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleUpload()}
							>
								Upload
							</Button>
						)}
					</DialogActions>
				</Dialog>
			</Box>
		</>
	);
}

export default ImageForm;
