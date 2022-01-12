const express = require("express");
const app = express();
const db = require("./models");
const { Users } = require("./models");

const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/register", (req, res) => {
	const { username, password } = req.body;
	bcrypt.hash(password, 10).then((hash) => {
		Users.create({
			username: username,
			password: hash
		})
			.then(() => {
				res.json("USER REGISTERED");
			})
			.catch((err) => {
				if (err) {
					res.status(400).json({ error: err });
				}
			});
	});
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await Users.findOne({ where: { username: username } });

	if (!user) res.status(400).json({ error: "User does not exist" });

	const dbPassword = user.password;
	await bcrypt.compare(password, dbPassword).then((match) => {
		if (!match) {
			res
				.status(400)
				.json({ error: "Wrong username and password combination" });
		}
	});

	res.json("LOGGED IN");
});

app.get("/profile", (req, res) => {
	res.json("profile");
});

db.sequelize.sync().then(() => {
	app.listen(3001, () => {
		console.log("SERVER RUNNING ON PORT 3001");
	});
});
