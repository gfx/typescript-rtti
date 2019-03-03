export interface TypeInfo<T> {
  /**
   * A source of the type `T`.
   * The source representation depends on the compiler and its version.
   */
  source: string;

  sourceFile: string | null;

  /**
   * It checks if a value is a valid `T`.
   * @param value A value to validate.
   */
  validate(value: unknown): value is T;
}
