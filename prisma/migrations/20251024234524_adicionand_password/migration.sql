/*
  Warnings:

  - You are about to drop the column `descpription` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "descpription",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "password" TEXT NOT NULL;
