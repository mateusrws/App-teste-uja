/*
  Warnings:

  - You are about to drop the column `cpf_resp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rg_resp` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."User_cpf_resp_key";

-- DropIndex
DROP INDEX "public"."User_rg_resp_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cpf_resp",
DROP COLUMN "description",
DROP COLUMN "rg_resp",
ALTER COLUMN "phone" SET NOT NULL;

-- CreateTable
CREATE TABLE "Adolescente" (
    "id" TEXT NOT NULL,
    "cpf_resp" TEXT NOT NULL,
    "rg_resp" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Adolescente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Adolescente_cpf_resp_key" ON "Adolescente"("cpf_resp");

-- CreateIndex
CREATE UNIQUE INDEX "Adolescente_rg_resp_key" ON "Adolescente"("rg_resp");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Adolescente" ADD CONSTRAINT "Adolescente_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
