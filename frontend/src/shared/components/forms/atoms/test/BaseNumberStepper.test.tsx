import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseNumberStepper } from "../BaseNumberStepper";

describe("BaseNumberStepper", () => {
  describe("Rendering", () => {
    it("renders with default value 0", () => {
      render(<BaseNumberStepper />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(0);
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    it("renders with custom value", () => {
      render(<BaseNumberStepper value={5} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(5);
    });

    it("renders increment and decrement buttons", () => {
      render(<BaseNumberStepper />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("renders with min and max constraints", () => {
      render(<BaseNumberStepper value={5} min={0} max={10} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "10");
    });
  });

  describe("User Interaction", () => {
    it("increments value when plus button is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseNumberStepper value={5} onChange={handleChange} />);

      const buttons = screen.getAllByRole("button");
      const incrementButton = buttons[1]; // Plus button is second
      await user.click(incrementButton);

      expect(handleChange).toHaveBeenCalledWith(6);
    });

    it("decrements value when minus button is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseNumberStepper value={5} onChange={handleChange} />);

      const buttons = screen.getAllByRole("button");
      const decrementButton = buttons[0]; // Minus button is first
      await user.click(decrementButton);

      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it("accepts direct input", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseNumberStepper value={5} onChange={handleChange} />);

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "10");

      expect(handleChange).toHaveBeenCalled();
    });

    it("respects custom step value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseNumberStepper value={0} step={5} onChange={handleChange} />);

      const buttons = screen.getAllByRole("button");
      const incrementButton = buttons[1];
      await user.click(incrementButton);

      expect(handleChange).toHaveBeenCalledWith(5);
    });
  });

  describe("Constraints", () => {
    it("disables decrement button at minimum value", () => {
      render(<BaseNumberStepper value={0} min={0} />);
      const buttons = screen.getAllByRole("button");
      const decrementButton = buttons[0];
      expect(decrementButton).toBeDisabled();
    });

    it("disables increment button at maximum value", () => {
      render(<BaseNumberStepper value={10} max={10} />);
      const buttons = screen.getAllByRole("button");
      const incrementButton = buttons[1];
      expect(incrementButton).toBeDisabled();
    });

    it("does not increment beyond max value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseNumberStepper value={10} max={10} onChange={handleChange} />);

      const buttons = screen.getAllByRole("button");
      const incrementButton = buttons[1];
      await user.click(incrementButton);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("does not decrement below min value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseNumberStepper value={0} min={0} onChange={handleChange} />);

      const buttons = screen.getAllByRole("button");
      const decrementButton = buttons[0];
      await user.click(decrementButton);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("rejects invalid input outside range", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseNumberStepper
          value={5}
          min={0}
          max={10}
          onChange={handleChange}
        />,
      );

      const input = screen.getByRole("spinbutton");
      await user.clear(input);
      await user.type(input, "15");

      // Should not call onChange with value outside range
      const calls = handleChange.mock.calls;
      const hasInvalidValue = calls.some((call) => call[0] > 10);
      expect(hasInvalidValue).toBe(false);
    });
  });

  describe("States", () => {
    it("can be disabled", () => {
      render(<BaseNumberStepper disabled />);
      const input = screen.getByRole("spinbutton");
      expect(input).toBeDisabled();

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it("does not respond to clicks when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseNumberStepper value={5} disabled onChange={handleChange} />);

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);
      await user.click(buttons[1]);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("shows error state", () => {
      render(<BaseNumberStepper error={true} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Controlled Component", () => {
    it("works as controlled component", () => {
      const { rerender } = render(<BaseNumberStepper value={5} />);
      expect(screen.getByRole("spinbutton")).toHaveValue(5);

      rerender(<BaseNumberStepper value={10} />);
      expect(screen.getByRole("spinbutton")).toHaveValue(10);
    });

    it("updates constraints dynamically", () => {
      const { rerender } = render(<BaseNumberStepper value={5} max={10} />);
      const buttons = screen.getAllByRole("button");
      const incrementButton = buttons[1];
      expect(incrementButton).not.toBeDisabled();

      rerender(<BaseNumberStepper value={5} max={5} />);
      expect(incrementButton).toBeDisabled();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<BaseNumberStepper ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<BaseNumberStepper value={5} min={0} max={10} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "10");
      expect(input).toHaveAttribute("step", "1");
    });

    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      render(<BaseNumberStepper />);

      await user.tab();
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveFocus();
    });
  });
});
