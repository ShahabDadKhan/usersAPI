import express from "express";
import { merge, get } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["ANTONIO-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    // This is using a utility function named get, which is commonly found in Lodash.
    // The purpose of get is to safely access nested properties of an object.
    // In this case, it tries to access the _id property nested inside the identity object within the req (request) object.
    // "as string" TypeScript provides a way to assert or cast a value to a specific type using the as keyword.
    // In this line, it's asserting that the result of get(req, "identity._id") is a string.
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(400);
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({
        error:
          "You are not a owner bro! You can delete your own account but not of others",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
