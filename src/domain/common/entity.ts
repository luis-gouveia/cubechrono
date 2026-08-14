import z from 'zod'

export const entitySchema = z.object({
  id: z.uuid(),
  createdAt: z.date(),
})
export type EntityProps = z.infer<typeof entitySchema>

export abstract class Entity<Props extends EntityProps, Shape extends z.ZodRawShape> {
  protected readonly props: Props
  protected readonly schema: z.ZodObject<Shape>

  protected constructor(input: Props | z.infer<z.ZodObject<Shape>>, schema: z.ZodObject<Shape>) {
    this.schema = entitySchema.extend(schema.shape)
    this.props = this.schema.parse({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...input,
    }) as Props
  }
}
