import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePropertyDto } from 'src/dto/create-property.dto';
import { UpdatePropertyDto } from 'src/dto/update-property.dto';
import { IProperty } from 'src/interface/property.interface';


@Injectable()
export class PropertyService {
    ///TODO: add the rest of the methods
    constructor(@InjectModel('property') private propertyModel: Model<IProperty>
    ) { }

    //create Property method
    async CreateProperty(CreatePropertyDto: CreatePropertyDto): 
    Promise<IProperty> {
        const newProperty = new this.propertyModel(CreatePropertyDto);
        return newProperty.save();
    }

    //update Property method
    async updateProperty(propertyId: string, UpdatePropertyDto: UpdatePropertyDto): 
    Promise<IProperty> {
        const existingProperty = await this.propertyModel.findByIdAndUpdate(propertyId, UpdatePropertyDto, {
            new: true
        });

        if(!existingProperty) {
            throw new NotFoundException(`Property with id ${propertyId} not found`);
        }
        return existingProperty;
    }

    //get Property method
    async getProperty(userId: string): Promise<IProperty[]> {
        // const existingProperty = await this.propertyModel.findById(propertyId).exec();
        //get by userId 
        const existingProperty = await this.propertyModel.find({userId: userId}).exec();

        if(!existingProperty) {
            throw new NotFoundException(`Property with id ${userId} not found`);
        }
        return existingProperty;
    }

    //get all Propertys method
    async getAllPropertys(): Promise<IProperty[]> {
        const PropertysData = await this.propertyModel.find();

        if(!PropertysData || PropertysData.length == 0){
            throw new NotFoundException('No Propertys found');
        }
        return PropertysData;
    }

    //delete Property method
    async deleteProperty(propertyId: string): Promise<IProperty> {
        const deleteProperty = await this.propertyModel.findByIdAndDelete(propertyId);

        if(!deleteProperty){
            throw new NotFoundException(`Property with id ${propertyId} not found`)
        }
        return deleteProperty;

    }

}
