import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthType } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import { ProfileForm } from "@/modules/auth/pages/profile/components/profile-form";

const mockUpdateProfileExecute = vi.fn();
const mockUpdatePasswordExecute = vi.fn();
const mockToastSuccess = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (message: string) => mockToastSuccess(message),
  },
}));
vi.mock("@/common/routing/navigation", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (name: string) =>
      name === "updateProfileUseCase"
        ? { execute: mockUpdateProfileExecute }
        : name === "updatePasswordUseCase"
          ? { execute: mockUpdatePasswordExecute }
          : {},
  }),
}));

const mockUser = {
  id: "uid-1",
  email: "a@b.com",
  displayName: "Alice",
  photoURL: null,
  authType: AuthType.Email,
};

describe("ProfileForm", () => {
  beforeEach(() => {
    mockUpdateProfileExecute.mockClear();
    mockUpdatePasswordExecute.mockClear();
    mockToastSuccess.mockClear();
    useAuthUserStore.setState({
      user: { ...mockUser },
      loading: false,
    });
  });

  it("renders loading when loading", () => {
    useAuthUserStore.setState({ user: mockUser, loading: true });

    render(<ProfileForm />);

    expect(screen.getByTestId("profile-loading")).toBeInTheDocument();
  });

  it("returns null when user is null", () => {
    useAuthUserStore.setState({ user: null, loading: false });

    const { container } = render(<ProfileForm />);

    expect(container.firstChild).toBeNull();
  });

  it("renders email with auth icon, full name and save button when user is set", () => {
    render(<ProfileForm />);

    expect(screen.getByText("a@b.com")).toBeInTheDocument();
    expect(screen.getByTestId("profile-email-auth-icon")).toBeInTheDocument();
    expect(screen.getByText("Full name")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /full name/i }),
    ).toHaveDisplayValue("Alice");
    expect(screen.getByRole("button", { name: /^Save$/i })).toBeInTheDocument();
    expect(screen.getAllByText("Email").length).toBeGreaterThanOrEqual(1);
  });

  it("shows Change password button and opens modal with password form when authType is email", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    const changePasswordButton = screen.getByRole("button", {
      name: /change password/i,
    });
    expect(changePasswordButton).toBeInTheDocument();
    await user.click(changePasswordButton);

    expect(
      screen.getByRole("heading", { name: "Update password" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Update password$/i }),
    ).toBeInTheDocument();
  });

  it("hides Change password button when authType is not email", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, authType: AuthType.Google },
      loading: false,
    });

    render(<ProfileForm />);

    expect(
      screen.queryByRole("button", { name: /change password/i }),
    ).not.toBeInTheDocument();
  });

  it("does not call updateProfileUseCase when displayName is unchanged", async () => {
    const user = userEvent.setup();

    render(<ProfileForm />);
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    expect(mockUpdateProfileExecute).not.toHaveBeenCalled();
  });

  it("updates auth store with new displayName when profile update succeeds", async () => {
    const user = userEvent.setup();
    mockUpdateProfileExecute.mockResolvedValue({ success: true });

    render(<ProfileForm />);
    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "Alice Updated",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() => {
      expect(mockUpdateProfileExecute).toHaveBeenCalledWith({
        displayName: "Alice Updated",
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Profile updated.");
    expect(useAuthUserStore.getState().user?.displayName).toBe("Alice Updated");
  });

  it("shows error when profile update fails", async () => {
    const user = userEvent.setup();
    mockUpdateProfileExecute.mockResolvedValue({
      success: false,
      error: "generic",
    });

    render(<ProfileForm />);
    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "New Name",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows success message when password update succeeds", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({ success: true });

    render(<ProfileForm />);
    await user.click(screen.getByRole("button", { name: /change password/i }));
    await user.type(screen.getByLabelText("Current password"), "OldPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirm new password"), "NewPass1!");
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      expect(mockUpdatePasswordExecute).toHaveBeenCalledWith({
        oldPassword: "OldPass1!",
        newPassword: "NewPass1!",
      });
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Password updated.");
  });

  it("resets password state when change password modal is closed", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    await user.click(screen.getByRole("button", { name: /change password/i }));
    expect(
      screen.getByRole("heading", { name: "Update password" }),
    ).toBeInTheDocument();
    await user.click(screen.getByTestId("dialog-overlay"));
    expect(
      screen.queryByRole("heading", { name: "Update password" }),
    ).not.toBeInTheDocument();
  });

  it("shows error when password update fails", async () => {
    const user = userEvent.setup();
    mockUpdatePasswordExecute.mockResolvedValue({
      success: false,
      error: "invalid-credentials",
    });

    render(<ProfileForm />);
    await user.click(screen.getByRole("button", { name: /change password/i }));
    await user.type(screen.getByLabelText("Current password"), "WrongPass1!");
    await user.type(screen.getByLabelText("New password"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirm new password"), "NewPass1!");
    await user.click(
      screen.getByRole("button", { name: /^Update password$/i }),
    );

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it("renders em dash when user has no email", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, email: null },
      loading: false,
    });

    render(<ProfileForm />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows auth icon when authType is other", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, authType: AuthType.Other },
      loading: false,
    });

    render(<ProfileForm />);

    expect(screen.getByTestId("profile-email-auth-icon")).toBeInTheDocument();
  });

  it("shows auth icon when authType is unknown", () => {
    useAuthUserStore.setState({
      user: {
        ...mockUser,
        authType: "unknown-provider" as AuthType,
      },
      loading: false,
    });

    render(<ProfileForm />);

    expect(screen.getByTestId("profile-email-auth-icon")).toBeInTheDocument();
  });

  it("does not reset form when user displayName is undefined", () => {
    useAuthUserStore.setState({
      user: {
        ...mockUser,
        displayName: undefined as unknown as string | null,
      },
      loading: false,
    });

    render(<ProfileForm />);

    expect(
      screen.getByRole("textbox", { name: /full name/i }),
    ).toHaveDisplayValue("");
  });

  it("resets form with empty displayName when user displayName is null", () => {
    useAuthUserStore.setState({
      user: { ...mockUser, displayName: null },
      loading: false,
    });

    render(<ProfileForm />);

    expect(
      screen.getByRole("textbox", { name: /full name/i }),
    ).toHaveDisplayValue("");
  });

  it("shows generic error when profile update returns unknown error code", async () => {
    const user = userEvent.setup();
    mockUpdateProfileExecute.mockResolvedValue({
      success: false,
      error: "generic",
    });

    render(<ProfileForm />);
    await user.clear(screen.getByRole("textbox", { name: /full name/i }));
    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "New Name",
    );
    await user.click(screen.getByRole("button", { name: /^Save$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong. Please try again.",
      );
    });
  });
});
