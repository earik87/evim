import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

// Helper to enter a value in the price input
async function enterPrice(value: number) {
  const input = screen.getByLabelText(/Ev Fiyatı|House Price/i)
  await userEvent.clear(input)
  await userEvent.type(input, String(value))
}

describe('App', () => {
  it('renders title and subtitle', () => {
    render(<App />)
    expect(screen.getByText(/Mortgage/i)).toBeInTheDocument()
    expect(screen.getByText(/Turkey|Türkiye/i)).toBeInTheDocument()
  })

  it('shows loan amount and down payment after entering price', async () => {
    render(<App />)
    await enterPrice(1000000)

    // Loan card
    expect(screen.getByText(/Loan Amount|Kredi Tutarı/i)).toBeInTheDocument()
    // Down payment card
    expect(screen.getByText(/Down Payment|Peşinat/i)).toBeInTheDocument()
  })

  it('shows monthly and total payment when loan exists', async () => {
    render(<App />)
    await enterPrice(1000000)

    expect(screen.getByText(/Monthly Payment|Aylık Ödeme/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Payment|Toplam Ödeme/i)).toBeInTheDocument()

    // Currency symbol appears
    expect(screen.getAllByText(/₺/i).length).toBeGreaterThan(0)
  })
})
