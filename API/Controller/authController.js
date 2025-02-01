import User from "../Modals/user.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../Utils/error.js"
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password, Stream } = req.body;

  // Check if password is provided
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 15);

    // Create a new user with the hashed passwor
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      Stream,
    });

    // Save the new user
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Pass any error to the error handling middleware
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); //1hour
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// export const google = async (req, res, next) => {
//     try {
//       const validUser = await User.findOne({
//         email: req.body.email,
//       });

//       if (validUser) {
//         const token = jwt.sign(
//           { id: validUser._id },
//           process.env.JWT_SECRET // secret key
//         );
//         const { password: hashPassword, ...user } = validUser._doc;

//         const expiryDate = new Date(Date.now() + 3600000); // 1 hour

//         // send the token and user details as a response
//         res
//           .cookie("access_token", token, {
//             httpOnly: true,
//             secure: true,
//             expires: expiryDate,
//             sameSite: "None",
//           })
//           .status(200)
//           .send({
//             message: "User logged in successfully",
//             user,
//           });
//       } else {
//         const generatedPassword = Math.random().toString(36).slice(-8);

//         const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

//         const { name, email, photo, role } = req.body;
//         console.log(req.body);
//         const newUser = new User({
//           name:
//             name.split(" ").join("").toLowerCase() +
//             Math.floor(Math.random() * 1000).toString(),
//           email,
//           role,
//           password: hashedPassword,
//           profilePicture: photo,
//         });

//         await newUser.save();
//         const validUser = await User.findOne({
//           email: req.body.email,
//         });

//         const token = jwt.sign(
//           { id: validUser._id },
//           process.env.JWT_SECRET // secret key
//         );

//         const expiryDate = new Date(Date.now() + 3600000); // 1 hour

//         const { password: hashPassword, ...user } = validUser._doc;

//         res
//           .cookie("access_token", token, {
//             httpOnly: true,
//             secure: true,
//             expires: expiryDate,
//             sameSite: "None",
//           })
//           .status(200)
//           .send({
//             message: "User created and logged in successfully",
//             user,
//           });
//       }
//     } catch (error) {
//       next(error); // send an error response if there is an error
//     }
//   };

// export const google = async (req, res, next) => {
//   try {
//     const validUser = await User.findOne({
//       email: req.body.email,
//     });

//     if (validUser) {
//       const token = jwt.sign(
//         { id: validUser._id },
//         process.env.JWT_SECRET // secret key
//       );
//       const { password: hashPassword, ...user } = validUser._doc;

//       const expiryDate = new Date(Date.now() + 3600000); // 1 hour

//       // send the token and user details as a response
//       res
//         .cookie("access_token", token, {
//           httpOnly: true,
//           secure: true,
//           expires: expiryDate,
//           sameSite: "None",
//         })
//         .status(200)
//         .send({
//           message: "User logged in successfully",
//           user,
//         });
//     } else {
//       if (User) {
//         const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);
//         const { password: hashedPassword, ...rest } = User._doc;
//         const expiryDate = new Date(Date.now() + 3600000); //1hour
//         res
//           .cookie("access_token", token, {
//             httpOnly: true,
//             expires: expiryDate,
//           })
//           .status(200)
//           .json(rest);
//       } else {
//         const generatedPassword =
//           Math.random().toString(36).slice(-8) +
//           Math.random().toString(36).slice(-8);
//         const hashedPassword = bcryptjs.hashSync(generatedPassword, 15);
//         const newUser = new User({
//           username:
//             req.body.name.split("").join("").toLowerCase() +
//             Math.floor(Math.random * 10000).toString(),
//           email: req.body.email,
//           password: hashedPassword,
//           profilePicture: req.body.photo,
//         });
//         await newUser.save();
//         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//         const { password: hashedPassword2, ...rest } = newUser._doc;
//         res
//           .cookie("access_token", token, {
//             httpOnly: true,
//             expires: expiryDate,
//           })
//           .status(200)
//           .json(rest);
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const google = async (req, res, next) => {
  const { username, email, photo, stream } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (validUser) {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password, ...user } = validUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 3600000), // 1 hour
          sameSite: "None",
        })
        .status(200)
        .send({
          message: "User logged in successfully",
          user,
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 15);
      const newUser = new User({
        username:
          username.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email,
        password: hashedPassword,
        profilePicture: photo,
        Stream: stream,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 3600000), // 1 hour
          sameSite: "None",
        })
        .status(200)
        .json({
          message: "User registered and logged in successfully",
          user: rest,
        });
    }
  } catch (error) {
    // Improved error handling
    console.error(error);
    if (error.message.includes("buffering timed out")) {
      res.status(500).send({
        success: false,
        message: "Database operation timed out. Please try again later.",
      });
    } else {
      next(error);
    }
  }
};