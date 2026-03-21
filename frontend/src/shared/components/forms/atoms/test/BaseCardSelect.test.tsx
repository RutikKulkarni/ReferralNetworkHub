import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseCardSelect } from "../BaseCardSelect";

const mockOptions = [
  { value: "option1", label: "Option 1", description: "First option" },
  { value: "option2", label: "Option 2", description: "Second option" },
  { value: "option3", label: "Option 3", description: "Third option" },
];

const mockOptionsWithIcons = [
  {
    value: "email",
    label: "Email",
    description: "Receive updates via email",
    icon: <span>📧</span>,
  },
  {
    value: "sms",
    label: "SMS",
    description: "Receive updates via text",
    icon: <span>📱</span>,
  },
];

describe("BaseCardSelect", () => {
  describe("Rendering", () => {
    it("renders all options", () => {
      render(<BaseCardSelect options={mockOptions} />);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("renders option descriptions", () => {
      render(<BaseCardSelect options={mockOptions} />);
      expect(screen.getByText("First option")).toBeInTheDocument();
      expect(screen.getByText("Second option")).toBeInTheDocument();
      expect(screen.getByText("Third option")).toBeInTheDocument();
    });

    it("renders with icons", () => {
      render(<BaseCardSelect options={mockOptionsWithIcons} />);
      expect(screen.getByText("📧")).toBeInTheDocument();
      expect(screen.getByText("📱")).toBeInTheDocument();
    });

    it("renders with selected value", () => {
      render(<BaseCardSelect options={mockOptions} value="option1" />);
      const selectedCard = screen.getByRole("radio", { name: /Option 1/i });
      expect(selectedCard).toHaveAttribute("aria-checked", "true");
    });

    it("renders with custom column layout", () => {
      const { container } = render(
        <BaseCardSelect options={mockOptions} columns={2} />,
      );
      const grid = container.querySelector('[role="radiogroup"]');
      expect(grid).toHaveClass("grid-cols-2");
    });

    it("renders with 3 columns by default", () => {
      const { container } = render(<BaseCardSelect options={mockOptions} />);
      const grid = container.querySelector('[role="radiogroup"]');
      expect(grid).toHaveClass("grid-cols-3");
    });
  });

  describe("User Interaction", () => {
    it("selects an option when clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseCardSelect options={mockOptions} onChange={handleChange} />);

      const option2 = screen.getByRole("radio", { name: /Option 2/i });
      await user.click(option2);

      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("changes selection when different option is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseCardSelect
          options={mockOptions}
          value="option1"
          onChange={handleChange}
        />,
      );

      const option3 = screen.getByRole("radio", { name: /Option 3/i });
      await user.click(option3);

      expect(handleChange).toHaveBeenCalledWith("option3");
    });

    it("does not call onChange for disabled option", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithDisabled = [
        ...mockOptions,
        { value: "option4", label: "Option 4", disabled: true },
      ];
      render(
        <BaseCardSelect
          options={optionsWithDisabled}
          onChange={handleChange}
        />,
      );

      const disabledOption = screen.getByRole("radio", { name: /Option 4/i });
      await user.click(disabledOption);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("States", () => {
    it("shows selected state visually", () => {
      render(<BaseCardSelect options={mockOptions} value="option2" />);
      const selectedCard = screen.getByRole("radio", { name: /Option 2/i });
      expect(selectedCard).toHaveClass("border-primary");
    });

    it("disables all options when disabled prop is true", () => {
      render(<BaseCardSelect options={mockOptions} disabled />);
      const cards = screen.getAllByRole("radio");
      cards.forEach((card) => {
        expect(card).toBeDisabled();
      });
    });

    it("disables specific options marked as disabled", () => {
      const optionsWithDisabled = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2", disabled: true },
      ];
      render(<BaseCardSelect options={optionsWithDisabled} />);

      const option1 = screen.getByRole("radio", { name: /Option 1/i });
      const option2 = screen.getByRole("radio", { name: /Option 2/i });

      expect(option1).not.toBeDisabled();
      expect(option2).toBeDisabled();
    });

    it("shows error state", () => {
      const { container } = render(
        <BaseCardSelect options={mockOptions} error={true} />,
      );
      const radioGroup = container.querySelector('[role="radiogroup"]');
      expect(radioGroup).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Controlled Component", () => {
    it("works as controlled component", () => {
      const { rerender } = render(
        <BaseCardSelect options={mockOptions} value="option1" />,
      );
      let selectedCard = screen.getByRole("radio", { name: /Option 1/i });
      expect(selectedCard).toHaveAttribute("aria-checked", "true");

      rerender(<BaseCardSelect options={mockOptions} value="option2" />);
      selectedCard = screen.getByRole("radio", { name: /Option 2/i });
      expect(selectedCard).toHaveAttribute("aria-checked", "true");
    });

    it("updates selection when value changes", () => {
      const { rerender } = render(
        <BaseCardSelect options={mockOptions} value="option1" />,
      );
      expect(screen.getByRole("radio", { name: /Option 1/i })).toHaveAttribute(
        "aria-checked",
        "true",
      );

      rerender(<BaseCardSelect options={mockOptions} value="option3" />);
      expect(screen.getByRole("radio", { name: /Option 3/i })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<BaseCardSelect options={mockOptions} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Accessibility", () => {
    it("has proper radiogroup role", () => {
      const { container } = render(<BaseCardSelect options={mockOptions} />);
      const radioGroup = container.querySelector('[role="radiogroup"]');
      expect(radioGroup).toBeInTheDocument();
    });

    it("has proper radio roles for options", () => {
      render(<BaseCardSelect options={mockOptions} />);
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
    });

    it("uses aria-checked for selection state", () => {
      render(<BaseCardSelect options={mockOptions} value="option2" />);
      const option1 = screen.getByRole("radio", { name: /Option 1/i });
      const option2 = screen.getByRole("radio", { name: /Option 2/i });
      const option3 = screen.getByRole("radio", { name: /Option 3/i });

      expect(option1).toHaveAttribute("aria-checked", "false");
      expect(option2).toHaveAttribute("aria-checked", "true");
      expect(option3).toHaveAttribute("aria-checked", "false");
    });

    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseCardSelect options={mockOptions} onChange={handleChange} />);

      await user.tab();
      const firstOption = screen.getByRole("radio", { name: /Option 1/i });
      expect(firstOption).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleChange).toHaveBeenCalledWith("option1");
    });

    it("supports focus-visible for keyboard navigation", () => {
      render(<BaseCardSelect options={mockOptions} />);
      const cards = screen.getAllByRole("radio");
      cards.forEach((card) => {
        expect(card).toHaveClass("focus-visible:ring-2");
      });
    });
  });

  describe("Layout", () => {
    it("supports 2-column layout", () => {
      const { container } = render(
        <BaseCardSelect options={mockOptions} columns={2} />,
      );
      const grid = container.querySelector('[role="radiogroup"]');
      expect(grid).toHaveClass("grid-cols-2");
    });

    it("supports 4-column layout", () => {
      const { container } = render(
        <BaseCardSelect options={mockOptions} columns={4} />,
      );
      const grid = container.querySelector('[role="radiogroup"]');
      expect(grid).toHaveClass("grid-cols-4");
    });
  });
});
