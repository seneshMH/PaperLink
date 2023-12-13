import { axiosInstance } from "./axios.instance";

//register user
export const RegisterUser = async (payload) => {
	try {
		const response = await axiosInstance.post(
			"/api/users/register",
			payload
		);

		return response.data;
	} catch (error) {
		return error.message;
	}
};

//upload profile picture
export const UploadProfilePicture = async (payload) => {
	try {
		const response = await axiosInstance.post(
			"/api/users/upload-profile-picture",
			payload
		);

		return response.data;
	} catch (error) {
		return error.message;
	}
};

//login user
export const LoginUser = async (payload) => {
	try {
		const response = await axiosInstance.post("/api/users/login", payload);
		return response.data;
	} catch (error) {
		return error.message;
	}
};

//get current user
export const GetCurrentUser = async () => {
	try {
		const response = await axiosInstance.get("/api/users/get-current-user");
		return response.data;
	} catch (error) {
		return error.message;
	}
};

//get all user
export const GetAllUsers = async () => {
	try {
		const response = await axiosInstance.get("/api/users/get-all-users");
		return response.data;
	} catch (error) {
		return error.message;
	}
};

//Update user status
export const UpdateUserStatus = async (id, status) => {
	try {
		const response = await axiosInstance.put(
			`/api/users/update-user-status/${id}`,
			{ status }
		);
		return response.data;
	} catch (error) {
		return error.message;
	}
};

//Get user by id
export const GetUserById = async (id) => {
	try {
		const response = await axiosInstance.get(`/api/users/get-user-by-id/${id}`);
		return response.data;
	} catch (error) {
		return error.message;
	}
};

//Give rating to user
export const GiveRatingToUser = async (id, payload) => {
	try {
		const response = await axiosInstance.put(
			`/api/users/give-rating-to-user/${id}`,
			payload
		);
		return response.data;
	} catch (error) {
		return error.message;
	}
};
