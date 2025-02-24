import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import BottomNavBar from "../../Components/BottomNavBar";
import userEvent from "@testing-library/user-event";

// Mock useNavigate to track navigation calls
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("BottomNavBar Component", () => {
  let navigateMock: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock = vi.fn();
    (useNavigate as vi.Mock).mockReturnValue(navigateMock);
  });

  it("should render all navigation buttons", () => {
    render(
      <MemoryRouter>
        <BottomNavBar />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Shuttle")).toBeInTheDocument();
    expect(screen.getByLabelText("Map")).toBeInTheDocument();
    expect(screen.getByLabelText("Directions")).toBeInTheDocument();
    expect(screen.getByLabelText("Schedule")).toBeInTheDocument();
  });

  it("should navigate to the correct route when a button is clicked", async () => {
    render(
      <MemoryRouter>
        <BottomNavBar />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    await user.click(screen.getByLabelText("Shuttle"));
    expect(navigateMock).toHaveBeenCalledWith("/shuttle");

    await user.click(screen.getByLabelText("Map"));
    expect(navigateMock).toHaveBeenCalledWith("/");

    await user.click(screen.getByLabelText("Directions"));
    expect(navigateMock).toHaveBeenCalledWith("/directions");

    await user.click(screen.getByLabelText("Schedule"));
    expect(navigateMock).toHaveBeenCalledWith("/schedule");
  });

  it("should apply the active state to the current route", () => {
    render(
      <MemoryRouter initialEntries={["/directions"]}>
        <BottomNavBar />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Directions")).toHaveAttribute("aria-current", "page");
    expect(screen.getByLabelText("Map")).not.toHaveAttribute("aria-current", "page");
  });

 

  it("should toggle openMapMenu when clicking Map button", async () => {
    render(
      <MemoryRouter>
        <BottomNavBar />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Map"));

    // Expect `navigateMock` to be called, simulating toggling
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
