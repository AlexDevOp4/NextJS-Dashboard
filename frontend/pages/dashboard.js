import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null); // Track which task is expanded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks");
      if (response.status !== 200) throw new Error("Failed to fetch tasks");
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    if (!confirm("Delete task?")) return;
    api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const toggleDescription = (id) => {
    setExpandedTask(expandedTask === id ? null : id); // Toggle task description
  };

  return (
    <div className="p-6 min-h-screen bg-gray-800 text-gray-200">
      <h1 className="text-3xl text-blue-400 mb-6">Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-400">Loading tasks...</p>}

      <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Created At</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <>
              {/* Main Task Row */}
              <tr key={task._id} className="border-b border-gray-700">
                <td
                  className="px-4 py-3 cursor-pointer hover:text-blue-400 transition"
                  onClick={() => toggleDescription(task._id)}
                >
                  {task.task}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      task.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex justify-center space-x-2">
                  <button
                    onClick={() => router.push(`/tasks/edit/${task._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
