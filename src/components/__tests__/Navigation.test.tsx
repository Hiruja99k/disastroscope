import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation', () => {
  it('renders navigation component', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    
    // Check if navigation is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
