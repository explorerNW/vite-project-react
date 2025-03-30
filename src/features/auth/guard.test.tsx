import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { AuthGuard } from './guard';

const mockStore = configureStore([]);

describe('AuthGuard Component', () => {
  test('renders children when user is logged in', () => {
    const store = mockStore({
      login: { userLogin: true },
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthGuard>
            <div>Protected Content</div>
          </AuthGuard>
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to /login when user is not logged in', () => {
    const store = mockStore({
      login: { userLogin: false },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path='/protected'
              element={
                <AuthGuard>
                  <div>Protected Content</div>
                </AuthGuard>
              }
            />
            <Route path='/login' element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(container.textContent).toBe('Login Page');
  });
});
