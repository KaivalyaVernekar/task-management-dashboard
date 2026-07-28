import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

/** Full user journey through the real component tree: add → edit → delete → restore. */
describe('task flow (integration)', () => {
  beforeEach(() => localStorage.clear());

  it('adds a task with validation, edits it, deletes it, and finds it in trash', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await screen.findByRole('heading', { name: /all tasks/i });

    // --- Add: submitting an empty form surfaces validation errors
    await user.click(screen.getByRole('button', { name: /add task/i }));
    const dialog = await screen.findByRole('dialog');
    await user.clear(within(dialog).getByLabelText(/due date/i));
    await user.click(within(dialog).getByRole('button', { name: /^add task$/i }));
    expect(await within(dialog).findByText(/title is required/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/due date is required/i)).toBeInTheDocument();

    // Fill it in properly
    await user.type(within(dialog).getByLabelText(/title/i), 'Ship the take-home');
    await user.type(within(dialog).getByLabelText(/due date/i), '2026-12-01');
    await user.click(within(dialog).getByRole('radio', { name: /high/i }));
    await user.click(within(dialog).getByRole('button', { name: /^add task$/i }));

    expect(
      await screen.findByRole('heading', { name: /ship the take-home/i })
    ).toBeInTheDocument();

    // --- Edit
    await user.click(screen.getByRole('button', { name: /edit ship the take-home/i }));
    const editDialog = await screen.findByRole('dialog');
    const titleInput = within(editDialog).getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Ship it today');
    await user.click(within(editDialog).getByRole('button', { name: /save changes/i }));

    expect(await screen.findByRole('heading', { name: /ship it today/i })).toBeInTheDocument();

    // --- Delete (soft) with confirmation
    await user.click(screen.getByRole('button', { name: /delete ship it today/i }));
    const confirm = await screen.findByRole('dialog');
    await user.click(within(confirm).getByRole('button', { name: /^delete$/i }));

    // Gone from the dashboard (after exit animation), undo toast offered
    expect(await screen.findByText(/moved to trash/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /ship it today/i })).not.toBeInTheDocument()
    );

    // --- It's in the trash, restorable
    await user.click(screen.getByRole('link', { name: /trash/i }));
    expect(await screen.findByText(/ship it today/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /restore/i }));
    await waitFor(() =>
      expect(screen.queryByText(/ship it today/i)).not.toBeInTheDocument()
    );
  });

  it('filters by status through the URL pills', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await screen.findByRole('heading', { name: /all tasks/i });

    // Navigate to Completed via filter pill (it's a link, not local state)
    const filterNav = screen.getByRole('navigation', { name: /filter tasks by status/i });
    await user.click(within(filterNav).getByRole('link', { name: /^completed/i }));
    expect(await screen.findByRole('heading', { name: /completed tasks/i })).toBeInTheDocument();

    // Only completed seed tasks are shown
    expect(await screen.findByRole('heading', { name: /ship dark mode/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /fix login redirect bug/i })).not.toBeInTheDocument();
  });
});
