/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Account";
