const bcrypt = require("bcrypt");

const userModel = require("../../models/userModel");
const hash = require("../../utils/toHash");
const otp = require("../../utils/sendOtp");

const loadSignUp = (req, res) => {
  try {
    res.render("auth/signup", { message: null });
  } catch (error) {
    res.render("user/404page");
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userData = await userModel.findOne({ email: email });

    if (userData) {
      res.render("auth/signup", { message: "This email has another account" });
    } else {
      const passwordHash = await hash(password);
      const newUser = userModel({
        username: username,
        email: email,
        password: passwordHash,
      });

      const savedUser = await newUser.save();
      const options = {
        maxAge: 1000 * 60 * 2,
        httpOnly: true,
      };

      const result = await otp.sendOtp(savedUser);
      res.cookie("hashOtp", result, { httpOnly: true });
      res.render("auth/otp", {
        id: savedUser._id,
        message: null,
        localAction: `/signup/otp?id=${savedUser._id}`,
      });
    }
  } catch (error) {
    res.render("user/404page");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const userId = req.query.id;
    const secret = req.cookies["hashOtp"];
    const OTP = req.body.otp;
    const verified = await bcrypt.compare(OTP, secret);
    if (verified) {
      await userModel.findByIdAndUpdate(userId, { $set: { isVerified: true } });
      console.log("otp verification success");
      res.redirect("/login");
    } else {
      console.log("otp verification failed");
      res.render("auth/otp", {
        id: userId,
        message: "Incorrect OTP",
        localAction: `/signup/otp?id=${userId}`,
      });
    }
  } catch (error) {
    res.render("user/404page");
  }
};

const loadLogin = (req, res) => {
  try {
    res.render("auth/login", { message: null, prevUrl: req.query.url });
  } catch (error) {
    res.render("user/404page");
  }
};

const verifyLogin = async (req, res) => {
  try {
    let PrevUrl = req.query.prevUrl;
    if (PrevUrl == "") {
      PrevUrl = "/";
    }
    const { email, password } = req.body;
    const userData = await userModel.findOne({ email: email });
    if (userData) {
      const passMatch = await bcrypt.compare(password, userData.password);

      if (passMatch) {
        if (userData.isAdmin) {
          req.session.admin_id = userData._id;
          res.redirect("/admin/dashboard");
        } else {
          if (userData.isVerified && userData.isAccess) {
            req.session.user_id = userData._id;
            res.redirect(PrevUrl);
          } else {
            // you dont have the access
            res.render("auth/login", {
              message: "You don't have the access",
              prevUrl: PrevUrl,
            });
          }
        }
      } else {
        // password is incorrect
        res.render("auth/login", {
          message: "Password is incorrect",
          prevUrl: PrevUrl,
        });
      }
    } else {
      // user not found
      res.render("auth/login", { message: "User not found", prevUrl: PrevUrl });
    }
  } catch (error) {
    res.render("user/404page");
  }
};

const loadForgotPassword = (req, res) => {
  try {
    res.render("auth/forgotPassword", { message: null });
  } catch (error) {
    res.render("user/404page");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const emailMatch = await userModel.findOne({ email: email });
    if (!emailMatch) {
      res.render("auth/forgotPassword", {
        message: "This email has no account",
      });
    } else {
      const result = await otp.sendOtp(emailMatch);
      res.cookie("forgotHash", result, { httpOnly: true });
      res.render("auth/otp", {
        id: emailMatch._id,
        message: null,
        localAction: `/forgotPassword/otp?id=${emailMatch._id}`,
      });
    }
  } catch (error) {
    res.render("user/404page");
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const userId = req.query.id;
    const secret = req.cookies["forgotHash"];
    const OTP = req.body.otp;
    const verified = await bcrypt.compare(OTP, secret);
    if (verified) {
      console.log("otp verification success");
      res.cookie("id", userId, { httpOnly: true });
      res.render("auth/newPassword", { action: "/forgotPassword/newPassword" });
    } else {
      console.log("otp verification failed");
      res.render("auth/otp", {
        id: userId,
        message: "Incorrect OTP",
        localAction: `/forgotPassword/otp?id=${userId}`,
      });
    }
  } catch (error) {
    res.render("user/404page");
  }
};

const newPassword = async (req, res) => {
  try {
    const id = req.cookies["id"];
    const newPassword = req.body.password;
    const hashNewPassword = await hash(newPassword);
    await userModel.findByIdAndUpdate(id, { password: hashNewPassword });
    res.redirect("/login");
  } catch (error) {
    res.render("user/404page");
  }
};

module.exports = {
  loadSignUp,
  loadLogin,
  createUser,
  verifyLogin,
  verifyOtp,
  loadForgotPassword,
  forgotPassword,
  verifyForgotPasswordOtp,
  newPassword,
};
