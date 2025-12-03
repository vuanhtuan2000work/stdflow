import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('renders text input by default', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input value="" onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders textarea variant', () => {
    render(<Input variant="textarea" placeholder="Enter text" />)
    const textarea = screen.getByPlaceholderText('Enter text')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('renders search variant', () => {
    render(<Input variant="search" placeholder="Search" />)
    const input = screen.getByPlaceholderText('Search')
    expect(input).toHaveClass('pl-10')
  })

  it('shows error state', () => {
    render(<Input error="This is an error" />)
    expect(screen.getByText('This is an error')).toBeInTheDocument()
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-error-500')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })
})

