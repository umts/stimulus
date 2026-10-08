import { beforeEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { register, connect } from "./stimulus.ts";
import ClipboardController from "../lib/clipboard.ts";

describe("ClipboardController", () => {
  beforeEach(() => {
    register("clipboard", ClipboardController);
  });

  describe("copying with browser support", () => {
    let writeText: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      writeText = vi.fn().mockResolvedValue(null);
      vi.spyOn(navigator, "clipboard", "get").mockReturnValue({
        writeText,
      } as unknown as Clipboard);
    });

    it("writes to the system clipboard", async () => {
      await connect(`
        <div data-controller="clipboard">
          <div data-clipboard-target="source">Content</div>
          <button type="button" data-action="click->clipboard#copy">
            <i data-clipboard-target="indicator"></i>
            Copy
          </button>
        </div>
      `);
      await page.getByRole("button", { name: "Copy" }).click();
      expect(writeText).toHaveBeenCalledWith("Content");
    });

    it("indicates success", async () => {
      await connect(`
        <div data-controller="clipboard">
          <div data-clipboard-target="source">Content</div>
          <button type="button" data-action="click->clipboard#copy">
            <i data-clipboard-target="indicator"></i>
            Copy
          </button>
        </div>
      `);

      await expect
        .element(page.getByRole("status"))
        .toHaveClass("fa-fw fa-regular fa-clipboard", { exact: true });
      await expect.poll(() => page.getByRole("status").element().textContent).toBe("");
      await page.getByRole("button", { name: "Copy" }).click();
      await expect
        .element(page.getByRole("status"))
        .toHaveClass("fa-fw fa-solid fa-check", { exact: true });
      await expect.element(page.getByRole("status")).toHaveTextContent("Copied");
    });
  });

  describe("copying without browser support", () => {
    beforeEach(() => {
      vi.spyOn(navigator, "clipboard", "get").mockReturnValue(null as unknown as Clipboard);
    });

    it("indicates failure", async () => {
      await connect(`
        <div data-controller="clipboard">
          <div data-clipboard-target="source">Content</div>
          <button type="button" data-action="click->clipboard#copy">
            <i data-clipboard-target="indicator"></i>
            Copy
          </button>
        </div>
      `);
      await page.getByRole("button", { name: "Copy" }).click();
      await expect
        .element(page.getByRole("status"))
        .toHaveClass("fa-fw fa-solid fa-xmark", { exact: true });
      await expect.element(page.getByRole("status")).toHaveTextContent("Failed");
    });
  });

  describe("resetting indicators", () => {
    beforeEach(() => {
      vi.spyOn(navigator, "clipboard", "get").mockReturnValue(null as unknown as Clipboard);
    });

    it("clears all indicator content", async () => {
      await connect(`
        <div data-controller="clipboard">
          <div data-clipboard-target="source">Content</div>
          <button type="button" data-action="click->clipboard#copy">
            <i data-clipboard-target="indicator"></i>
            Copy
          </button>
          <button type="button" data-action="click->clipboard#reset">Reset</button>
        </div>
      `);

      await page.getByRole("button", { name: "Copy" }).click();
      await expect
        .element(page.getByRole("status"))
        .toHaveClass("fa-fw fa-solid fa-xmark", { exact: true });
      await expect.element(page.getByRole("status")).toHaveTextContent("Failed");
      await page.getByRole("button", { name: "Reset" }).click();
      await expect
        .element(page.getByRole("status"))
        .toHaveClass("fa-fw fa-regular fa-clipboard", { exact: true });
      await expect.poll(() => page.getByRole("status").element().textContent).toBe("");
    });
  });
});
