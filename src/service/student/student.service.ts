import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from 'src/dto/create-student.dto';
import { UpdateStudentDto } from 'src/dto/update-student.dto';
import { IStudents } from 'src/interface/student.interface';


@Injectable()
export class StudentService {
    ///TODO: add the rest of the methods
    constructor(@InjectModel('nest') private studentModel: Model<IStudents>
    ) { }

    //create student method
    async createStudent(createStudentDto: CreateStudentDto): 
    Promise<IStudents> {
        const newStudent = new this.studentModel(createStudentDto);
        return newStudent.save();
    }

    //update student method
    async updateStudent(studentId: string, UpdateStudentDto: UpdateStudentDto): 
    Promise<IStudents> {
        const existingStudent = await this.studentModel.findByIdAndUpdate(studentId, UpdateStudentDto, {
            new: true
        });

        if(!existingStudent) {
            throw new NotFoundException(`Student with id ${studentId} not found`);
        }
        return existingStudent;
    }

    //get student method
    async getStudent(studentId: string): Promise<IStudents> {
        const existingStudent = await this.studentModel.findById(studentId).exec();

        if(!existingStudent) {
            throw new NotFoundException(`Student with id ${studentId} not found`);
        }
        return existingStudent;
    }

    //get all students method
    async getAllStudents(): Promise<IStudents[]> {
        const studentsData = await this.studentModel.find();

        if(!studentsData || studentsData.length == 0){
            throw new NotFoundException('No students found');
        }
        return studentsData;
    }

    //delete student method
    async deleteStudent(studentId: string): Promise<IStudents> {
        const deleteStudent = await this.studentModel.findByIdAndDelete(studentId);

        if(!deleteStudent){
            throw new NotFoundException(`Student with id ${studentId} not found`)
        }
        return deleteStudent;

    }

}
