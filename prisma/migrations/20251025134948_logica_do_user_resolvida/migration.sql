/*
  Warnings:

  - You are about to drop the column `lvl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Adolescente` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpf_resp]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg_resp]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('COORDENADOR', 'ADOLESCENTE');

-- DropForeignKey
ALTER TABLE "public"."Adolescente" DROP CONSTRAINT "Adolescente_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lvl",
ADD COLUMN     "cpf_resp" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "rg_resp" TEXT,
ADD COLUMN     "type" "UserType" NOT NULL;

-- DropTable
DROP TABLE "public"."Adolescente";

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_resp_key" ON "User"("cpf_resp");

-- CreateIndex
CREATE UNIQUE INDEX "User_rg_resp_key" ON "User"("rg_resp");
