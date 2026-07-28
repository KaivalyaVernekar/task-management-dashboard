import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

describe('App (smoke)', () => {
  beforeEach(() => localStorage.clear());

  it('renders the dashboard with seed data', async () => {
    renderApp('/');
    expect(await screen.findByRole('heading', { name: /all tasks/i })).toBeInTheDocument();
    // Seed data populates the dashboard on first visit
    expect(
      await screen.findByRole('heading', { name: /design review — dashboard mockups/i })
    ).toBeInTheDocument();
    // Summary bar is present
    expect(screen.getByLabelText(/task summary/i)).toBeInTheDocument();
  });

  it('renders the completed view via URL', async () => {
    renderApp('/completed');
    expect(await screen.findByRole('heading', { name: /completed tasks/i })).toBeInTheDocument();
  });

  it('renders a 404 for unknown status segments', async () => {
    renderApp('/not-a-status');
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
