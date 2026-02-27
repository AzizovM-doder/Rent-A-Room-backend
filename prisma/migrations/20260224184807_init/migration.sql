-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL DEFAULT '',
    "nameTj" TEXT NOT NULL DEFAULT '',
    "locationEn" TEXT NOT NULL,
    "locationRu" TEXT NOT NULL DEFAULT '',
    "locationTj" TEXT NOT NULL DEFAULT '',
    "typeEn" TEXT NOT NULL,
    "typeRu" TEXT NOT NULL DEFAULT '',
    "typeTj" TEXT NOT NULL DEFAULT '',
    "rooms" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "about" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
