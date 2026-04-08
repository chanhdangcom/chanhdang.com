import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { UserRole } from "./permissions";

/**
 * Get user role from request
 * Checks both NextAuth session and request headers/body
 */
export async function getUserRole(request: Request | NextRequest): Promise<UserRole | null> {
  let sessionUserEmail: string | null = null;
  try {
    const session = await getServerSession();
    sessionUserEmail = session?.user?.email ?? null;
  } catch (error) {
    console.warn("getServerSession failed in getUserRole, falling back:", error);
  }

  try {
    if (sessionUserEmail) {
      const client = await clientPromise;
      const db = client.db("musicdb");
      const user = await db.collection("users").findOne({ email: sessionUserEmail });
      if (user?.role) {
        return user.role as UserRole;
      }
      return "user";
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const userId = authHeader.replace("Bearer ", "");
      if (userId && ObjectId.isValid(userId)) {
        const client = await clientPromise;
        const db = client.db("musicdb");
        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        if (user?.role) {
          return user.role as UserRole;
        }
      }
    }

    // Try to get from userId in request body or query
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (userId && ObjectId.isValid(userId)) {
      const client = await clientPromise;
      const db = client.db("musicdb");
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      if (user?.role) {
        return user.role as UserRole;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Get user ID from request
 */
export async function getUserId(request: Request | NextRequest): Promise<string | null> {
  let sessionUserEmail: string | null = null;
  try {
    const session = await getServerSession();
    sessionUserEmail = session?.user?.email ?? null;
  } catch (error) {
    console.warn("getServerSession failed in getUserId, falling back:", error);
  }

  try {
    if (sessionUserEmail) {
      const client = await clientPromise;
      const db = client.db("musicdb");
      const user = await db.collection("users").findOne({ email: sessionUserEmail });
      if (user?._id) {
        return String(user._id);
      }
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      return authHeader.replace("Bearer ", "");
    }

    return null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

/**
 * Get user from database by ID
 */
export async function getUserById(userId: string) {
  try {
    if (!ObjectId.isValid(userId)) {
      return null;
    }
    const client = await clientPromise;
    const db = client.db("musicdb");
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

