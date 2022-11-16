
export type DataWithNullDefault<T> = (Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  id?: string,
  createdAt?: Date | null,
  updatedAt?: Date | null,
  deletedAt?: Date | null
})
