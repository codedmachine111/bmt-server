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

router.get("/get/:id", async (req, res) => {
    const { id } = req.params;
    const expert = await prisma.expert.findFirst({
        where: {
            id: parseInt(id),
        },
    });
    res.json(expert);
})

router.get("/byName", async (req, res) => {
  const { expertName } = req.body;
  const expert = await prisma.expert.findFirst({
      where: {
          name: expertName,
      },
  });
  res.json(expert);
})

router.put("/update", validateToken, async (req, res) => {
    const { expertName, rating, totalRatings } = req.body;
    const updatedExpert = await prisma.expert.update({
      where: {
        name: expertName,
      },
      data: {
        rating: rating,
        totalRatings: totalRatings,
      },
    });
    
    if (!updatedExpert) {
      res.json({ error: 'Error updating expert' });
    } else {
      res.json({ message: 'Rating updated' });
    }
  });
  
module.exports = router;