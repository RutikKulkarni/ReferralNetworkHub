import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseRadioGroup } from "../BaseRadioGroup";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("BaseRadioGroup", () => {
  describe("Rendering", () => {
    it("renders all radio options", () => {
      render(<BaseRadioGroup options={mockOptions} />);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("renders in vertical direction by default", () => {
      const { container } = render(<BaseRadioGroup options={mockOptions} />);
      const radioGroup = container.querySelector('[role="radiogroup"]');
      expect(radioGroup).toHaveClass("grid gap-3");
    });

    it("renders in horizontal direction when specified", () => {
      const { container } = render(
        <BaseRadioGroup options={mockOptions} direction="horizontal" />,
      );
      const radioGroup = container.querySelector('[role="radiogroup"]');
      expect(radioGroup).toHaveClass("flex flex-wrap gap-4");
    });

    it("renders with selected value", () => {
      render(<BaseRadioGroup options={mockOptions} value="option2" />);
      const radio2 = screen.getByRole("radio", { name: "Option 2" });
      expect(radio2).toBeChecked();
    });

    it("renders with icons when provided", () => {
      const optionsWithIcons = [
        { value: "email", label: "Email", icon: <span>📧</span> },
        { value: "phone", label: "Phone", icon: <span>📱</span> },
      ];

      render(<BaseRadioGroup options={optionsWithIcons} />);
      expect(screen.getByText("📧")).toBeInTheDocument();
      expect(screen.getByText("📱")).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("selects a radio option on click", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseRadioGroup options={mockOptions} onValueChange={handleChange} />,
      );

      const radio2 = screen.getByRole("radio", { name: "Option 2" });
      await user.click(radio2);

      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("clicking label selects radio", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseRadioGroup options={mockOptions} onValueChange={handleChange} />,
      );

      const label = screen.getByText("Option 1");
      await user.click(label);

      expect(handleChange).toHaveBeenCalledWith("option1");
    });

    it("only one option can be selected at a time", async () => {
      const user = userEvent.setup();
      render(<BaseRadioGroup options={mockOptions} />);

      const radio1 = screen.getByRole("radio", { name: "Option 1" });
      const radio2 = screen.getByRole("radio", { name: "Option 2" });

      await user.click(radio1);
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      await user.click(radio2);
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });
  });

  describe("States", () => {
    it("shows error state", () => {
      const { container } = render(
        <BaseRadioGroup options={mockOptions} error={true} />,
      );
      const radioGroup = container.querySelector('[role="radiogroup"]');
      expect(radioGroup).toHaveAttribute("aria-invalid", "true");
    });

    it("can be disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseRadioGroup
          options={mockOptions}
          disabled
          onValueChange={handleChange}
        />,
      );

      const radio1 = screen.getByRole("radio", { name: "Option 1" });
      expect(radio1).toBeDisabled();

      await user.click(radio1);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("can disable individual options", () => {
      const optionsWithDisabled = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2", disabled: true },
        { value: "option3", label: "Option 3" },
      ];

      render(<BaseRadioGroup options={optionsWithDisabled} />);

      const radio1 = screen.getByRole("radio", { name: "Option 1" });
      const radio2 = screen.getByRole("radio", { name: "Option 2" });
      const radio3 = screen.getByRole("radio", { name: "Option 3" });

      expect(radio1).not.toBeDisabled();
      expect(radio2).toBeDisabled();
      expect(radio3).not.toBeDisabled();
    });
  });

  describe("Controlled Component", () => {
    it("works as controlled component", () => {
      const { rerender } = render(
        <BaseRadioGroup options={mockOptions} value="option1" />,
      );

      const radio1 = screen.getByRole("radio", { name: "Option 1" });
      expect(radio1).toBeChecked();

      rerender(<BaseRadioGroup options={mockOptions} value="option2" />);

      const radio2 = screen.getByRole("radio", { name: "Option 2" });
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    it("has radiogroup role", () => {
      const { container } = render(<BaseRadioGroup options={mockOptions} />);
      const radioGroup = container.querySelector('[role="radiogroup"]');
      expect(radioGroup).toBeInTheDocument();
    });

    it("associates labels with radio buttons", () => {
      render(<BaseRadioGroup options={mockOptions} />);

      const radio1 = screen.getByRole("radio", { name: "Option 1" });
      const label1 = screen.getByText("Option 1");
      const labelElement = label1.closest("label");

      expect(labelElement).toHaveAttribute("for", radio1.id);
    });
  });
});
