/**
 * Movie Detail API
 *
 * This API endpoint handles CRUD operations for a specific movie.
 * It provides functionality to get, update, and delete individual movies.
 */
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  // Check if ID is valid
  if (!id) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  // GET method - Get a specific movie
  if (req.method === "GET") {
    try {
      const movie = await prisma.movie.findUnique({
        where: {
          id,
        },
      });

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      return res.status(200).json(movie);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT method - Update a movie
  if (req.method === "PUT") {
    // Check authentication
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check admin role
    if (session.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Forbidden - Admin access required" });
    }

    try {
      const { title, actors, releaseYear } = req.body;

      // Validate input
      if (!title || !actors || !releaseYear) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!Array.isArray(actors) || actors.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one actor is required" });
      }

      if (releaseYear < 1900 || releaseYear > new Date().getFullYear() + 5) {
        return res.status(400).json({ message: "Invalid release year" });
      }

      // Check if movie exists
      const existingMovie = await prisma.movie.findUnique({
        where: {
          id,
        },
      });

      if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Update movie
      const updatedMovie = await prisma.movie.update({
        where: {
          id,
        },
        data: {
          title,
          actors,
          releaseYear,
        },
      });

      return res.status(200).json(updatedMovie);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE method - Delete a movie
  if (req.method === "DELETE") {
    // Check authentication
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check admin role
    if (session.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Forbidden - Admin access required" });
    }

    try {
      // Check if movie exists
      const existingMovie = await prisma.movie.findUnique({
        where: {
          id,
        },
      });

      if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Delete movie
      await prisma.movie.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Handle other methods
  return res.status(405).json({ message: "Method not allowed" });
}
