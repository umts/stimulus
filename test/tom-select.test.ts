import TomSelect from "tom-select";
import { beforeEach, describe, expect, it } from "vitest";
import { register, render } from "./stimulus.ts";
import TomSelectController from "../lib/tom-select.ts";

const getInstance = async (): Promise<TomSelect> => {
  const select = document.querySelector("select") as unknown as { tomselect?: TomSelect };
  await expect.poll(() => select.tomselect).toBeDefined();
  return select.tomselect as TomSelect;
};

describe("TomSelectController", () => {
  beforeEach(() => {
    register("tom-select", TomSelectController);
  });

  describe("connecting a basic select", () => {
    it("initializes a tom select with the correct options", async () => {
      render(`
        <select data-controller="tom-select">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings).toMatchObject({
        create: false,
        plugins: [],
        refreshThrottle: 0,
        allowEmptyOption: true,
        controlInput: null,
        maxOptions: null,
      });
    });
  });

  describe("connecting a searchable select", () => {
    it("initializes a tom select with the correct options", async () => {
      render(`
        <select data-controller="tom-select" data-tom-select-search>
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings).toMatchObject({
        create: false,
        plugins: ["dropdown_input"],
        refreshThrottle: 0,
        allowEmptyOption: true,
        maxOptions: null,
      });
    });
  });

  describe("connecting a truncated searchable basic select", () => {
    it("initializes a tom select with the correct options", async () => {
      render(`
        <select data-controller="tom-select" data-tom-select-search data-tom-select-truncate>
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings).toMatchObject({
        create: false,
        plugins: ["dropdown_input"],
        refreshThrottle: 0,
        allowEmptyOption: true,
      });
    });
  });

  describe("connecting a multi select", () => {
    it("initializes a tom select with the correct options", async () => {
      render(`
        <select multiple data-controller="tom-select">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings).toMatchObject({
        create: false,
        plugins: ["clear_button"],
        refreshThrottle: 0,
        allowEmptyOption: true,
        controlInput: null,
        maxOptions: null,
      });
    });
  });

  describe("connecting a searchable select", () => {
    it("initializes a tom select with the correct options", async () => {
      render(`
        <select multiple data-controller="tom-select" data-tom-select-search>
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings).toMatchObject({
        create: false,
        plugins: ["clear_button", "dropdown_input"],
        refreshThrottle: 0,
        allowEmptyOption: true,
        maxOptions: null,
      });
    });
  });

  describe("connecting a truncated searchable basic select", () => {
    it("initializes a tom select with the correct options", async () => {
      render(`
        <select multiple data-controller="tom-select" data-tom-select-search data-tom-select-truncate>
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings).toMatchObject({
        create: false,
        plugins: ["clear_button", "dropdown_input"],
        refreshThrottle: 0,
        allowEmptyOption: true,
      });
    });
  });

  describe("rendering options", () => {
    it("renders normal options as divs", async () => {
      render(`
        <select data-controller="tom-select">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings.render.option({ text: "One" }, (content: string) => content)).toBe(
        "<div>One</div>",
      );
    });

    it("renders empty options as non breaking spaces", async () => {
      render(`
        <select data-controller="tom-select">
          <option value="0"></option>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      expect(tomSelect.settings.render.option({ text: "" }, (content: string) => content)).toBe(
        "<div>\u00A0</div>",
      );
    });
  });

  describe("disconnecting a select", () => {
    it("destroys the tom select", async () => {
      const page = render(`
        <select multiple data-controller="tom-select" data-tom-select-search data-tom-select-truncate>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
      `);

      const tomSelect = await getInstance();
      tomSelect.input.remove();
      await expect.element(page.getByRole("combobox")).not.toBeInTheDocument();
    });
  });
});
