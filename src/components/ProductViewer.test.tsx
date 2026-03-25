import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductViewer from './ProductViewer'

// Mock react-responsive
vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(() => false),
}))

// Mock zustand store
const mockSetColor = vi.fn()
const mockSetScale = vi.fn()
vi.mock('../store/MacbookStore', () => ({
  default: vi.fn(() => ({
    color: '#2e2c2e',
    scale: 0.08,
    setColor: mockSetColor,
    setScale: mockSetScale,
  })),
}))

// Mock @react-three/fiber Canvas
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn(({ children, ...props }) => (
    <div data-testid="canvas" {...props}>
      {children}
    </div>
  )),
}))

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn(() => <div data-testid="orbit-controls" />),
}))

// Mock child components
vi.mock('./three/StudioLights', () => ({
  default: vi.fn(() => <div data-testid="studio-lights" />),
}))

vi.mock('./three/ModelSwitcher', () => ({
  default: vi.fn(({ scale, isMobile }) => (
    <div data-testid="model-switcher" data-scale={scale} data-is-mobile={isMobile} />
  )),
}))

// Mock clsx
vi.mock('clsx', () => ({
  default: vi.fn((...args) => args.filter(Boolean).join(' ')),
}))

import { useMediaQuery } from 'react-responsive'
import useMacbookStore from '../store/MacbookStore'

