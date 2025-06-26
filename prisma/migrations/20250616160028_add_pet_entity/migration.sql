-- CreateEnum
CREATE TYPE "PetEnergy" AS ENUM ('VERY_LOW', 'LOW', 'NORMAL', 'HIGH', 'VERY_HIGH');

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photos" TEXT[],
    "description" TEXT NOT NULL,
    "energy" "PetEnergy" NOT NULL,
    "environment" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "requirementsForAdoption" TEXT[],
    "orgId" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
