import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseTextarea } from "../BaseTextarea";

describe("BaseTextarea", () => {
  describe("Rendering", () => {
    it("renders with placeholder", () => {
      render(<BaseTextarea placeholder="Enter your message" />);
      expect(
        screen.getByPlaceholderText("Enter your message"),
      ).toBeInTheDocument();
    });

    it("renders with default rows", () => {
      render(<BaseTextarea placeholder="Message" />);
      const textarea = screen.getByPlaceholderText("Message");
      expect(textarea).toHaveAttribute("rows", "4");
    });

    it("renders with custom rows", () => {
      render(<BaseTextarea placeholder="Message" rows={10} />);
      const textarea = screen.getByPlaceholderText("Message");
      expect(textarea).toHaveAttribute("rows", "10");
    });

    it("renders with default value", () => {
      render(
        <BaseTextarea placeholder="Message" defaultValue="Initial text" />,
      );
      const textarea = screen.getByPlaceholderText("Message");
      expect(textarea).toHaveValue("Initial text");
    });
  });

  describe("User Interaction", () => {
    it("accepts user input", async () => {
      const user = userEvent.setup();
      render(<BaseTextarea placeholder="Enter message" />);
      const textarea = screen.getByPlaceholderText("Enter message");

      await user.type(textarea, "This is a test message");
      expect(textarea).toHaveValue("This is a test message");
    });

    it("accepts multiline input", async () => {
      const user = userEvent.setup();
      render(<BaseTextarea placeholder="Enter message" />);
      const textarea = screen.getByPlaceholderText("Enter message");

      await user.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3");
      expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
    });

    it("calls onChange handler", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <BaseTextarea placeholder="Enter message" onChange={handleChange} />,
      );
      const textarea = screen.getByPlaceholderText("Enter message");

      await user.type(textarea, "Test");
      expect(handleChange).toHaveBeenCalled();
    });

    it("can be cleared", async () => {
      const user = userEvent.setup();
      render(
        <BaseTextarea placeholder="Enter message" defaultValue="Initial" />,
      );
      const textarea = screen.getByPlaceholderText("Enter message");

      expect(textarea).toHaveValue("Initial");
      await user.clear(textarea);
      expect(textarea).toHaveValue("");
    });
  });

  describe("States", () => {
    it("shows error state", () => {
      render(<BaseTextarea placeholder="Enter message" error={true} />);
      const textarea = screen.getByPlaceholderText("Enter message");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });

    it("can be disabled", () => {
      render(<BaseTextarea placeholder="Enter message" disabled />);
      const textarea = screen.getByPlaceholderText("Enter message");
      expect(textarea).toBeDisabled();
    });

    it("can be readonly", () => {
      render(
        <BaseTextarea
          placeholder="Enter message"
          readOnly
          value="Read only text"
        />,
      );
      const textarea = screen.getByPlaceholderText("Enter message");
      expect(textarea).toHaveAttribute("readonly");
    });

    it("respects maxLength", async () => {
      const user = userEvent.setup();
      render(<BaseTextarea placeholder="Enter message" maxLength={10} />);
      const textarea = screen.getByPlaceholderText(
        "Enter message",
      ) as HTMLTextAreaElement;

      await user.type(textarea, "This is a very long message");
      expect(textarea.value.length).toBeLessThanOrEqual(10);
    });
  });

  describe("Accessibility", () => {
    it("accepts custom aria attributes", () => {
      render(
        <BaseTextarea
          placeholder="Enter message"
          aria-label="Custom label"
          aria-describedby="helper-text"
        />,
      );
      const textarea = screen.getByPlaceholderText("Enter message");
      expect(textarea).toHaveAttribute("aria-label", "Custom label");
      expect(textarea).toHaveAttribute("aria-describedby", "helper-text");
    });
  });

  describe("Forwarding Ref", () => {
    it("forwards ref correctly", () => {
      const ref = vi.fn();
      render(<BaseTextarea ref={ref} placeholder="Enter message" />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
