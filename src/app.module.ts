import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsSchema } from './schema/student.schema';
import { StudentService } from './service/student/student.service';
import { StudentController } from './controller/student/student.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://makwasi:makwasi@cluster0.1zrjxib.mongodb.net/?retryWrites=true&w=majority'),
     MongooseModule.forFeature([{ name: 'nest' , schema: StudentsSchema}])
  ],
  controllers: [AppController, StudentController],
  providers: [AppService, StudentService],
})
export class AppModule { }
