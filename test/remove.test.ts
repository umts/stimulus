import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { register, connect } from "./stimulus.ts";
import RemoveController from "../lib/remove.ts";

describe("RemoveController", () => {
  let eventSpy: () => void;

  beforeEach(() => {
    register("remove", RemoveController);
    eventSpy = vi.fn();
    document.addEventListener('remove:removed', eventSpy);
  });

  afterEach(() => {
    document.removeEventListener('remove:removed', eventSpy);
  });

  it("removes content from the DOM", async () => {
    const page = await connect(`
      <div data-controller="remove">
        Content
        <button type="button" data-action="click->remove#remove">Remove</button>
      </div>
    `);
    await page.getByRole("button", { name: 'Remove' }).click();
    await expect.element(page.getByText("Content")).not.toBeInTheDocument();
    expect(eventSpy).toHaveBeenCalled();
  });
});
