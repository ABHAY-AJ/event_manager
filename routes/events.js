const express = require("express");
const { getEvents, createEvent, updateEvent, deleteEvent, getAllEvents } = require("../controllers/eventsController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", getEvents);
router.get("/all", getAllEvents);
router.post("/", upload.single("image"), createEvent);
router.put("/:id", upload.single("image"), updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
