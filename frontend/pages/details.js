import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]); // Stores filtered tasks
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks");
      if (response.status !== 200) throw new Error("Failed to fetch tasks");

      const pendingTasks = response.data.filter(
        (task) => task.status == "Pending"
      );

      console.log(pendingTasks)

      setTasks(response.data);
      setFilteredTasks(response.data);
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
    setFilteredTasks(tasks.filter((task) => task._id !== id));
  };

  // Function to handle filtering tasks

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) =>
        task.task.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    sortTasksByDate();
  };

  // Sort Tasks by Created Date
  const sortTasksByDate = () => {
    let sortedTasks = [...filteredTasks].sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredTasks(sortedTasks);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-800 text-gray-200">
      <h1 className="text-3xl text-blue-400 mb-6">Dashboard</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-400">Loading tasks...</p>}

      <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">
              Created At
              <button
                onClick={toggleSortOrder}
                className="ml-2 text-gray-400 hover:text-gray-200"
              >
                🔽
              </button>
            </th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task._id} className="border-b border-gray-700">
                <td className="px-4 py-3">{task.task}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      task.status === "Completed"
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
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-400">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
