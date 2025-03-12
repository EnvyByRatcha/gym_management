-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "dayPerWeek" INTEGER NOT NULL,
    "hourPerDay" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAndTrainer" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "CourseAndTrainer_pkey" PRIMARY KEY ("id")
);
