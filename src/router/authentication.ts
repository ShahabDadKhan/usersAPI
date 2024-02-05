import express from "express";

import { login, register } from "../controllers/authentication";

// This module exports a function that takes an Express router as its parameter. Inside the function:
// router.post("/auth/register", register);: This line defines an HTTP POST route on the "/auth/
// register" path. When a POST request is made to this path, the register controller function will be invoked to handle the request.
export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
};
