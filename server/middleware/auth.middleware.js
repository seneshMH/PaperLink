import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
	try {
		// Check if the "Authorization" header is present
		const authorizationHeader = req.header("authorization");

		// Get the token from the header
		const token = authorizationHeader.split(" ")[1];

		if (token === "null") {
			return res.send({
				success: false,
				message: "Access denied please login to continue",
			});
		}

		const decryptToken = jwt.verify(token, process.env.JWT_KEY);

		req.body.userId = decryptToken.userId;

		next();
	} catch (error) {
		res.send({
			success: false,
			message: error.message,
		});
	}
};

export default authMiddleware;

