-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "address" TEXT,
    "aadhaarNumber" TEXT,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobCard" (
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
    "customerId" INTEGER,
    CONSTRAINT "JobCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobCard_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JobCard" ("aadhaarNumber", "address", "admissionFees", "advance", "billNo", "complaint", "createdAt", "customerName", "date", "estimate", "finalAmount", "hasBattery", "hasDoor", "hasSim", "hasSlot", "id", "isOff", "isOn", "mobileNumber", "model", "status", "updatedAt", "userId") SELECT "aadhaarNumber", "address", "admissionFees", "advance", "billNo", "complaint", "createdAt", "customerName", "date", "estimate", "finalAmount", "hasBattery", "hasDoor", "hasSim", "hasSlot", "id", "isOff", "isOn", "mobileNumber", "model", "status", "updatedAt", "userId" FROM "JobCard";
DROP TABLE "JobCard";
ALTER TABLE "new_JobCard" RENAME TO "JobCard";
CREATE UNIQUE INDEX "JobCard_billNo_key" ON "JobCard"("billNo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_mobileNumber_key" ON "Customer"("mobileNumber");
