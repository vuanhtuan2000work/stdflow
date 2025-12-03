import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-primary-500')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('bg-gray-100')
  })

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByText('Outline')
    expect(button).toHaveClass('border')
  })

  it('applies danger variant', () => {
    render(<Button variant="danger">Danger</Button>)
    const button = screen.getByText('Danger')
    expect(button).toHaveClass('bg-error-500')
  })

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByText('Ghost')
    expect(button).toHaveClass('text-primary-500')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByText('Đang xử lý...')).toBeInTheDocument()
    const button = screen.getByText('Đang xử lý...').closest('button')
    expect(button).toBeDisabled()
  })

  it('applies size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    const smallButton = screen.getByText('Small')
    // Button has responsive sizing, check for mobile size (h-12) or desktop size (h-10)
    expect(smallButton.className).toMatch(/h-(8|10|12)/)

    rerender(<Button size="md">Medium</Button>)
    const mediumButton = screen.getByText('Medium')
    // Default md size is h-10 on mobile, h-10 on desktop
    expect(mediumButton.className).toMatch(/h-(10|12)/)

    rerender(<Button size="lg">Large</Button>)
    const largeButton = screen.getByText('Large')
    // Large size is h-12
    expect(largeButton.className).toMatch(/h-12/)
  })
})

