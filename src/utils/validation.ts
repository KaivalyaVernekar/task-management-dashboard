export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;

export const TITLE_MIN = 3;
export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 500;

/** Pure validation — unit-tested without React. */
export function validateTask(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();

  if (!title) {
    errors.title = 'Title is required';
  } else if (title.length < TITLE_MIN) {
    errors.title = `Title must be at least ${TITLE_MIN} characters`;
  } else if (title.length > TITLE_MAX) {
    errors.title = `Title must be at most ${TITLE_MAX} characters`;
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.dueDate) || isNaN(Date.parse(values.dueDate))) {
    errors.dueDate = 'Enter a valid date';
  }

  if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX} characters`;
  }

  return errors;
}

export function hasErrors(errors: TaskFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
