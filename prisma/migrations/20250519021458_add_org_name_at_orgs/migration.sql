/*
  Warnings:

  - Added the required column `org_name` to the `orgs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orgs" ADD COLUMN     "org_name" TEXT NOT NULL;
