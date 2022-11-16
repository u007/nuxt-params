import { SafeParseReturnType, z, ZodType } from 'zod';
import { H3Event } from 'h3';

export const parseH3Body = async (schema: ZodType, event: H3Event) => {
  const body = await useBody(event)
  return schema.safeParseAsync(body)
}

export const parseTest = async (schema: ZodType, event: H3Event): Promise<z.infer<typeof schema>> => {
  const query = await useQuery(event)
  return schema.parse(schema, query)
}

export const parseH3Query = async (schema: ZodType, event: H3Event): Promise<SafeParseReturnType<z.infer<typeof schema>, z.infer<typeof schema>>> => {
  // export const parseH3Query = async (schema: ZodType, event: H3Event): Promise<z.infer<typeof schema>> => {
  const query = await useQuery(event)
  // return schema.parseAsync(query)
  // res.
  return schema.safeParseAsync(query)
}