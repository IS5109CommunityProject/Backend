import bcryptjs from 'bcryptjs';
import User from '../Modals/user.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working',
    });
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    // Bcrypt the password if provided
    let hashedPassword = null;
    if (req.body.password) {
      hashedPassword = await bcryptjs.hash(req.body.password, 10);
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword, // Set the hashed password
        },
      },
      { new: true }
    );

    // Remove password from the response
    const { password, ...userData } = updatedUser._doc;

    // Send updated user data in the response
    res.status(200).json(userData);
  } catch (error) {
    // Handle errors
    console.error('Error updating user:', error);
    next(error);
  }
};

export const userDelete = async (req, res, next) => {
  const id = req.params.id;

  try {
    // Find the user first by _id
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email } = user;

    // Then delete the user by _id
    await User.findOneAndDelete({ _id: id });

    // Respond with success message and deleted user's email
    res.status(200).json({ message: "User deleted successfully", deletedUser: { email } });

  } catch (error) {
    next(error);
  }
};
