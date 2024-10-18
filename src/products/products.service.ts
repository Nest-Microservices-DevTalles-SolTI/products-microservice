import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(`ProductService`);

  onModuleInit() {
    this.$connect();
    this.logger.log(`Data Base Connected`);
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({
      where: { available: true, deletedAt: null },
    });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true, deletedAt: null },
      }),
      meta: {
        totalRegisters: totalPages,
        page: page,
        pages: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true,
        deletedAt: null,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with ID ${id} Not Found`);

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    await this.findOne(updateProductDto.id);

    return this.product.update({
      where: { id: updateProductDto.id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: {
        available: false,
        deletedAt: new Date(),
      },
    });
  }
}
