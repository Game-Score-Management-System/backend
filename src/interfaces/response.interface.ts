import { Metadata } from './metadata.interface';

export interface Response<T> {
  data: T;
  metadata?: Metadata;
}
