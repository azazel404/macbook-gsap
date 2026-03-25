import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

describe("Navbar", () => {
  describe("rendering", () => {
    it("should render the Apple logo", () => {
      // Arrange & Act
      render(<Navbar />);

      // Assert
      const logo = screen.getByAltText("Apple Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "logo.svg");
    });

    it("should render all navigation links from navLinks", () => {
      // Arrange & Act
      render(<Navbar />);

      // Assert
      const expectedLinks = ["Store", "Mac", "iPhone", "Watch", "Vision", "AirPods"];
      expectedLinks.forEach((link) => {
        expect(screen.getByText(link)).toBeInTheDocument();
      });
    });

    it("should render navigation links as anchor tags with correct href", () => {
      // Arrange & Act
      render(<Navbar />);

      // Assert
      const storeLink = screen.getByText("Store");
      expect(storeLink.tagName).toBe("A");
      expect(storeLink).toHaveAttribute("href", "Store");
    });

    it("should render search button with correct icon", () => {
      // Arrange & Act
      render(<Navbar />);

      // Assert
      const searchIcon = screen.getByAltText("Search");
      expect(searchIcon).toBeInTheDocument();
      expect(searchIcon).toHaveAttribute("src", "/search.svg");
    });

    it("should render cart button with correct icon", () => {
      // Arrange & Act
      render(<Navbar />);

      // Assert
      const cartIcon = screen.getByAltText("Cart");
      expect(cartIcon).toBeInTheDocument();
      expect(cartIcon).toHaveAttribute("src", "/cart.svg");
    });
  });

  describe("structure", () => {
    it("should be wrapped in header element", () => {
      // Arrange & Act
      const { container } = render(<Navbar />);

      // Assert
      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });

    it("should contain nav element inside header", () => {
      // Arrange & Act
      const { container } = render(<Navbar />);

      // Assert
      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });

    it("should have unordered list for navigation links", () => {
      // Arrange & Act
      const { container } = render(<Navbar />);

      // Assert
      const ul = container.querySelector("ul");
      expect(ul).toBeInTheDocument();
    });

    it("should have list items with correct keys", () => {
      // Arrange & Act
      const { container } = render(<Navbar />);

      // Assert
      const listItems = container.querySelectorAll("li");
      expect(listItems.length).toBe(6);
    });
  });

  describe("buttons", () => {
    it("should render search and cart buttons as button elements", () => {
      // Arrange & Act
      const { container } = render(<Navbar />);

      // Assert
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBe(2);
    });

    it("should wrap icons inside buttons", () => {
      // Arrange & Act
      render(<Navbar />);

      // Assert
      const searchButton = screen.getByAltText("Search").closest("button");
      const cartButton = screen.getByAltText("Cart").closest("button");
      expect(searchButton).toBeInTheDocument();
      expect(cartButton).toBeInTheDocument();
    });
  });
});
