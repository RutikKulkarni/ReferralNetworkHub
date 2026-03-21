import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseSelect } from "../BaseSelect";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3", disabled: true },
];

describe("BaseSelect", () => {
  describe("Rendering", () => {
    it("renders with placeholder", () => {
      render(
        <BaseSelect options={mockOptions} placeholder="Choose an option" />,
      );
      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("renders with default placeholder", () => {
      render(<BaseSelect options={mockOptions} />);
      expect(screen.getByText("Select an option...")).toBeInTheDocument();
    });

    it("renders with selected value", () => {
      render(<BaseSelect options={mockOptions} value="option1" />);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("renders with icon in options", async () => {
      const user = userEvent.setup();
      const optionsWithIcon = [
        { value: "email", label: "Email", icon: <span>📧</span> },
        { value: "phone", label: "Phone", icon: <span>📱</span> },
      ];

      render(<BaseSelect options={optionsWithIcon} />);
      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      // Wait for the dropdown to open and check for icons
      await waitFor(() => {
        expect(screen.getByText("📧")).toBeInTheDocument();
      });
      expect(screen.getByText("📱")).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("opens dropdown on click", async () => {
      const user = userEvent.setup();
      render(<BaseSelect options={mockOptions} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      // Wait for options to appear
      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "Option 1" }),
        ).toBeInTheDocument();
      });
      expect(
        screen.getByRole("option", { name: "Option 2" }),
      ).toBeInTheDocument();
    });

    it("selects an option", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseSelect options={mockOptions} onValueChange={handleChange} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      // Wait for the option to appear
      const option = await screen.findByRole("option", { name: "Option 2" });
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("does not select disabled option", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<BaseSelect options={mockOptions} onValueChange={handleChange} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      // Wait for the disabled option to appear
      const disabledOption = await screen.findByRole("option", {
        name: "Option 3",
      });
      expect(disabledOption).toHaveAttribute("data-disabled", "");
    });
  });

  describe("States", () => {
    it("shows error state", () => {
      render(<BaseSelect options={mockOptions} error={true} />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("can be disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseSelect
          options={mockOptions}
          disabled
          onValueChange={handleChange}
        />,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Controlled Component", () => {
    it("works as controlled component", () => {
      const { rerender } = render(
        <BaseSelect options={mockOptions} value="option1" />,
      );
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      rerender(<BaseSelect options={mockOptions} value="option2" />);
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });
});
