-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JobCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "billNo" INTEGER,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isOn" BOOLEAN NOT NULL DEFAULT false,
    "isOff" BOOLEAN NOT NULL DEFAULT false,
    "hasBattery" BOOLEAN NOT NULL DEFAULT false,
    "hasDoor" BOOLEAN NOT NULL DEFAULT false,
    "hasSim" BOOLEAN NOT NULL DEFAULT false,
    "hasSlot" BOOLEAN NOT NULL DEFAULT false,
    "customerName" TEXT NOT NULL,
    "address" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "complaint" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "admissionFees" REAL,
    "aadhaarNumber" TEXT,
    "estimate" REAL,
    "advance" REAL,
    "finalAmount" REAL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "JobCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "JobCard_billNo_key" ON "JobCard"("billNo");
