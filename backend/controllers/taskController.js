import Tasks from "../models/Tasks.js";
import mongoose from "mongoose";

// Get Tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get One Task

export const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Tasks.findById(id);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Users Tasks
export const getUserTasks = async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await Tasks.find({ userId: id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create tasks for a user
export const createTasks = async (req, res) => {
  const tasks = req.body;

  try {
    const newTasks = await Tasks.insertMany(tasks);
    res.status(201).json(newTasks);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Create Task
export const createTask = async (req, res) => {
  const task = req.body;
  const newTask = new Tasks(task);

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  const { id: _id } = req.params;
  const task = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No task with that id");

  const updatedTask = await Tasks.findByIdAndUpdate(
    _id,
    { ...task, _id },
    { new: true }
  );

  res.json(updatedTask);
};

// Delete Task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No task with that id");

  await Tasks.findByIdAndDelete(id);

  res.json({ message: "Task deleted successfully" });
};
