"use strict";

const app = require("./app");
const PORT = process.env.PORT || 3100;

app.listen(
	PORT,
	(error) => {
		if (error) {
			return console.error(error);
		} else {
			return console.log("Server has listen at PORT #" + PORT);
		}
	}
);
