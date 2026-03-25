import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock dependencies before importing the component
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <div data-testid="canvas" id={id}>
      {children}
    </div>
  ),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Environment: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Lightformer: () => <div />,
  useGLTF: Object.assign(
    () => ({
      nodes: {},
      materials: {},
      scene: {},
    }),
    { preload: vi.fn() }
  ),
}));

vi.mock("react-responsive", () => ({
  useMediaQuery: () => false,
}));

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      call: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock("../../store/MacbookStore", () => ({
  default: () => ({
    setTexture: vi.fn(),
  }),
}));

vi.mock("../three/StudioLights.jsx", () => ({
  default: () => <div data-testid="studio-lights" />,
}));

vi.mock("../models/Macbook.jsx", () => ({
  default: ({ scale, position }: { scale: number; position: number[] }) => (
    <div
      data-testid="macbook-model"
      data-scale={scale}
      data-position={position.join(",")}
    />
  ),
}));

import Features from "../Features";
import { features, featureSequence } from "../../constants/index";

describe("Features", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("should render the section with id features", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      const section = container.querySelector("section#features");
      expect(section).toBeInTheDocument();
    });

    it("should render the heading text", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByText("See it all in a new light.")).toBeInTheDocument();
    });

    it("should render the Canvas component with correct id", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      const canvas = screen.getByTestId("canvas");
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute("id", "f-canvas");
    });

    it("should render StudioLights component", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByTestId("studio-lights")).toBeInTheDocument();
    });

    it("should render MacbookModel component", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByTestId("macbook-model")).toBeInTheDocument();
    });
  });

  describe("feature boxes", () => {
    it("should render all feature boxes", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      const boxes = container.querySelectorAll(".box");
      expect(boxes).toHaveLength(features.length);
    });

    it("should render feature boxes with correct class names", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      features.forEach((_, index) => {
        const box = container.querySelector(`.box${index + 1}`);
        expect(box).toBeInTheDocument();
      });
    });

    it("should render all feature icons", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      features.forEach((feature) => {
        const icon = screen.getByAltText(feature.highlight);
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("src", feature.icon);
      });
    });

    it("should render all feature highlight texts", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      features.forEach((feature) => {
        expect(screen.getByText(feature.highlight)).toBeInTheDocument();
      });
    });

    it("should render all feature description texts", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      features.forEach((feature) => {
        expect(screen.getByText(feature.text)).toBeInTheDocument();
      });
    });

    it("should render feature highlight text with white color class", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      const highlightSpans = container.querySelectorAll("span.text-white");
      expect(highlightSpans).toHaveLength(features.length);
    });
  });

  describe("feature content", () => {
    it("should render Email AI feature correctly", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByText("Email AI.")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Summarize and draft replies to emails instantly, so you stay on top of your inbox."
        )
      ).toBeInTheDocument();
    });

    it("should render Image AI feature correctly", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByText("Image AI.")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Generate or edit images with ease. Just type what you imagine, and let AI bring it to life."
        )
      ).toBeInTheDocument();
    });

    it("should render Summarize AI feature correctly", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByText("Summarize AI.")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Turn long articles, reports, or notes into clear, bite-sized summaries in seconds."
        )
      ).toBeInTheDocument();
    });

    it("should render AirDrop feature correctly", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByText("AirDrop.")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Wirelessly share photos, large files, and more between your iPhone, your Mac, & other devices."
        )
      ).toBeInTheDocument();
    });

    it("should render Writing Tool feature correctly", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      expect(screen.getByText("Writing Tool.")).toBeInTheDocument();
      expect(
        screen.getByText(/Write smarter and faster.*AI helps polish your words/)
      ).toBeInTheDocument();
    });
  });

  describe("structure", () => {
    it("should contain h2 element with correct text", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      const h2 = container.querySelector("h2");
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveTextContent("See it all in a new light.");
    });

    it("should have absolute positioned container for feature boxes", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      const absoluteContainer = container.querySelector(".absolute.inset-0");
      expect(absoluteContainer).toBeInTheDocument();
    });

    it("should render feature boxes inside absolute container", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      const absoluteContainer = container.querySelector(".absolute.inset-0");
      const boxes = absoluteContainer?.querySelectorAll(".box");
      expect(boxes).toHaveLength(features.length);
    });
  });

  describe("accessibility", () => {
    it("should have images with descriptive alt text", () => {
      // Arrange & Act
      render(<Features />);

      // Assert
      features.forEach((feature) => {
        const img = screen.getByAltText(feature.highlight);
        expect(img).toBeInTheDocument();
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });

    it("should have semantic section element", () => {
      // Arrange & Act
      const { container } = render(<Features />);

      // Assert
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute("id", "features");
    });
  });

  // describe("feature data integrity", () => {
  //   it("should have correct number of features in constants", () => {
  //     // Assert
  //     expect(features).toHaveLength(5);
  //   });

  //   it("should have correct number of feature sequences", () => {
  //     // Assert
  //     expect(featureSequence).toHaveLength(5);
  //   });

  //   it("should have unique feature ids", () => {
  //     // Arrange
  //     const ids = features.map((f) => f.id);
  //     const uniqueIds = new Set(ids);

  //     // Assert
  //     expect(uniqueIds.size).toBe(features.length);
  //   });

  //   it("should have all required feature properties", () => {
  //     // Assert
  //     features.forEach((feature) => {
  //       expect(feature).toHaveProperty("id");
  //       expect(feature).toHaveProperty("icon");
  //       expect(feature).toHaveProperty("highlight");
  //       expect(feature).toHaveProperty("text");
  //       expect(feature).toHaveProperty("styles");
  //     });
  //   });

  //   it("should have all required featureSequence properties", () => {
  //     // Assert
  //     featureSequence.forEach((sequence) => {
  //       expect(sequence).toHaveProperty("videoPath");
  //       expect(sequence).toHaveProperty("boxClass");
  //       expect(sequence).toHaveProperty("delay");
  //     });
  //   });
  // });
});
