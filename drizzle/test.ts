import { db } from './';

export const test = async () => await db.query.product.findMany();
