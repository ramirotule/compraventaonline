-- CreateEnum
CREATE TYPE "SellerType" AS ENUM ('PERSONAL_SELLER', 'BUSINESS_SELLER');

-- CreateEnum
CREATE TYPE "SellerTier" AS ENUM ('BRONCE', 'PLATA', 'ORO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('APPROVED', 'REVIEW_REQUIRED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "FeaturedPlan" AS ENUM ('FREE', 'FEATURED', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('FRAUD', 'ILLEGAL_PRODUCT', 'OFFENSIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RESOLVED_APPROVED', 'RESOLVED_BLOCKED');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('FREE_FEATURED_HIGHLIGHT', 'FREE_PREMIUM_HIGHLIGHT', 'COMMISSION_DISCOUNT_5', 'COMMISSION_DISCOUNT_10');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "SellerType" NOT NULL,
    "name" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 100,
    "tier" "SellerTier" NOT NULL DEFAULT 'BRONCE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_acceptances" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "accepted_terms" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL,
    "accepted_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terms_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" UUID,
    "attributes_schema" JSONB NOT NULL,
    "icon_url" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "meta_title" TEXT,
    "meta_description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "images" TEXT[],
    "attributes" JSONB NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "condition" "Condition" NOT NULL,
    "stock" INTEGER NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'REVIEW_REQUIRED',
    "featured_plan" "FeaturedPlan" NOT NULL DEFAULT 'FREE',
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "highlighted_products" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "plan" "FeaturedPlan" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "highlighted_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reports" (
    "id" UUID NOT NULL,
    "reporter_user_id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisements" (
    "id" UUID NOT NULL,
    "advertiser_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_rewards" (
    "id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "type" "RewardType" NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_user_id_key" ON "sellers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_acceptances" ADD CONSTRAINT "terms_acceptances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlighted_products" ADD CONSTRAINT "highlighted_products_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reports" ADD CONSTRAINT "product_reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reports" ADD CONSTRAINT "product_reports_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_rewards" ADD CONSTRAINT "seller_rewards_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
