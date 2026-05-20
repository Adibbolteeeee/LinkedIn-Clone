import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { ConnectionRequest } from "../models/connections.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

// Helper
const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";

  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  doc.fontSize(14).text("Past Work:");
  userData.pastWork.forEach((work) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();
  return outputPath;
};

// ✅ Register
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }

    const registeredUser = await User.findOne({ email });

    if (!registeredUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, registeredUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "incorrect email or password" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: registeredUser._id }, { token });

    return res.status(201).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Upload Profile Picture
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    return res.status(200).json({ message: "Profile picture updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Update User
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res.status(400).json({ message: "User already exists" });
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get User + Profile
export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({
      userId: user._id,
    }).populate("userId", "name email username profilePicture");

    return res.status(200).json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update Profile
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token });

    if (!userProfile) {
      return res.status(404).json({ message: "user not found" });
    }

    const profileToUpdate = await Profile.findOne({
      userId: userProfile._id,
    });

    if (!profileToUpdate) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profileToUpdate, newProfileData);
    await profileToUpdate.save();

    return res.json({
      message: "Profile updated successfully",
      profile: profileToUpdate,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Users
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture",
    );

    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Download Profile
export const downloadProfile = async (req, res) => {
  const { id } = req.query;

  try {
    const userProfile = await Profile.findOne({
      userId: id,
    }).populate("userId", "name username email profilePicture");

    if (!userProfile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const outputPath = await convertUserDataToPDF(userProfile);

    return res.json({
      url: outputPath,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ✅ Send Connection Request
export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request sent" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get My Requests
export const getMyConnectionRequests = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json(connections);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Incoming requests
    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json(connections);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findById(requestId);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (connection.status_accepted === true) {
      return res.status(400).json({
        message: "Request already accepted",
      });
    }

    connection.status_accepted = action === "accept";

    await connection.save();

    return res.json({
      message: "Request Updated",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({
      userId: user._id,
    }).populate("userId", "name email username profilePicture");

    return res.json({ user: userProfile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
