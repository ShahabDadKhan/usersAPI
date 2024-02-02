import express from "express";
// import authentication from "./authentication";
import authentication from "./authentication";
const router = express.Router();

// This module exports a default function. The function, when invoked, returns the router instance created earlier.
// The function has a return type of express.Router, indicating that the returned value should be an Express router.
export default (): express.Router => {
  authentication(router);
  return router;
};
