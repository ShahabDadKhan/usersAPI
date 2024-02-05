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
      return res.status(400).json({ error: "User already exist" });
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
      res.status(400).json({ error: "Email or Password is missing" });
    }

    // Fetching the user, This function is presumably responsible for querying the database to find and retrieve a user based on the provided email address.
    // The select method is used to specify which fields should be included in the result.
    // In this case, it includes the "authentication.salt" and "authentication.password" fields.
    // The + before each field indicates that these fields should be explicitly included in the result.
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    // Authentication is a function that generates a hash
    const expectedHash = authentication(user.authentication.salt, password);

    console.log("AYA", expectedHash);
    console.log("@nd", user.authentication.password);
    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ error: "Incorrect Password" });
    }

    // Generating a random value
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    // .save(), This method is a standard method provided by many ORM libraries for persisting changes to the database.
    // When called, it updates the corresponding record in the database with the current state of the object.
    await user.save();

    // Set a cookie named "SHAHAB-AUTH" with the sessionToken
    res.cookie("SHAHAB-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json({ user }).end();
  } catch (error) {
    return res.sendStatus(400);
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
