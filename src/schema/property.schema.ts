import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class Property {
    @Prop()
    propertyName: string;

    @Prop()
    plotNumber: string;

    @Prop()
    status: string;

    @Prop()
    description: string;

    @Prop()
    propertyType: string;

    @Prop()
    userId: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

    @Prop()
    deleted: boolean;


}

export const PropertySchema = SchemaFactory.createForClass(Property)