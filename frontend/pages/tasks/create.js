import { useState } from "react";
import { useRouter } from "next/router";

const CreateTask = () => {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, description, status }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      router.push("/dashboard"); // Redirect to Dashboard after success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-400 mb-6">
          Create a New Task
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium">Task</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Task Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Task"}
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

export default CreateTask;
