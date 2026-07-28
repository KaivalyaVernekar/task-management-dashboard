import { describe, expect, it } from 'vitest';
import { hasErrors, validateTask } from './validation';

const valid = { title: 'Write tests', description: 'Cover the reducer', dueDate: '2026-08-01' };

describe('validateTask', () => {
  it('passes a valid task', () => {
    expect(hasErrors(validateTask(valid))).toBe(false);
  });

  it('requires a title', () => {
    expect(validateTask({ ...valid, title: '' }).title).toMatch(/required/i);
  });

  it('rejects whitespace-only titles', () => {
    expect(validateTask({ ...valid, title: '   ' }).title).toMatch(/required/i);
  });

  it('enforces the title minimum length', () => {
    expect(validateTask({ ...valid, title: 'ab' }).title).toMatch(/at least 3/i);
  });

  it('enforces the title maximum length', () => {
    expect(validateTask({ ...valid, title: 'x'.repeat(101) }).title).toMatch(/at most 100/i);
  });

  it('requires a due date', () => {
    expect(validateTask({ ...valid, dueDate: '' }).dueDate).toMatch(/required/i);
  });

  it('rejects malformed dates', () => {
    expect(validateTask({ ...valid, dueDate: 'tomorrow' }).dueDate).toMatch(/valid date/i);
  });

  it('enforces the description maximum length', () => {
    expect(validateTask({ ...valid, description: 'x'.repeat(501) }).description).toMatch(
      /at most 500/i
    );
  });

  it('allows an empty description', () => {
    expect(hasErrors(validateTask({ ...valid, description: '' }))).toBe(false);
  });
});
