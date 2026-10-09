import {beforeEach, describe, expect, it, vi} from "vitest";
import { register, connect } from "./stimulus.ts";
import TemplateController from "../lib/template.ts";

describe("TemplateController", () => {
  beforeEach(() => {
    register("template", TemplateController);

    let counter = 0;
    vi.spyOn(Date, "now").mockImplementation(() => {
      counter += 1;
      return counter;
    });
  });

  it("appends template content to a target", async () => {
    const page = await connect(`
      <div data-controller="template">
        <template data-template-target="source">
          <button title="Title INDEX">
            Button INDEX
          </button>
        </template>
        <div data-template-target="append">
        </div>
        <button type="button" data-action="click->template#append">Append</button>
      </div>
    `);
    await expect.element(page.getByRole('button', { name: 'Button INDEX' })).not.toBeInTheDocument();
    await page.getByRole('button', { name: 'Append' }).click();
    await expect.element(page.getByRole('button', { name: 'Button 1' }).and(page.getByTitle('Title 1'))).toBeVisible();
    await page.getByRole('button', { name: 'Append' }).click();
    await expect.element(page.getByRole('button', { name: 'Button 2' }).and(page.getByTitle('Title 2'))).toBeVisible();
  });
});
