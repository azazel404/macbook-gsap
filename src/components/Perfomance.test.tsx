import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import Performance from './Perfomance'

// Mock react-responsive
vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(() => false),
}))

// Mock @gsap/react - execute callback immediately
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callback, options) => {
    // Simulate the hook by calling the callback
    // The callback checks sectionRef.current, so we need to handle that
    if (options?.scope?.current) {
      callback()
    }
  }),
}))

// Mock gsap
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
    })),
  },
}))

// Mock constants
vi.mock('../constants/index.js', () => ({
  performanceImages: [
    { id: 'p1', src: '/performance1.png' },
    { id: 'p2', src: '/performance2.png' },
    { id: 'p3', src: '/performance3.png' },
    { id: 'p4', src: '/performance4.png' },
    { id: 'p5', src: '/performance5.jpg' },
    { id: 'p6', src: '/performance6.png' },
    { id: 'p7', src: '/performance7.png' },
  ],
  performanceImgPositions: [
    { id: 'p1', left: 5, bottom: 65 },
    { id: 'p2', right: 10, bottom: 60 },
    { id: 'p3', right: -5, bottom: 45 },
    { id: 'p4', right: -10, bottom: 0 },
    { id: 'p5', left: 20, bottom: 50 },
    { id: 'p6', left: 2, bottom: 30 },
    { id: 'p7', left: -5, bottom: 0 },
  ],
}))

import { useMediaQuery } from 'react-responsive'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

