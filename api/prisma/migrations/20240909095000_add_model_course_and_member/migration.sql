-- CreateTable
CREATE TABLE "CourseAndMember" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseAndMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseAndMember" ADD CONSTRAINT "CourseAndMember_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAndMember" ADD CONSTRAINT "CourseAndMember_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
