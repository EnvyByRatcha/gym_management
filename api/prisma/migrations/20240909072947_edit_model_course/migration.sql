-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'use';

-- AddForeignKey
ALTER TABLE "CourseAndTrainer" ADD CONSTRAINT "CourseAndTrainer_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAndTrainer" ADD CONSTRAINT "CourseAndTrainer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "EmployeeAndTrainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
