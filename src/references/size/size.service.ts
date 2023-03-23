import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Size } from './size.model';

@Injectable()
export class SizeService {

    constructor(@InjectModel(Size) private sizeRepository: typeof Size) {}

    async getSize(size: string){
        const sizeObj = await this.sizeRepository.findOne({where: {size}});
        return sizeObj;
    }
}
