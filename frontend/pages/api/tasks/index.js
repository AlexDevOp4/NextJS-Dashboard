export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json([
      { _id: "1", title: "Learn Next.js", status: "Pending" },
      { _id: "2", title: "Build a project", status: "Completed" },
    ]);
  }

  if (req.method === "POST") {
    res.status(201).json({ message: "Task created successfully" });
  }
}
