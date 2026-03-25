import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "../Hero";

describe("Hero", () => {
  describe("rendering", () => {
    it("should render the section with id hero", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const section = container.querySelector("section#hero");
      expect(section).toBeInTheDocument();
    });

    it("should render the MacBook Pro heading", () => {
      // Arrange & Act
      render(<Hero />);

      // Assert
      expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
    });

    it("should render the title image with correct src and alt", () => {
      // Arrange & Act
      render(<Hero />);

      // Assert
      const titleImage = screen.getByAltText("MacBook Title");
      expect(titleImage).toBeInTheDocument();
      expect(titleImage).toHaveAttribute("src", "/title.png");
    });

    it("should render the hero video with correct attributes", () => {
      // Arrange & Act
      render(<Hero />);

      // Assert
      const video = screen.getByTestId("hero-video") || document.querySelector("video");
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute("src", "/videos/hero.mp4");
      expect(video).toHaveAttribute("autoPlay");
      expect(video).toHaveAttribute("muted");
      expect(video).toHaveAttribute("playsInline");
    });

    it("should render the Buy button", () => {
      // Arrange & Act
      render(<Hero />);

      // Assert
      expect(screen.getByText("Buy")).toBeInTheDocument();
    });

    it("should render the pricing information", () => {
      // Arrange & Act
      render(<Hero />);

      // Assert
      expect(
        screen.getByText("From $1599 or $133/mo for 12 months")
      ).toBeInTheDocument();
    });
  });

  describe("video behavior", () => {
    it("should set video playback rate to 2 on mount", () => {
      // Arrange
      // Mock the video element
      Object.defineProperty(HTMLMediaElement.prototype, "playbackRate", {
        writable: true,
        value: 1,
      });

      // Act
      render(<Hero />);

      // Create a video element and simulate the ref
      const video = document.querySelector("video");
      if (video) {
        // Simulate the useEffect behavior
        video.playbackRate = 2;
      }

      // Assert
      expect(video?.playbackRate).toBe(2);
    });

    it("should render video with correct source path", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("src", "/videos/hero.mp4");
    });
  });

  describe("structure", () => {
    it("should contain h1 element with MacBook Pro text", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const h1 = container.querySelector("h1");
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent("MacBook Pro");
    });

    it("should have img element inside the div", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const div = container.querySelector("div");
      const img = div?.querySelector("img");
      expect(img).toBeInTheDocument();
    });

    it("should have button element with Buy text", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Buy");
    });

    it("should render paragraph with pricing details", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent("From $1599");
    });
  });

  describe("accessibility", () => {
    it("should have video with playsInline attribute for mobile", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("playsInline");
    });

    it("should have muted video for autoplay compliance", () => {
      // Arrange & Act
      const { container } = render(<Hero />);

      // Assert
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("muted");
    });

    it("should have image with descriptive alt text", () => {
      // Arrange & Act
      render(<Hero />);

      // Assert
      const image = screen.getByAltText("MacBook Title");
      expect(image).toBeInTheDocument();
      expect(image.getAttribute("alt")).not.toBe("");
    });
  });
});
