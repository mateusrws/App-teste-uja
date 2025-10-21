-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "descpription" TEXT,
    "dateBorn" DATETIME NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf_resp" TEXT NOT NULL,
    "rg_resp" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lvl" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "profileImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "congregacao_id" TEXT NOT NULL,
    CONSTRAINT "User_congregacao_id_fkey" FOREIGN KEY ("congregacao_id") REFERENCES "Congregacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Congregacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ingresso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "price" REAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Ingresso_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ingresso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_participants" INTEGER,
    "date" DATETIME NOT NULL,
    "hour" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "image" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "preco" REAL,
    "state" TEXT,
    "organizerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_rg_key" ON "User"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_resp_key" ON "User"("cpf_resp");

-- CreateIndex
CREATE UNIQUE INDEX "User_rg_resp_key" ON "User"("rg_resp");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
