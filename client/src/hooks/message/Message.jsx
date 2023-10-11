import { useSnackbar } from "notistack";

export const useMessage = () => {
	const { enqueueSnackbar } = useSnackbar();

	const success = (message) => {
		enqueueSnackbar(message, { variant: "success" });
	};

	const error = (message) => {
		enqueueSnackbar(message, { variant: "error" });
	};

	return { success, error };
};
