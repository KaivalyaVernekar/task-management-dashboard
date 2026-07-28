import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import App from '@/App';

async function runAxe(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // jsdom cannot compute real colors/layout, so contrast is verified
      // manually against the token palette (see README a11y checklist).
      'color-contrast': { enabled: false },
    },
  });
  return results.violations;
}

describe('accessibility (axe-core)', () => {
  beforeEach(() => localStorage.clear());

  it('dashboard has no axe violations', async () => {
    const { container, findByRole } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await findByRole('heading', { name: /all tasks/i });
    const violations = await runAxe(container);
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual(
      []
    );
  });

  it('trash page has no axe violations', async () => {
    const { container, findByRole } = render(
      <MemoryRouter initialEntries={['/trash']}>
        <App />
      </MemoryRouter>
    );
    await findByRole('heading', { level: 1, name: /trash/i });
    const violations = await runAxe(container);
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual(
      []
    );
  });
});
