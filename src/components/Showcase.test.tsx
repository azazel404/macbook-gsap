import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import Showcase from './Showcase'

// Mock react-responsive
vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(() => false),
}))

// Mock @gsap/react
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callback) => callback()),
}))

// Mock gsap
vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
    })),
  },
}))

import { useMediaQuery } from 'react-responsive'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

describe('Showcase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useMediaQuery as Mock).mockReturnValue(false)
  })

  describe('Rendering', () => {
    it('should render the showcase section', () => {
      render(<Showcase />)
      
      const section = document.querySelector('#showcase')
      expect(section).toBeInTheDocument()
    })

    it('should render the video element with correct attributes', () => {
      render(<Showcase />)
      
      const videoElement = document.querySelector('video') as HTMLVideoElement
      
      expect(videoElement).toBeInTheDocument()
      expect(videoElement).toHaveAttribute('src', '/videos/game.mp4')
      expect(videoElement).toHaveAttribute('loop')
      expect(videoElement.muted).toBe(true)
      expect(videoElement).toHaveAttribute('autoplay')
      expect(videoElement).toHaveAttribute('playsinline')
    })

    it('should render the mask logo image', () => {
      render(<Showcase />)
      
      const maskImg = document.querySelector('.mask img') as HTMLImageElement
      expect(maskImg).toBeInTheDocument()
      expect(maskImg).toHaveAttribute('src', '/mask-logo.svg')
    })

    it('should render the main heading', () => {
      render(<Showcase />)
      
      expect(screen.getByRole('heading', { name: /rocket chip/i })).toBeInTheDocument()
    })

    it('should render M4 chip description text', () => {
      render(<Showcase />)
      
      expect(screen.getByText(/M4, the next generation of Apple silicon/i)).toBeInTheDocument()
      expect(screen.getByText(/It drives Apple Intelligence on iPad Pro/i)).toBeInTheDocument()
      expect(screen.getByText(/A brand-new display engine/i)).toBeInTheDocument()
    })

    it('should render the Apple Intelligence link text', () => {
      render(<Showcase />)
      
      expect(screen.getByText(/Learn more about Apple Intelligence/i)).toBeInTheDocument()
    })

    it('should render performance stats', () => {
      render(<Showcase />)
      
      expect(screen.getByText(/4x faster/i)).toBeInTheDocument()
      expect(screen.getByText(/pro rendering performance than M2/i)).toBeInTheDocument()
      expect(screen.getByText(/1\.5x faster/i)).toBeInTheDocument()
      expect(screen.getByText(/CPU performance than M2/i)).toBeInTheDocument()
    })
  })

  describe('Media Query Behavior', () => {
    it('should call useMediaQuery with correct breakpoint', () => {
      render(<Showcase />)
      
      expect(useMediaQuery).toHaveBeenCalledWith({ query: '(max-width: 1024px)' })
    })
  })

  describe('GSAP Animation', () => {
    it('should call useGSAP hook', () => {
      render(<Showcase />)
      
      expect(useGSAP).toHaveBeenCalled()
    })

    it('should create GSAP timeline on desktop (non-tablet)', () => {
      ;(useMediaQuery as Mock).mockReturnValue(false)
      
      render(<Showcase />)
      
      expect(gsap.timeline).toHaveBeenCalledWith({
        scrollTrigger: {
          trigger: '#showcase',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: true,
        },
      })
    })

    it('should NOT create GSAP timeline on tablet', () => {
      ;(useMediaQuery as Mock).mockReturnValue(true)
      
      render(<Showcase />)
      
      expect(gsap.timeline).not.toHaveBeenCalled()
    })

    it('should pass isTablet as dependency to useGSAP', () => {
      ;(useMediaQuery as Mock).mockReturnValue(false)
      
      render(<Showcase />)
      
      expect(useGSAP).toHaveBeenCalledWith(expect.any(Function), [false])
    })

    it('should animate mask image and content on desktop', () => {
      const mockTo = vi.fn().mockReturnThis()
      ;(gsap.timeline as Mock).mockReturnValue({ to: mockTo })
      ;(useMediaQuery as Mock).mockReturnValue(false)
      
      render(<Showcase />)
      
      expect(mockTo).toHaveBeenCalledWith('.mask img', { transform: 'scale(1.1)' })
      expect(mockTo).toHaveBeenCalledWith('.content', { opacity: 1, y: 0, ease: 'power1.in' })
    })
  })

  describe('Structure', () => {
    it('should have media container with video and mask', () => {
      render(<Showcase />)
      
      const mediaDiv = document.querySelector('.media')
      expect(mediaDiv).toBeInTheDocument()
      expect(mediaDiv?.querySelector('video')).toBeInTheDocument()
      expect(mediaDiv?.querySelector('.mask')).toBeInTheDocument()
    })

    it('should have content container with wrapper', () => {
      render(<Showcase />)
      
      const contentDiv = document.querySelector('.content')
      expect(contentDiv).toBeInTheDocument()
      expect(contentDiv?.querySelector('.wrapper')).toBeInTheDocument()
    })
  })
})
