import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { sub, name, email, picture } = req.auth; // Auth0 user data

    let user = await User.findOne({ auth0Id: sub });
    if (!user) {
      user = new User({ auth0Id: sub, name, email, profilePic: picture });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.auth.sub });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
