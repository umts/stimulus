import { beforeEach, describe, expect, it } from "vitest";
import { register, render } from "./stimulus.ts";
import HelloController from "../lib/hello-controller.ts";

describe("HelloController", () => {
  beforeEach(() => {
    register("hello", HelloController);
  });

  it("inserts Hello, World! in the root element", async () => {
    const page = render(`<div data-controller="hello"></div>`);
    const hello = page.getByText("Hello, World!");
    await expect.element(hello).toBeVisible();
  });
});
