"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export default function Details() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const filterStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const fetchCompletedTasks = async () => {
    try {
      const response = await api.get("/tasks");
      if (response.status !== 200) throw new Error("Failed to fetch tasks");

      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks");
      if (response.status !== 200) throw new Error("Failed to fetch tasks");

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
    <>
      <div>
        <main>
          <header>
            <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <div>
                <div className="flex items-center gap-x-3">
                  <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="size-2 rounded-full bg-current" />
                  </div>
                  <h1 className="flex gap-x-3 text-base/7">
                    <span className="font-semibold text-white">
                      SaaS Dashboard
                    </span>
                  </h1>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4">
              <div
                className={"border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8"}
              >
                <button
                  onClick={() => {
                    setFilteredTasks(tasks);
                  }}
                  className="text-sm/6 font-medium text-gray-400"
                >
                  Total Tasks
                </button>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {tasks.length}
                  </span>
                </p>
              </div>
              <div
                className={"border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8"}
              >
                <button
                  onClick={() => {
                    setFilteredTasks(filterStatus("Completed"));
                  }}
                  className="text-sm/6 font-medium text-gray-400"
                >
                  Completed
                </button>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {filterStatus("Completed").length}
                  </span>
                </p>
              </div>
              <div
                className={"border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8"}
              >
                <button
                  onClick={() => {
                    setFilteredTasks(filterStatus("Pending"));
                  }}
                  className="text-sm/6 font-medium text-gray-400"
                >
                  Pending
                </button>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {filterStatus("Pending").length}
                  </span>
                </p>
              </div>
              <div
                className={"border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8"}
              >
                <button
                  onClick={() => {
                    setFilteredTasks(filterStatus("In Progress"));
                  }}
                  className="text-sm/6 font-medium text-gray-400"
                >
                  In Progress
                </button>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {filterStatus("In Progress").length}
                  </span>
                </p>
              </div>
            </div>
          </header>
          <div className="border-t border-white/10 pt-11">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <table className="mt-6 w-full whitespace-nowrap text-left">
              <colgroup>
                <col className="w-full sm:w-4/12" />
                <col className="lg:w-4/12" />
                <col className="lg:w-2/12" />
                <col className="lg:w-1/12" />
                <col className="lg:w-1/12" />
              </colgroup>
              <thead className="bg-gray-700">
                <tr className="font-semibold text-white">
                  <th className="px-4 py-3 text-left ">Title</th>
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
              <tbody className="divide-y divide-white/5">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task._id} className="border-b border-gray-700">
                      <td className="px-4 py-3 text-white">{task.task}</td>
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
                      <td className="px-4 py-3 text-white">
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
        </main>
      </div>
    </>
  );
}
