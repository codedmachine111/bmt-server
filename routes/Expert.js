const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { validateToken } = require("../middleware/AuthMiddleware");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/all", async (req, res) => {
    const allExperts = await prisma.expert.findMany();
    res.json(allExperts);
})

module.exports = router;