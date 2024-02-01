import mongoose, { Schema } from "mongoose";

// In Mongoose, the mongoose.Schema method is used to create a schema for defining the structure of documents in a MongoDB collection.
const UserScheme = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    // This field likely stores the hashed password. It is marked as required: true, meaning every document must have a hashed password.
    password: { type: String, required: true, select: false },
    //  This field likely stores the unique salt associated with a user. It is marked as required: false, meaning it's optional. If present, it is used in combination with the user's password during the hashing process.
    salt: { type: String, required: false },
    //  This field is not directly related to password hashing and may be used for storing a session token for authentication purposes. It is also marked as required: false.
    sessionToken: { type: String, required: false },
  },

  // Typically, during user registration or password update, a new random salt is generated, combined with the user's password, and then hashed.
  // The hashed password and the salt are then stored in the database. During login, the stored salt is retrieved, combined with the entered password, hashed, and compared to the stored hashed password.
  // This use of a unique salt for each user enhances the security of the password storage by ensuring that even users with the same password will have different hashed passwords in the database.
});

// "mongoose.model" is a method provided by Mongoose to create a model.
// The first argument, "User", is the name of the MongoDB collection. This is the name you'll use to interact with the MongoDB collection in your code.
// The second argument, UserScheme, is the Mongoose schema that defines the structure of the documents in the collection.
export const UserModel = mongoose.model("User", UserScheme);
// UserModel is a variable that now holds the Mongoose model for the "User" collection,
// and it can be used to perform CRUD (Create, Read, Update, Delete) operations on documents in that collection.

export const getUsers = () => UserModel.find();
// ".findOne({ email })" is a Mongoose query method that searches for a document in the collection where the email field matches the provided email parameter.
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);

// This part creates a new instance of the Mongoose model UserModel, representing a new user document.
// The values parameter is passed to the model constructor, presumably containing the data for the new user.
// In TypeScript, Record<string, any> is a generic type that is often used to represent an object with string keys and values of any type.
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
// The save() method is a Mongoose method that persists the newly created user document to the MongoDB "User" collection.
// It returns a Promise that resolves to the saved user document.
// The then() method is used to handle the resolution of the Promise returned by save().
// It takes a callback function that receives the saved user document as the user parameter.
// user.toObject() is called to convert the Mongoose document to a plain JavaScript object.
// This step is often done to remove any Mongoose-specific properties and methods, leaving only the raw data.

// So, the overall purpose of the createUser function is to take user data (values), create a new user document using the UserModel,
// save it to the "User" collection in MongoDB, and then return the saved user data as a plain JavaScript object.

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
// id is the identifier of the user you want to update.
// values is the object containing the new values that you want to set for the user.
