import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, releaseYear, actors } = req.body;
      const newMovie = await prisma.movie.create({
        data: { title, releaseYear, actors },
      });
      return res.status(201).json(newMovie);
    } catch (error) {
      return res.status(500).json({ error: "Error creating movie" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
