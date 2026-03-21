import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseCheckbox } from "../BaseCheckbox";

describe("BaseCheckbox", () => {
  describe("Rendering", () => {
    it("renders without label", () => {
      const { container } = render(<BaseCheckbox />);
      const checkbox = container.querySelector('button[role="checkbox"]');
      expect(checkbox).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<BaseCheckbox label="Accept terms" />);
      expect(screen.getByText("Accept terms")).toBeInTheDocument();
    });

    it("renders with description", () => {
      render(
        <BaseCheckbox label="Subscribe" description="Receive weekly updates" />,
      );
      expect(screen.getByText("Subscribe")).toBeInTheDocument();
      expect(screen.getByText("Receive weekly updates")).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("toggles checked state on click", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(
        <BaseCheckbox onCheckedChange={handleChange} />,
      );
      const checkbox = container.querySelector('button[role="checkbox"]');

      await user.click(checkbox!);
      expect(handleChange).toHaveBeenCalledWith(true);

      await user.click(checkbox!);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it("can be controlled", async () => {
      const handleChange = vi.fn();
      const { container, rerender } = render(
        <BaseCheckbox checked={false} onCheckedChange={handleChange} />,
      );
      const checkbox = container.querySelector('button[role="checkbox"]');

      expect(checkbox).toHaveAttribute("data-state", "unchecked");

      rerender(<BaseCheckbox checked={true} onCheckedChange={handleChange} />);
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("clicking label toggles checkbox", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseCheckbox label="Accept terms" onCheckedChange={handleChange} />,
      );

      const label = screen.getByText("Accept terms");
      await user.click(label);
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe("States", () => {
    it("shows error state", () => {
      const { container } = render(<BaseCheckbox error={true} />);
      const checkbox = container.querySelector('button[role="checkbox"]');
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
    });

    it("can be disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(
        <BaseCheckbox disabled onCheckedChange={handleChange} />,
      );
      const checkbox = container.querySelector('button[role="checkbox"]');

      expect(checkbox).toBeDisabled();

      await user.click(checkbox!);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("links label to checkbox via id", () => {
      render(<BaseCheckbox label="Accept terms" />);
      const label = screen.getByText("Accept terms");
      const labelElement = label.closest("label");
      expect(labelElement).toHaveAttribute("for");
    });

    it("provides description for screen readers", () => {
      render(
        <BaseCheckbox label="Subscribe" description="Receive weekly updates" />,
      );
      expect(screen.getByText("Receive weekly updates")).toBeInTheDocument();
    });
  });
});
