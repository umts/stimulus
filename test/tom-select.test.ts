import "tom-select/dist/css/tom-select.css";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { register, connect } from "./stimulus.ts";
import TomSelectController from "../lib/tom-select.ts";

describe("TomSelectController", () => {
  beforeEach(() => {
    register("tom-select", TomSelectController);
  });

  describe("with a basic select", () => {
    it("initializes a tom select", async () => {
      const page = await connect(`
        <select aria-hidden="true" data-controller="tom-select">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
     `);
      await page.getByRole("combobox").click();
      await expect.element(page.getByRole("option", { name: "One" })).toBeVisible();
    });
  });

  describe("with a multi select", () => {
    it("initializes a tom select with the clear button plugin", async () => {
      const page = await connect(`
        <select multiple aria-hidden="true" data-controller="tom-select">
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      await page.getByRole("combobox").click();
      await page.getByRole("option", { name: "One" }).click();
      await expect
        .element(page.getByRole("button").and(page.getByTitle("Clear All")))
        .toBeVisible();
    });
  });

  describe("with a searchable select", () => {
    it("initializes a tom select with the dropdown input plugin", async () => {
      const page = await connect(`
        <select aria-hidden="true" data-controller="tom-select" data-tom-select-search data-tom-select-truncate>
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      await page.getByRole("combobox").click();
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

    it("initializes a tom select with remote options preloaded", async () => {
      const page = await connect(`
        <select aria-hidden="true" data-controller="tom-select" data-tom-select-remote="/options">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      await page.getByRole("combobox").click();
      await expect.element(page.getByRole("option", { name: "Remote option" })).toBeVisible();
    });

    it("does not panic when remote options fail to load", async () => {
      const page = await connect(`
        <select aria-hidden="true" data-controller="tom-select" data-tom-select-remote="/not-an-endpoint">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </selectv>
      `);
      await page.getByRole("combobox").click();
      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });
      await expect.element(page.getByRole("option", { name: "One" })).toBeVisible();
    });
  });

  describe("after disconnection", () => {
    it("destroys the tom-select", async () => {
      const page = await connect(`
        <select aria-hidden="true" data-controller="tom-select" data-testid="controller">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);
      await page.getByRole("combobox").click();
      page.getByTestId("controller").element().remove();
      await expect.element(page.getByRole("combobox")).not.toBeInTheDocument();
      await expect.element(page.getByRole("listbox")).not.toBeInTheDocument();
    });
  });
});
