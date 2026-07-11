import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PumpState from './index.jsx'

// Keep the mount-time GET pending so the component stays in its loading state
// and never touches the real backend.
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => new Promise(() => {})),
    post: vi.fn(() => Promise.resolve({ data: {} }))
  }
}))

afterEach(cleanup)

function renderInRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('<PumpState /> (client)', () => {
  it('shows the loading state on first render', () => {
    renderInRouter(<PumpState api_token="fake-token" />)
    expect(screen.getByText('Đang tải...')).toBeInTheDocument()
  })

  it('renders without crashing when no api_token is provided', () => {
    expect(() => renderInRouter(<PumpState />)).not.toThrow()
  })
})
