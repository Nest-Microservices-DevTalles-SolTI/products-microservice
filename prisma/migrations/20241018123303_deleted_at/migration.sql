-- CreateIndex
CREATE INDEX "Product_id_idx" ON "Product"("id");

-- CreateIndex
CREATE INDEX "Product_available_deletedAt_idx" ON "Product"("available", "deletedAt");
