

import { scheduleModel } from "../../../connections/models/schedule.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";

// =============== add schedule =================//

export const addSchedule = asyncHandler(async (req, res, next) => {
  const { schedule } = req.body;

  if (!schedule) {
    return res.status(400).json({ message: "Schedule is required" });
  }

  const newSchedule = await scheduleModel.create({ schedule });

  res.status(201).json({ message: "Schedule added successfully", newSchedule });
});




// =============== show schedules =================//

export const getschedules = asyncHandler(async (req, res) => {
    const schdules = await scheduleModel.find({});
    res.json(schdules);
  });
