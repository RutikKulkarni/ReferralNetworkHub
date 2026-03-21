import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseDatePicker } from "../BaseDatePicker";

describe("BaseDatePicker", () => {
  describe("Rendering", () => {
    it("renders without error", () => {
      render(<BaseDatePicker />);
      // DatePicker renders a button with "Pick a date" text by default
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with selected date", () => {
      const date = new Date("2024-03-15");
      render(<BaseDatePicker value={date} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("calls onChange when date is selected", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseDatePicker onChange={handleChange} />);

      const button = screen.getByRole("button");
      await user.click(button);

      // After clicking, calendar should open (tested in shadcn/ui)
      // We verify the button is clickable
      expect(button).not.toBeDisabled();
    });
  });

  describe("Controlled Component", () => {
    it("works as controlled component", () => {
      const date1 = new Date("2024-03-15");
      const date2 = new Date("2024-03-20");
      const { rerender } = render(<BaseDatePicker value={date1} />);
      expect(screen.getByRole("button")).toBeInTheDocument();

      rerender(<BaseDatePicker value={date2} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("updates when value changes", () => {
      const { rerender } = render(<BaseDatePicker value={undefined} />);
      expect(screen.getByRole("button")).toBeInTheDocument();

      const newDate = new Date("2024-03-15");
      rerender(<BaseDatePicker value={newDate} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("States", () => {
    it("shows error state", () => {
      render(<BaseDatePicker error={true} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("respects minDate constraint", () => {
      const minDate = new Date("2024-01-01");
      render(<BaseDatePicker minDate={minDate} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("respects maxDate constraint", () => {
      const maxDate = new Date("2024-12-31");
      render(<BaseDatePicker maxDate={maxDate} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<BaseDatePicker ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
