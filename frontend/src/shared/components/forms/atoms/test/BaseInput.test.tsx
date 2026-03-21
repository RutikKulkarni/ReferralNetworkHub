import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseInput } from "../BaseInput";

describe("BaseInput", () => {
  describe("Rendering", () => {
    it("renders with default text type", () => {
      render(<BaseInput placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });

    it("renders with custom type", () => {
      render(<BaseInput type="email" placeholder="Enter email" />);
      const input = screen.getByPlaceholderText("Enter email");
      expect(input).toHaveAttribute("type", "email");
    });

    it("renders with prefix", () => {
      render(<BaseInput prefix={<span>$</span>} placeholder="Amount" />);
      expect(screen.getByText("$")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
    });

    it("renders with suffix", () => {
      render(<BaseInput suffix={<span>USD</span>} placeholder="Amount" />);
      expect(screen.getByText("USD")).toBeInTheDocument();
    });

    it("renders with both prefix and suffix", () => {
      render(
        <BaseInput
          prefix={<span>$</span>}
          suffix={<span>USD</span>}
          placeholder="Amount"
        />,
      );
      expect(screen.getByText("$")).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("accepts user input", async () => {
      const user = userEvent.setup();
      render(<BaseInput placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");

      await user.type(input, "Hello World");
      expect(input).toHaveValue("Hello World");
    });

    it("calls onChange handler", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseInput placeholder="Enter text" onChange={handleChange} />);
      const input = screen.getByPlaceholderText("Enter text");

      await user.type(input, "Test");
      expect(handleChange).toHaveBeenCalled();
    });

    it("can be cleared", async () => {
      const user = userEvent.setup();
      render(<BaseInput placeholder="Enter text" defaultValue="Initial" />);
      const input = screen.getByPlaceholderText("Enter text");

      expect(input).toHaveValue("Initial");
      await user.clear(input);
      expect(input).toHaveValue("");
    });
  });

  describe("States", () => {
    it("shows error state", () => {
      render(<BaseInput placeholder="Enter text" error={true} />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("can be disabled", () => {
      render(<BaseInput placeholder="Enter text" disabled />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeDisabled();
    });

    it("can be readonly", () => {
      render(<BaseInput placeholder="Enter text" readOnly value="Read only" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toHaveAttribute("readonly");
    });
  });

  describe("Accessibility", () => {
    it("accepts custom aria attributes", () => {
      render(
        <BaseInput
          placeholder="Enter text"
          aria-label="Custom label"
          aria-describedby="helper-text"
        />,
      );
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toHaveAttribute("aria-label", "Custom label");
      expect(input).toHaveAttribute("aria-describedby", "helper-text");
    });
  });

  describe("Forwarding Ref", () => {
    it("forwards ref correctly", () => {
      const ref = vi.fn();
      render(<BaseInput ref={ref} placeholder="Enter text" />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
