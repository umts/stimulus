import "tom-select/dist/css/tom-select.css";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { register, render } from "./stimulus.ts";
import TomSelectController from "../lib/tom-select.ts";

async function initialized(root: Locator): Promise<{ combobox: Locator; dropdown: Locator }> {
  const initialCombobox = root.getByRole("combobox", { expanded: false });
  await expect.element(initialCombobox).toBeVisible();

  initialCombobox.element().dataset.testid = "select";
  const combobox = root.getByTestId("select");

  (initialCombobox.element()!.ariaControlsElements![0] as HTMLElement).dataset.testid = "dropdown";
  const dropdown = root.getByTestId("dropdown");

  return { combobox, dropdown };
}

describe("TomSelectController", () => {
  beforeEach(() => {
    register("tom-select", TomSelectController);
  });

  describe("with a basic select", () => {
    it("initializes a tom select", async () => {
      const page = render(`
        <select data-controller="tom-select">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      await initialized(page);
    });
  });

  describe("with a multi select", () => {
    it("initializes a tom select with a clear button", async () => {
      const page = render(`
        <select multiple data-controller="tom-select">
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      const { combobox, dropdown } = await initialized(page);
      await combobox.click();
      await dropdown.getByText("One").click();
      await expect.element(combobox.getByTitle("Clear All")).toBeVisible();
    });
  });

  describe("with a searchable select", () => {
    it("initializes a tom select with a search bar", async () => {
      const page = render(`
        <select data-controller="tom-select" data-tom-select-search data-tom-select-truncate>
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      const { combobox } = await initialized(page);
      await combobox.click();
      await expect.element(page.getByRole("textbox")).toBeVisible();
    });
  });

  describe("with a remote select", () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // oxlint-disable-next-line require-await
      fetchMock = vi.fn(async (input: RequestInfo | URL) => {
        const href =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (new URL(href, location.origin).pathname === "/options") {
          return new Response(JSON.stringify([{ value: "3", text: "Remote option" }]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        throw new Error(`unexpected fetch: ${href}`);
      });
      vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("initializes a tom select with remote options", async () => {
      const page = render(`
        <select data-controller="tom-select" data-tom-select-remote="/options">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      const { combobox, dropdown } = await initialized(page);
      await combobox.click();
      await expect.element(dropdown.getByText("Remote option")).toBeVisible();
    });

    it("does not panic when remote does not respond successfully", async () => {
      const page = render(`
        <select data-controller="tom-select" data-tom-select-remote="/not-an-endpoint">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      const { combobox, dropdown } = await initialized(page);
      await combobox.click();
      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });
      await expect.element(dropdown.getByText("One")).toBeVisible();
    });
  });

  describe("removing a select from the DOM", () => {
    it("destroys the tom-select", async () => {
      const page = render(`
        <select data-controller="tom-select">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      const { combobox } = await initialized(page);
      page.element().remove();
      await expect.element(combobox).not.toBeInTheDocument();
    });
  });
});