describe('Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useMediaQuery as Mock).mockReturnValue(false)
  })

  describe('Rendering', () => {
    it('should render the performance section', () => {
      render(<Performance />)
      
      const section = document.querySelector('#performance')
      expect(section).toBeInTheDocument()
    })

    it('should render the main heading', () => {
      render(<Performance />)
      
      expect(screen.getByRole('heading', { name: /Next-level graphics performance\. Game on\./i })).toBeInTheDocument()
    })

    it('should render all performance images', () => {
      render(<Performance />)
      
      const images = document.querySelectorAll('.wrapper img')
      expect(images).toHaveLength(7)
    })

    it('should render images with correct src attributes', () => {
      render(<Performance />)
      
      expect(document.querySelector('.p1')).toHaveAttribute('src', '/performance1.png')
      expect(document.querySelector('.p2')).toHaveAttribute('src', '/performance2.png')
      expect(document.querySelector('.p3')).toHaveAttribute('src', '/performance3.png')
      expect(document.querySelector('.p4')).toHaveAttribute('src', '/performance4.png')
      expect(document.querySelector('.p5')).toHaveAttribute('src', '/performance5.jpg')
      expect(document.querySelector('.p6')).toHaveAttribute('src', '/performance6.png')
      expect(document.querySelector('.p7')).toHaveAttribute('src', '/performance7.png')
    })

    it('should render images with correct class names', () => {
      render(<Performance />)
      
      expect(document.querySelector('.p1')).toBeInTheDocument()
      expect(document.querySelector('.p2')).toBeInTheDocument()
      expect(document.querySelector('.p3')).toBeInTheDocument()
      expect(document.querySelector('.p4')).toBeInTheDocument()
      expect(document.querySelector('.p5')).toBeInTheDocument()
      expect(document.querySelector('.p6')).toBeInTheDocument()
      expect(document.querySelector('.p7')).toBeInTheDocument()
    })

    it('should render images with alt attributes', () => {
      render(<Performance />)
      
      const images = document.querySelectorAll('.wrapper img')
      images.forEach((img, index) => {
        expect(img).toHaveAttribute('alt', `Performance Image #${index + 1}`)
      })
    })

    it('should render the content section with description', () => {
      render(<Performance />)
      
      expect(screen.getByText(/Run graphics-intensive workflows/i)).toBeInTheDocument()
      expect(screen.getByText(/gaming feels more immersive and realistic than ever/i)).toBeInTheDocument()
      expect(screen.getByText(/Dynamic Caching optimizes fast on-chip memory/i)).toBeInTheDocument()
    })

    it('should have content div with correct class', () => {
      render(<Performance />)
      
      const contentDiv = document.querySelector('.content')
      expect(contentDiv).toBeInTheDocument()
      expect(contentDiv?.querySelector('p')).toBeInTheDocument()
    })
  })

  describe('Media Query Behavior', () => {
    it('should call useMediaQuery with correct breakpoint', () => {
      render(<Performance />)
      
      expect(useMediaQuery).toHaveBeenCalledWith({ query: '(max-width: 1024px)' })
    })
  })

  describe('GSAP Animation', () => {
    it('should call useGSAP hook', () => {
      render(<Performance />)
      
      expect(useGSAP).toHaveBeenCalled()
    })

    it('should call useGSAP with scope and dependencies', () => {
      render(<Performance />)
      
      expect(useGSAP).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          scope: expect.any(Object),
          dependencies: [false],
        })
      )
    })

    it('should pass isMobile=true as dependency when on mobile', () => {
      ;(useMediaQuery as Mock).mockReturnValue(true)
      
      render(<Performance />)
      
      expect(useGSAP).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          dependencies: [true],
        })
      )
    })

    describe('Animation callback behavior', () => {
      it('should animate text content with gsap.fromTo when ref is available', () => {
        // Get the callback passed to useGSAP and test it directly
        render(<Performance />)
        
        const useGSAPCall = (useGSAP as Mock).mock.calls[0]
        const animationCallback = useGSAPCall[0]
        const options = useGSAPCall[1]
        
        // Simulate ref being available
        const mockSection = document.createElement('section')
        options.scope.current = mockSection
        
        // Execute the callback
        animationCallback()
        
        expect(gsap.fromTo).toHaveBeenCalledWith(
          '.content p',
          { opacity: 0, y: 10 },
          expect.objectContaining({
            opacity: 1,
            y: 0,
            ease: 'power1.out',
          })
        )
      })

      it('should create GSAP timeline on desktop (non-mobile)', () => {
        ;(useMediaQuery as Mock).mockReturnValue(false)
        
        render(<Performance />)
        
        const useGSAPCall = (useGSAP as Mock).mock.calls[0]
        const animationCallback = useGSAPCall[0]
        const options = useGSAPCall[1]
        
        const mockSection = document.createElement('section')
        options.scope.current = mockSection
        
        animationCallback()
        
        expect(gsap.timeline).toHaveBeenCalledWith(
          expect.objectContaining({
            defaults: { duration: 2, ease: 'power1.inOut', overwrite: 'auto' },
          })
        )
      })

      it('should NOT create GSAP timeline on mobile', () => {
        ;(useMediaQuery as Mock).mockReturnValue(true)
        
        render(<Performance />)
        
        const useGSAPCall = (useGSAP as Mock).mock.calls[0]
        const animationCallback = useGSAPCall[0]
        const options = useGSAPCall[1]
        
        const mockSection = document.createElement('section')
        options.scope.current = mockSection
        
        animationCallback()
        
        // Text animation should still run
        expect(gsap.fromTo).toHaveBeenCalled()
        // But timeline should not be created on mobile
        expect(gsap.timeline).not.toHaveBeenCalled()
      })

      it('should animate image positions on desktop', () => {
        const mockTo = vi.fn().mockReturnThis()
        ;(gsap.timeline as Mock).mockReturnValue({ to: mockTo })
        ;(useMediaQuery as Mock).mockReturnValue(false)
        
        render(<Performance />)
        
        const useGSAPCall = (useGSAP as Mock).mock.calls[0]
        const animationCallback = useGSAPCall[0]
        const options = useGSAPCall[1]
        
        const mockSection = document.createElement('section')
        options.scope.current = mockSection
        
        animationCallback()
        
        // Should animate p1, p2, p3, p4, p6, p7 (skips p5)
        expect(mockTo).toHaveBeenCalledWith('.p1', expect.objectContaining({ left: '5%', bottom: '65%' }), 0)
        expect(mockTo).toHaveBeenCalledWith('.p2', expect.objectContaining({ right: '10%', bottom: '60%' }), 0)
        expect(mockTo).toHaveBeenCalledWith('.p6', expect.objectContaining({ left: '2%', bottom: '30%' }), 0)
      })

      it('should skip p5 image animation', () => {
        const mockTo = vi.fn().mockReturnThis()
        ;(gsap.timeline as Mock).mockReturnValue({ to: mockTo })
        ;(useMediaQuery as Mock).mockReturnValue(false)
        
        render(<Performance />)
        
        const useGSAPCall = (useGSAP as Mock).mock.calls[0]
        const animationCallback = useGSAPCall[0]
        const options = useGSAPCall[1]
        
        const mockSection = document.createElement('section')
        options.scope.current = mockSection
        
        animationCallback()
        
        // p5 should be skipped
        const p5Calls = mockTo.mock.calls.filter((call: unknown[]) => call[0] === '.p5')
        expect(p5Calls).toHaveLength(0)
      })

      it('should return early if sectionRef is null', () => {
        render(<Performance />)
        
        const useGSAPCall = (useGSAP as Mock).mock.calls[0]
        const animationCallback = useGSAPCall[0]
        const options = useGSAPCall[1]
        
        // Clear mocks before testing null ref behavior
        vi.clearAllMocks()
        
        // Set scope.current to null explicitly
        options.scope.current = null
        
        // Execute the callback
        animationCallback()
        
        // Should not call any GSAP methods when ref is null
        expect(gsap.fromTo).not.toHaveBeenCalled()
        expect(gsap.timeline).not.toHaveBeenCalled()
      })
    })
  })

  describe('Structure', () => {
    it('should have wrapper container for images', () => {
      render(<Performance />)
      
      const wrapper = document.querySelector('.wrapper')
      expect(wrapper).toBeInTheDocument()
      expect(wrapper?.querySelectorAll('img')).toHaveLength(7)
    })

    it('should have section ref attached', () => {
      render(<Performance />)
      
      const section = document.querySelector('#performance')
      expect(section).toBeInTheDocument()
    })
  })
})
