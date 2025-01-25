import { Database } from './database';

type PublicSchema = Database['public'];

export type Tables<
  T extends keyof PublicSchema['Tables']
> = PublicSchema['Tables'][T]['Row'];

export type TablesInsert<
  T extends keyof PublicSchema['Tables']
> = PublicSchema['Tables'][T]['Insert'];

export type TablesUpdate<
  T extends keyof PublicSchema['Tables']
> = PublicSchema['Tables'][T]['Update'];