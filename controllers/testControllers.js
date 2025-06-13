exports.testPath = async (req, res) => {
	res.status(200);
	res.write("testPath is valid");
	res.end();
};
exports.testJWT = async (req, res) => {
	res.status(200);
	res.write("JWT is coming through and auth is valid");
	res.end();
};
