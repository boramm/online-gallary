-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "photoId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "likes_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "likes_photoId_idx" ON "likes"("photoId");

-- CreateIndex
CREATE INDEX "likes_ip_idx" ON "likes"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "likes_photoId_ip_key" ON "likes"("photoId", "ip");
