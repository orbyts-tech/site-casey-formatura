export type FieldErrors = Readonly<Partial<Record<string, string>>>;

export type ActionResult<TData> =
  | { readonly isSuccess: true; readonly data: TData }
  | { readonly isSuccess: false; readonly errorMessage: string; readonly fieldErrors?: FieldErrors };

export function actionSuccess<TData>(data: TData): ActionResult<TData> {
  return { isSuccess: true, data };
}

export function actionFailure<TData>(errorMessage: string, fieldErrors?: FieldErrors): ActionResult<TData> {
  return { isSuccess: false, errorMessage, fieldErrors };
}

export function firstFieldErrors(fieldErrors: Readonly<Record<string, readonly string[] | undefined>>): FieldErrors {
  return Object.fromEntries(
    Object.entries(fieldErrors).flatMap(([fieldName, messages]) => (messages?.[0] ? [[fieldName, messages[0]]] : [])),
  );
}
