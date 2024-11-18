const express = require("express")
const router = express.Router()
const prisma = require("../prisma")

router.get("/", async (req,res,next)=> {
  try {
    const racecars = await prisma.racecar.findMany()
    res.json(racecars)
  } catch (e) {
    next(e)
  }
})

router.get("/:id", async (req,res,next) => {
  const {id} = req.params
  try {
    const car = await prisma.racecar.findUnique({where: {id: +id}})
    if(car) {
    res.json(car)
    } else {
      next({ status:404, message: ` Car with id: ${id} not found.`})
    }
  } catch (e) {
    next(e)
  }
})

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const {make} = req.body;

  // Check if title was provided
  if (!name) {
    return next({
      status: 400,
      message: "A new name must be provided.",
    });
  }

  try {
    // Check if the book exists
    const car = await prisma.racecar.findUnique({ where: { id: +id } });
    if (!car) {
      return next({
        status: 404,
        message: `Car with id ${id} does not exist.`,
      });
    }

    // Update the book
    const updatedCar = await prisma.racecar.update({
      where: { id: +id },
      data: { name, make },
    });
    res.json(updatedCar);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  const { make } = req.body;
  if (!name) {
    return next({
      status: 400,
      message: "Name must be provided for a new car.",
    });
  }
  try {
    const car = await prisma.racecar.create({ data: { name, make } });
    res.status(201).json(car);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the book exists
    const car = await prisma.racecar.findUnique({ where: { id: +id } });
    if (!car) {
      return next({
        status: 404,
        message: `Car with id ${id} does not exist.`,
      });
    }

    // Delete the book
    await prisma.racecar.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});


module.exports = router