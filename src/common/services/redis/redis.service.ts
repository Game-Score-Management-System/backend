import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({ url: process.env.REDIS_URL });
    this.redisClient.connect();
  }

  async get(key: string) {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      console.error(error);
      throw new Error('Error while getting token');
    }
  }

  async set(key: string, value: string, expiration: number) {
    try {
      await this.redisClient.set(key, value, {
        EX: expiration
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error while saving token');
    }
  }

  async del(key: string) {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error(error);
      throw new Error('Error while deleting token');
    }
  }
}
