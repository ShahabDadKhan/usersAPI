import express from "express";
import { createUser, getUserByEmail, deleteUserById } from "../db/users";
import { authentication, random } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Extract data from the request body (assuming JSON format)
    const { email, password, username } = req.body;
    console.log("AYa", req.body);
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

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email or Password did not match" });
    }

    const user = await getUserByEmail(email).select(
      "authentication.salt +authentication.passowrd"
    );
  } catch (error) {
    res.sendStatus(400);
  }
};

// export const removeUser = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { id } = req.body;

//     if (!id) {
//       res.status(400).json({ error: "User doesn't exit" });
//     }

//     const user = await deleteUserById();
//   } catch (error) {
//     res.sendStatus(400);
//   }
// };
