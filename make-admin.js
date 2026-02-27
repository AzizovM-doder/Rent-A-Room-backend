const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const email = "admin@admin.com";
  const password = "admin0000";
  const name = "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Just make admin
    await prisma.user.update({ where: { email }, data: { isAdmin: true } });
    console.log(`✅ Existing user '${email}' promoted to admin.`);
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, phone: "", password: hash, isAdmin: true },
  });
  console.log(`✅ Admin created!`);
  console.log(`   Email:    ${user.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   isAdmin:  ${user.isAdmin}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
