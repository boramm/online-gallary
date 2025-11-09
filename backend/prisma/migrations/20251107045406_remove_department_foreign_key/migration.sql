-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departmentName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isTopPick" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_photos" ("departmentName", "description", "id", "imageUrl", "isTopPick", "likeCount", "title", "uploadDate", "viewCount") SELECT "departmentName", "description", "id", "imageUrl", "isTopPick", "likeCount", "title", "uploadDate", "viewCount" FROM "photos";
DROP TABLE "photos";
ALTER TABLE "new_photos" RENAME TO "photos";
CREATE INDEX "photos_likeCount_idx" ON "photos"("likeCount");
CREATE INDEX "photos_uploadDate_idx" ON "photos"("uploadDate");
CREATE INDEX "photos_departmentName_idx" ON "photos"("departmentName");
CREATE INDEX "photos_isTopPick_idx" ON "photos"("isTopPick");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
