import "bootstrap/dist/css/bootstrap.css";
import { beforeEach, describe, expect, it } from "vitest";
import { register, connect } from "./stimulus.ts";
import PopoverController from "../lib/popover.ts";

describe("TomSelectController", () => {
  beforeEach(() => {
    register("popover", PopoverController);
  });

  it("initializes a bootstrap popover", async () => {
    const page = await connect(`
      <button
        type="button"
        class="btn btn-neutral"
        data-controller="popover"
        data-bs-title="Popover title"
        data-bs-content="Popover content"
      >
        Popover button
      </button>
    `);
    await page.getByRole("button", { name: "Popover button" }).click();
    await expect
      .element(
        page
          .getByRole("tooltip")
          .filter({ hasText: "Popover title" })
          .filter({ hasText: "Popover content" }),
      )
      .toBeVisible();
  });

  it("cleans up the popover when disconnected", async () => {
    const page = await connect(`
      <button
        type="button"
        class="btn btn-neutral"
        data-controller="popover"
        data-bs-title="Popover title"
        data-bs-content="Popover content"
      >
        Popover button
      </button>
    `);
    const button = page.getByRole("button", { name: "Popover button" });
    await button.click();
    await expect.element(page.getByRole("tooltip")).toBeVisible();
    button.element().remove();
    await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument();
  });
});
