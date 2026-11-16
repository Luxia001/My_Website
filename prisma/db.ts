// src/prisma/db.ts

import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export { prisma };
