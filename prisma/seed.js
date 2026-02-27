"use strict";

/**
 * Seed script — populates the database with the 10 initial listings
 * that match the Redux initialState in the frontend (listingSlice.js).
 *
 * Run: node prisma/seed.js
 * (or via: npm run db:seed)
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const listings = [
  {
    nameEn: "Modern Apartment",
    nameRu: "Современная квартира",
    nameTj: "Хонаи муосир",
    locationEn: "Dushanbe",
    locationRu: "Душанбе",
    locationTj: "Душанбе",
    typeEn: "apartment",
    typeRu: "квартира",
    typeTj: "хона",
    rooms: 2,
    price: 35,
    about: "Clean modern apartment in the city center.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  },
  {
    nameEn: "Family House",
    nameRu: "Семейный дом",
    nameTj: "Хонаи оилавӣ",
    locationEn: "Hisor",
    locationRu: "Гиссар",
    locationTj: "Ҳисор",
    typeEn: "house",
    typeRu: "дом",
    typeTj: "хона",
    rooms: 4,
    price: 50,
    about: "Spacious house perfect for families.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  },
  {
    nameEn: "Forest Dacha",
    nameRu: "Лесная дача",
    nameTj: "Дача дар ҷангал",
    locationEn: "Varzob",
    locationRu: "Варзоб",
    locationTj: "Варзоб",
    typeEn: "dacha",
    typeRu: "дача",
    typeTj: "дача",
    rooms: 3,
    price: 60,
    about: "Quiet dacha surrounded by nature.",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607",
  },
  {
    nameEn: "City Studio",
    nameRu: "Городская студия",
    nameTj: "Студияи шаҳрӣ",
    locationEn: "Khujand",
    locationRu: "Худжанд",
    locationTj: "Хуҷанд",
    typeEn: "apartment",
    typeRu: "квартира",
    typeTj: "хона",
    rooms: 1,
    price: 25,
    about: "Compact studio for solo travelers.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  },
  {
    nameEn: "Luxury Villa",
    nameRu: "Роскошная вилла",
    nameTj: "Виллаи боҳашамат",
    locationEn: "Norak",
    locationRu: "Нурек",
    locationTj: "Норак",
    typeEn: "house",
    typeRu: "дом",
    typeTj: "хона",
    rooms: 5,
    price: 120,
    about: "Premium villa with lake view.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    nameEn: "Cozy Apartment",
    nameRu: "Уютная квартира",
    nameTj: "Хонаи бароҳат",
    locationEn: "Vahdat",
    locationRu: "Вахдат",
    locationTj: "Ваҳдат",
    typeEn: "apartment",
    typeRu: "квартира",
    typeTj: "хона",
    rooms: 2,
    price: 30,
    about: "Warm and cozy apartment near park.",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  },
  {
    nameEn: "Mountain Dacha",
    nameRu: "Горная дача",
    nameTj: "Дача дар кӯҳ",
    locationEn: "Varzob",
    locationRu: "Варзоб",
    locationTj: "Варзоб",
    typeEn: "dacha",
    typeRu: "дача",
    typeTj: "дача",
    rooms: 3,
    price: 70,
    about: "Dacha with mountain scenery.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  },
  {
    nameEn: "Budget Room",
    nameRu: "Бюджетная комната",
    nameTj: "Ҳуҷраи арзон",
    locationEn: "Kulob",
    locationRu: "Куляб",
    locationTj: "Кӯлоб",
    typeEn: "apartment",
    typeRu: "квартира",
    typeTj: "хона",
    rooms: 1,
    price: 15,
    about: "Affordable option for short stays.",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  },
  {
    nameEn: "Garden House",
    nameRu: "Дом с садом",
    nameTj: "Хона бо боғ",
    locationEn: "Hisor",
    locationRu: "Гиссар",
    locationTj: "Ҳисор",
    typeEn: "house",
    typeRu: "дом",
    typeTj: "хона",
    rooms: 3,
    price: 55,
    about: "House with a private garden.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  },
  {
    nameEn: "Lake View Apartment",
    nameRu: "Квартира с видом на озеро",
    nameTj: "Хона бо намуди кӯл",
    locationEn: "Norak",
    locationRu: "Нурек",
    locationTj: "Норак",
    typeEn: "apartment",
    typeRu: "квартира",
    typeTj: "хона",
    rooms: 2,
    price: 65,
    about: "Apartment with beautiful lake view.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data first so re-running is idempotent
  await prisma.listing.deleteMany({});
  console.log("  🗑  Cleared existing listings");

  const created = await prisma.listing.createMany({ data: listings });
  console.log(`  ✅ Seeded ${created.count} listings`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
