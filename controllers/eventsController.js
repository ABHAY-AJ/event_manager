const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");


// Fetch all events
const getAllEvents = async (req, res) => {
    try {
      const db = getDB();
      const events = await db.collection("events").find({}).toArray();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


//Fetch filtered 
const getEvents = async (req, res) => {
  try {
    const db = getDB();
    const { id, type, limit, page } = req.query;

    if (id) {
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid Event ID" });
      const event = await db.collection("events").findOne({ _id: new ObjectId(id) });
      if (!event) return res.status(404).json({ error: "Event not found" });
      return res.json(event);
    }

    if (type === "latest") {
      const limitValue = parseInt(limit) || 5;
      const pageValue = parseInt(page) || 1;
      const skip = (pageValue - 1) * limitValue;

      const events = await db.collection("events")
        .find({})
        .sort({ schedule: -1 })
        .skip(skip)
        .limit(limitValue)
        .toArray();

      return res.json(events);
    }

    return res.status(400).json({ error: "Invalid query parameters" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Create
const createEvent = async (req, res) => {
  try {
    const db = getDB();
    const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;

    if (!name || !tagline || !schedule || !description || !moderator || !category || !sub_category || !rigor_rank) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEvent = {
      name,
      tagline,
      schedule: new Date(schedule),
      description,
      files: { image: req.file ? req.file.path : null },
      moderator,
      category,
      sub_category,
      rigor_rank: parseInt(rigor_rank),
      attendees: []
    };

    const result = await db.collection("events").insertOne(newEvent);
    res.status(201).json({ message: "Event created", eventId: result.insertedId, imageUrl: req.file?.path });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Update
const updateEvent = async (req, res) => {
  try {
    const db = getDB();
    const eventId = req.params.id;
    if (!ObjectId.isValid(eventId)) return res.status(400).json({ error: "Invalid Event ID" });

    const existingEvent = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
    if (!existingEvent) return res.status(404).json({ error: "Event not found" });

    const {
      name = existingEvent.name,
      tagline = existingEvent.tagline,
      schedule = existingEvent.schedule,
      description = existingEvent.description,
      moderator = existingEvent.moderator,
      category = existingEvent.category,
      sub_category = existingEvent.sub_category,
      rigor_rank = existingEvent.rigor_rank
    } = req.body;

    const updatedData = {
      name,
      tagline,
      schedule: new Date(schedule),
      description,
      files: { image: req.file ? req.file.path : existingEvent.files.image },
      moderator,
      category,
      sub_category,
      rigor_rank: parseInt(rigor_rank),
    };

    const result = await db.collection("events").updateOne({ _id: new ObjectId(eventId) }, { $set: updatedData });

    if (result.matchedCount === 0) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event updated successfully", updatedEvent: updatedData });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete
const deleteEvent = async (req, res) => {
  try {
    const db = getDB();
    const eventId = req.params.id;
    if (!ObjectId.isValid(eventId)) return res.status(400).json({ error: "Invalid Event ID" });

    const result = await db.collection("events").deleteOne({ _id: new ObjectId(eventId) });

    if (result.deletedCount === 0) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {getAllEvents, getEvents, createEvent, updateEvent, deleteEvent };
