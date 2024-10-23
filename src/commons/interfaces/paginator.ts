export interface Paginator {
  data: [];
  metadata: metadataType;
}

export type metadataType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
