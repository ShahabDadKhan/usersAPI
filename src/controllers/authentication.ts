import { createUser, getUserByEmail } from "db/users";
import express from "express";
import { authentication, random } from "helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Extract data from the request body (assuming JSON format)
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required field" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ error: "User already exist" });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    // Respond with an error message
    res.sendStatus(400);
  }
};
