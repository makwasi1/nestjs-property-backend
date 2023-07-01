import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsSchema } from './schema/student.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://makwasi:makwasi@cluster0.1zrjxib.mongodb.net/?retryWrites=true&w=majority'),
     MongooseModule.forFeature([{ name: 'nest' , schema: StudentsSchema}])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
