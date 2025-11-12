/*
  Warnings:

  - Made the column `stderr` on table `TestCaseResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TestCaseResult" ALTER COLUMN "stderr" SET NOT NULL;