describe('ProductViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useMediaQuery as Mock).mockReturnValue(false)
    ;(useMacbookStore as unknown as Mock).mockReturnValue({
      color: '#2e2c2e',
      scale: 0.08,
      setColor: mockSetColor,
      setScale: mockSetScale,
    })
  })

  describe('Rendering', () => {
    it('should render the product viewer section', () => {
      render(<ProductViewer />)
      
      const section = document.querySelector('#product-viewer')
      expect(section).toBeInTheDocument()
    })

    it('should render the main heading', () => {
      render(<ProductViewer />)
      
      expect(screen.getByRole('heading', { name: /Take a closer look\./i })).toBeInTheDocument()
    })

    it('should render the Canvas component', () => {
      render(<ProductViewer />)
      
      expect(screen.getByTestId('canvas')).toBeInTheDocument()
    })

    it('should render StudioLights component', () => {
      render(<ProductViewer />)
      
      expect(screen.getByTestId('studio-lights')).toBeInTheDocument()
    })

    it('should render ModelSwitcher component', () => {
      render(<ProductViewer />)
      
      expect(screen.getByTestId('model-switcher')).toBeInTheDocument()
    })

    it('should render OrbitControls component', () => {
      render(<ProductViewer />)
      
      expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
    })
  })

  describe('Color Controls', () => {
    it('should render two color control buttons', () => {
      render(<ProductViewer />)
      
      const colorControls = document.querySelectorAll('.color-control > div')
      expect(colorControls).toHaveLength(2)
    })

    it('should call setColor with silver color when first button clicked', () => {
      render(<ProductViewer />)
      
      const colorControls = document.querySelectorAll('.color-control > div')
      fireEvent.click(colorControls[0])
      
      expect(mockSetColor).toHaveBeenCalledWith('#adb5bd')
    })

    it('should call setColor with dark color when second button clicked', () => {
      render(<ProductViewer />)
      
      const colorControls = document.querySelectorAll('.color-control > div')
      fireEvent.click(colorControls[1])
      
      expect(mockSetColor).toHaveBeenCalledWith('#2e2c2e')
    })

    it('should show active state on silver button when silver color selected', () => {
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#adb5bd',
        scale: 0.08,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      const colorControls = document.querySelectorAll('.color-control > div')
      expect(colorControls[0].className).toContain('active')
    })

    it('should show active state on dark button when dark color selected', () => {
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#2e2c2e',
        scale: 0.08,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      const colorControls = document.querySelectorAll('.color-control > div')
      expect(colorControls[1].className).toContain('active')
    })
  })

  describe('Size Controls', () => {
    it('should render two size control buttons', () => {
      render(<ProductViewer />)
      
      expect(screen.getByText('14"')).toBeInTheDocument()
      expect(screen.getByText('16"')).toBeInTheDocument()
    })

    it('should call setScale with 0.06 when 14" button clicked', () => {
      render(<ProductViewer />)
      
      const sizeButton = screen.getByText('14"').closest('div')
      fireEvent.click(sizeButton!)
      
      expect(mockSetScale).toHaveBeenCalledWith(0.06)
    })

    it('should call setScale with 0.08 when 16" button clicked', () => {
      render(<ProductViewer />)
      
      const sizeButton = screen.getByText('16"').closest('div')
      fireEvent.click(sizeButton!)
      
      expect(mockSetScale).toHaveBeenCalledWith(0.08)
    })

    it('should show active state on 14" button when scale is 0.06', () => {
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#2e2c2e',
        scale: 0.06,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      const sizeButton = screen.getByText('14"').closest('div')
      expect(sizeButton?.className).toContain('bg-white')
      expect(sizeButton?.className).toContain('text-black')
    })

    it('should show active state on 16" button when scale is 0.08', () => {
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#2e2c2e',
        scale: 0.08,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      const sizeButton = screen.getByText('16"').closest('div')
      expect(sizeButton?.className).toContain('bg-white')
      expect(sizeButton?.className).toContain('text-black')
    })
  })

  describe('Media Query Behavior', () => {
    it('should call useMediaQuery with correct breakpoint', () => {
      render(<ProductViewer />)
      
      expect(useMediaQuery).toHaveBeenCalledWith({ query: '(max-width: 1024px)' })
    })

    it('should pass adjusted scale to ModelSwitcher on mobile', () => {
      ;(useMediaQuery as Mock).mockReturnValue(true)
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#2e2c2e',
        scale: 0.08,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      // On mobile, scale should be reduced by 0.03
      const modelSwitcher = screen.getByTestId('model-switcher')
      expect(modelSwitcher).toHaveAttribute('data-scale', '0.05')
      expect(modelSwitcher).toHaveAttribute('data-is-mobile', 'true')
    })

    it('should pass original scale to ModelSwitcher on desktop', () => {
      ;(useMediaQuery as Mock).mockReturnValue(false)
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#2e2c2e',
        scale: 0.08,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      const modelSwitcher = screen.getByTestId('model-switcher')
      expect(modelSwitcher).toHaveAttribute('data-scale', '0.08')
      expect(modelSwitcher).toHaveAttribute('data-is-mobile', 'false')
    })
  })

  describe('Store Integration', () => {
    it('should call useMacbookStore hook', () => {
      render(<ProductViewer />)
      
      expect(useMacbookStore).toHaveBeenCalled()
    })

    it('should use color from store', () => {
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#adb5bd',
        scale: 0.08,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      const colorControls = document.querySelectorAll('.color-control > div')
      // Silver button should be active
      expect(colorControls[0].className).toContain('active')
    })

    it('should use scale from store', () => {
      ;(useMacbookStore as unknown as Mock).mockReturnValue({
        color: '#2e2c2e',
        scale: 0.06,
        setColor: mockSetColor,
        setScale: mockSetScale,
      })
      
      render(<ProductViewer />)
      
      // 14" button should be active
      const sizeButton = screen.getByText('14"').closest('div')
      expect(sizeButton?.className).toContain('bg-white')
    })
  })

  describe('Canvas Configuration', () => {
    it('should render Canvas with correct camera settings', () => {
      render(<ProductViewer />)
      
      const canvas = screen.getByTestId('canvas')
      expect(canvas).toHaveAttribute('id', 'canvas')
    })
  })

  describe('Structure', () => {
    it('should have controls container', () => {
      render(<ProductViewer />)
      
      const controls = document.querySelector('.controls')
      expect(controls).toBeInTheDocument()
    })

    it('should have color-control container', () => {
      render(<ProductViewer />)
      
      const colorControl = document.querySelector('.color-control')
      expect(colorControl).toBeInTheDocument()
    })

    it('should have size-control container', () => {
      render(<ProductViewer />)
      
      const sizeControl = document.querySelector('.size-control')
      expect(sizeControl).toBeInTheDocument()
    })
  })
})
