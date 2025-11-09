-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departmentName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isTopPick" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "photos_departmentName_fkey" FOREIGN KEY ("departmentName") REFERENCES "departments" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "photoId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comments_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE INDEX "photos_likeCount_idx" ON "photos"("likeCount");

-- CreateIndex
CREATE INDEX "photos_uploadDate_idx" ON "photos"("uploadDate");

-- CreateIndex
CREATE INDEX "photos_departmentName_idx" ON "photos"("departmentName");

-- CreateIndex
CREATE INDEX "photos_isTopPick_idx" ON "photos"("isTopPick");

-- CreateIndex
CREATE INDEX "comments_photoId_idx" ON "comments"("photoId");

-- CreateIndex
CREATE INDEX "comments_createdAt_idx" ON "comments"("createdAt");
