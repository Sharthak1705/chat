import Call from "../models/Call.js";

export const logCall = async (req, res) => {
  try {
    const newCall = await Call.create(req.body);
    res.status(201).json(newCall);
  } catch (err) {
    console.error("Error logging call:", err);
    res.status(500).json({ error: "Failed to log call" });
  }
};

export const logAudioCall = async (req, res) => {
  try {
    const { caller, receiver, startTime, endTime, status } = req.body;
    const newCall = await Call.create({
      caller,
      receiver,
      startTime,
      endTime,
      type: "audio",
      status,
    });
    res.status(201).json(newCall);
  } catch (err) {
    console.error("Error logging audio call:", err);
    res.status(500).json({ error: "Failed to log audio call" });
  }
};

export const getCallHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await Call.find({
      $or: [{ caller: userId }, { receiver: userId }],
    })
      .sort({ startTime: -1 })
      .populate("caller receiver", "username");
    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching call history:", err);
    res.status(500).json({ error: "Error fetching call history" });
  }
};
