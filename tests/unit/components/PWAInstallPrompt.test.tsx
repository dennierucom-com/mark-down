import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { PWAInstallPrompt } from "../../../src/components/PWAInstallPrompt";
import * as usePWAInstallSource from "../../../src/hooks/usePWAInstall";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const mockTheme = createTheme();

describe("PWAInstallPrompt", () => {
  it("does not render if there is no beforeinstallprompt event", () => {
    vi.spyOn(usePWAInstallSource, "usePWAInstall").mockReturnValue({
      isInstallable: false,
      installPWA: vi.fn(),
      simulateInstall: vi.fn(),
    });

    render(
      <ThemeProvider theme={mockTheme}>
        <PWAInstallPrompt />
      </ThemeProvider>,
    );
    expect(
      screen.queryByRole("button", { name: /install/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the install prompt when isInstallable is true", async () => {
    vi.spyOn(usePWAInstallSource, "usePWAInstall").mockReturnValue({
      isInstallable: true,
      installPWA: vi.fn(),
      simulateInstall: vi.fn(),
    });

    render(
      <ThemeProvider theme={mockTheme}>
        <PWAInstallPrompt />
      </ThemeProvider>,
    );

    // Wait for the setTimeout in the component to trigger `isVisible = true`
    await waitFor(() => {
      expect(
        screen.getByText(/install app for offline use/i),
      ).toBeInTheDocument();
    });
  });
});

describe("Cache Storage Mocking Example", () => {
  it("verifies the global caches object is mocked", async () => {
    // This test proves that the setup file correctly polyfilled window.caches
    expect(window.caches).toBeDefined();

    const cache = await window.caches.open("test-cache");
    expect(window.caches.open).toHaveBeenCalledWith("test-cache");

    await cache.put("/api/data", new Response("mock data"));
    expect(cache.put).toHaveBeenCalled();
  });
});
