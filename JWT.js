const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
	const accessToken = sign(
		{ username: user.username, id: user.id },
		"supersecretkey"
	);

	return accessToken;
};

const validateToken = (req, res, next) => {
	const accessToken = req.cookies["access-token"];

	if (!accessToken)
		return res.status(400).json({ error: "USER NOT AUTHENTICATED" });

	try {
		const validToken = verify(accessToken, "supersecretkey");
		if (validToken) {
			req.authenticated = true;
			return next();
		}
	} catch (error) {
		res.status(400).json({ error: error });
	}
};

module.exports = { createTokens, validateToken };
