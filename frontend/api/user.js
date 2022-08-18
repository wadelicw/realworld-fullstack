"use strict";
const agent = require("./agent");

module.exports = {

    login(user) {
        return agent
            .get()
            .post("/api/users/login", { user })
            .then(response => response.data);
    },

    register(body) {
        return agent
            .get()
            .post("/api/users", body)
            .then(response => response.data);
    }

};


