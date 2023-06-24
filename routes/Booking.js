const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { validateToken } = require("../middleware/AuthMiddleware");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/add", validateToken, async (req, res) => {
    const {service, date, expertId, userId} = req.body;
    const booking = await prisma.serviceTicket.create({
        data: {
            service: service,
            date: date,
            status: 'pending',    
            userId: userId,
            expertId: expertId,        
        }
    })
    if(!booking){
        res.json({error: 'Error creating booking'});
    }else{
        res.json({message: 'Booking created'});
    }
})

router.get("/all", validateToken, async (req, res) => {
    const bookings = await prisma.serviceTicket.findMany();
    if(!bookings){
        res.json({error: 'Error fetching bookings'});
    }else{
        res.json(bookings);
    }
})

router.put("/update", validateToken, async (req, res) => {
    const {id, status} = req.body;
    const booking = await prisma.serviceTicket.update({
        where: {
            id: id
        },
        data: {
            status: status
        }
    })
    if(!booking){
        res.json({error: 'Error updating booking'});
    }else{
        res.json({message: 'Booking updated'});
    }
})

module.exports = router;