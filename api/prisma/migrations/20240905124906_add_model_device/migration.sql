-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);
