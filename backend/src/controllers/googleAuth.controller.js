import axios from "axios";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import dotenv from "dotenv"
dotenv.config()

export const googleAuthRedirect = (req, res) => {
  const googleURL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "profile email",
      prompt: "select_account",
    });

  res.redirect(googleURL);
};

export const googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;

    // exchange code → token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenResponse.data;

    // get user profile
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name, picture, id } = profileResponse.data;

    // find or create user
    let user = await db.user.findFirst({
      where: {
        OR: [{ providerId: id }, { email }],
      },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          image: picture,
          providerId: id,
          authProvider: "GOOGLE",
          emailVerified: true,
        },
      });
    }

    // link google if needed
    if (!user.providerId) {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          providerId: id,
          authProvider: "GOOGLE",
        },
      });
    }

    // generate jwt
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // set cookie (same as login)
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(process.env.CLIENT_URL/home);
  } catch (error) {
    console.error("Google OAuth Error:", error);
   res.redirect(`${process.env.CLIENT_URL}/home`);

  }
};
