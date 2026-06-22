-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "currency_id" UUID;

-- CreateTable
CREATE TABLE "currencies" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
