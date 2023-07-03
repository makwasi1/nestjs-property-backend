import { Body, Controller, HttpStatus, Post, Put, Res, Param, Get, Delete } from '@nestjs/common';
import { response } from 'express';
import { CreateStudentDto } from 'src/dto/create-student.dto';
import { UpdateStudentDto } from 'src/dto/update-student.dto';
import { StudentService } from 'src/service/student/student.service';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    //create student method
    @Post()
    async createStudent(@Res() response, @Body() createStudentDto: CreateStudentDto) {
        try {
            const newStudent = await this.studentService.createStudent(createStudentDto);
            return response.status(HttpStatus.CREATED).json({
                message: 'Student created successfully',
                newStudent
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: Student not created!',
                error
            })
        }
    }

    @Put('/:id')
    async updateStudent(@Res() response, @Param('id') studentId: string, @Body() updateStudentDto: UpdateStudentDto) {
      try {
        const existingStudent = await this.studentService.updateStudent(studentId, updateStudentDto);

        return response.status(HttpStatus.OK).json({
            message: 'Student updated successfully',
            existingStudent
        })
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json(error)
      }
    }

    @Get()
    async getStudents( @Res () response) {
        try {
            const studentData = await this.studentService.getAllStudents();
            return response.status(HttpStatus.OK).json({
                message: 'Students fetched successfully',
                studentData
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json(error);
        }

    }

    @Get('/:id')
    async getStudent(@Res() response, @Param('id') studentId: string) {
        try {
            const existingStudent = await this.studentService.getStudent(studentId);
            return response.status(HttpStatus.OK).json({
                message: 'Student fetched successfully',
                existingStudent
            })
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Delete('/:id')
    async deleteStudent(@Res() response, @Param('id') studentId: string){
        try{
            const deleteStudent = await this.studentService.deleteStudent(studentId);
            return response.status(HttpStatus.OK).json({
                message: 'Student deleted successfully',
                deleteStudent
            })
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
