import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const movies = await prisma.movie.findMany({
        orderBy: { title: "asc" },
      });
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Error fetching movies" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, releaseYear, actors } = req.body;

      if (!title || !releaseYear || !actors || actors.length === 0) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const newMovie = await prisma.movie.create({
        data: {
          title,
          releaseYear,
          actors,
        },
      });

      res.status(201).json(newMovie);
    } catch (error) {
      console.error("Error creating movie:", error);
      res.status(500).json({ error: "Error creating movie" });
    }
  }

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
