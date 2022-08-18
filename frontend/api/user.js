"use strict";
const agent = require("./agent");

module.exports = {

    login(body) {
        return agent
            .get()
            .post("/api/users/login", body)
            .then(response => response.data);
    },

    register(body) {
        return agent
            .get()
            .post("/api/users", body)
            .then(response => response.data);
    }

};


