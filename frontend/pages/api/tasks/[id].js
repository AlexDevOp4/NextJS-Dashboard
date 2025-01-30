export default function handler(req, res) {
  if (req.method === "DELETE")
    return res.status(200).json({ message: "Task deleted" });
  if (req.method === "PUT")
    return res.status(200).json({ message: "Task updated" });
  return res.status(405).json({ message: "Method not allowed" });
}
