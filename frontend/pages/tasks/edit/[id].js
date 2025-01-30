"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import api from "../../../utils/api";

const EditTask = () => {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("Pending");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const fetchTask = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.get(`/tasks/${id}`);
      if (response.status !== 200) throw new Error("Failed to fetch task");
      const data = response.data
      setTask(data);
      setUpdatedTitle(data.task);
      setUpdatedDescription(data.description);
      setUpdatedStatus(data.status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await api.patch(`/tasks/${id}`, {
        task: updatedTitle,
        description: updatedDescription,
        status: updatedStatus,
      });

      if (response.status !== 200) throw new Error("Failed to update task");

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-gray-400">Loading task...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-400 mb-6">
          Edit {`${task.task}`}
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium">Task Title</label>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Task Description
            </label>
            <textarea
              type="text"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Task Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Update Task
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditTask;
