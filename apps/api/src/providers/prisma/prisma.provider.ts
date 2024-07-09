import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@repo/db';

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
