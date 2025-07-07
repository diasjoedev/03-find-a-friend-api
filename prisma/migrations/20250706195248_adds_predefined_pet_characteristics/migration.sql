/*
  Warnings:

  - Made the column `latitude` on table `orgs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `orgs` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `environment` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `size` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PetEnvironment" AS ENUM ('SPACIOUS_INDOOR', 'SPACIOUS_OUTDOOR', 'SMALL_INDOOR', 'SMALL_OUTDOOR', 'MEDIUM_INDOOR', 'MEDIUM_OUTDOOR', 'LARGE_INDOOR', 'LARGE_OUTDOOR');

-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('VERY_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'VERY_LARGE');

-- AlterTable
ALTER TABLE "orgs" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "environment",
ADD COLUMN     "environment" "PetEnvironment" NOT NULL,
DROP COLUMN "size",
ADD COLUMN     "size" "PetSize" NOT NULL;
