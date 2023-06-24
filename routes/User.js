const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { validateToken } = require("../middleware/AuthMiddleware");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// ROUTE TO SIGNUP
router.post("/signup", async (req, res) => {
  const { firstName, password, email } = req.body;
  const user = await prisma.User.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    const hash = await bcrypt.hash(password, 10);
    await prisma.User.create({
      data: {
        email: email,
        password: hash,
        name: firstName,
      },
    });
    res.json({ message: "User Created!" });
  } else {
    res.json({ message: "User already exists!" });
  }
});


// ROUTE TO LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
        email: email,
    },
  });

  if (user) {
    bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        const accessToken = sign(
          { email: user.email, id: user.id},
          "important"
        );
        res.json({
          message: "Login Successful",
          accessToken: accessToken,
          name: user.name,
          userId: user.id,
          email: user.email,
        });
      } else {
        res.json({ message: "Wrong username/password combination!" });
      }
    });
  } else {
    res.json({ message: "User doesn't exist" });
  }
});

// ROUTE TO GET ALL USER DETAILS
router.get("/verify", validateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to verify user" });
  }
});

// Route to add experts (ASSUMPTION THAT WE HAVE EXPERTS ALREADY IN THE DATABASE)
// router.post("/add-experts", async (req, res) => {
//   const experts = [
//     { name: "Harshad Mehta", services: "Handling Taxes" },
//     { name: "DJ Snake", services: "Handling Taxes, Financial Audit" },
//     { name: "Jason derulo", services: "Financial Planning, Handling Taxes" },
//     { name: "Anand Vishwa", services: "Financial Audit, Handling Taxes" },
//     {
//       name: "Pushkaraj Kulkarni",
//       services: "Financial Audit, Financial Planning, Handling Taxes",
//     },
//   ];

//   try {
//     for (const expert of experts) {
//       const createdExpert = await prisma.Expert.create({
//         data: {
//           name: expert.name,
//           services: expert.services,
//         },
//       });
//       console.log(`Created expert: ${createdExpert.name}`);
//     }
//     res.json({ message: "Experts added successfully!" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to add experts." });
//   }
// });

module.exports = router;
