import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["SHAHAB-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      res.sendStatus(403);
    }

    //  Uses the lodash merge function to merge the existingUser object into the req object, adding an identity property to the request.
    //  This is a way to attach user information to the request for later use in the route handlers.
    merge(req, { identiy: existingUser });
    next();
  } catch (error) {
    console.log(error);
  }
};
