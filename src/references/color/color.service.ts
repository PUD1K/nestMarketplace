import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Color } from './color.model';

@Injectable()
export class ColorService {

    constructor(@InjectModel(Color) private colorRepository: typeof Color) {}

    async getColor(color: string){
        const colorObj = await this.colorRepository.findOne({where: {color}});
        return colorObj;
    }
}
