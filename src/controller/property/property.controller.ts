import { Body, Controller, HttpStatus, Post, Put, Res, Param, Get, Delete } from '@nestjs/common';
import { response } from 'express';
import { CreatePropertyDto } from 'src/dto/create-property.dto';
import { UpdatePropertyDto } from 'src/dto/update-property.dto';
import { PropertyService } from 'src/service/student/property.service';


@Controller('property')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) { }

    //create Property method
    @Post()
    async createProperty(@Res() response, @Body() createPropertDto: CreatePropertyDto) {
        try {
            const newProperty = await this.propertyService.CreateProperty(createPropertDto);
            return response.status(HttpStatus.CREATED).json({
                message: 'Property created successfully',
                newProperty
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: Property not created!',
                error
            })
        }
    }

    @Put('/:id')
    async updateProperty(@Res() response, @Param('id') PropertyId: string, @Body() updatePropertyDto: UpdatePropertyDto) {
      try {
        const existingProperty = await this.propertyService.updateProperty(PropertyId, updatePropertyDto);

        return response.status(HttpStatus.OK).json({
            message: 'Property updated successfully',
            existingProperty
        })
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json(error)
      }
    }

    @Get()
    async getPropertys( @Res () response) {
        try {
            const PropertyData = await this.propertyService.getAllPropertys();
            return response.status(HttpStatus.OK).json({
                message: 'Propertys fetched successfully',
                PropertyData
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json(error);
        }

    }

    @Get('/:id')
    async getProperty(@Res() response, @Param('id') userId: string) {
        try {
            const existingProperty = await this.propertyService.getProperty(userId);
            return response.status(HttpStatus.OK).json({
                message: 'Property fetched successfully',
                existingProperty
            })
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Delete('/:id')
    async deleteProperty(@Res() response, @Param('id') PropertyId: string){
        try{
            const deleteProperty = await this.propertyService.deleteProperty(PropertyId);
            return response.status(HttpStatus.OK).json({
                message: 'Property deleted successfully',
                deleteProperty
            })
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
