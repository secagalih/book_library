export const validateRequest = (schema) => {
  return async (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error.format();

      const flatErrors = Object.values(formattedErrors)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({ message: flatErrors.join(", ") });
    }

    next();
  }
}