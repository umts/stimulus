import { Application, type ControllerConstructor } from "@hotwired/stimulus";
import { vi } from "vitest";
import { type BrowserPage, page } from "vitest/browser";

let application: Application | null = null;
let connected: WeakMap<Element, Set<string>> | null = null;
let errors: unknown[] | null = null;

export function start(): void {
  application = Application.start();
  connected = new WeakMap();
  errors = [];
  application.handleError = (error: unknown): void => {
    errors!.push(error);
  };
}

export function register(name: string, controller: ControllerConstructor): void {
  const wrapper = class extends controller {
    public connect(): void {
      super.connect();
      let identifiers = connected!.get(this.element);
      if (!identifiers) connected!.set(this.element, (identifiers = new Set()));
      identifiers.add(this.identifier);
    }
  };
  application!.register(name, wrapper);
}

export async function connect(html: string): Promise<BrowserPage> {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.append(root);
  await vi.waitFor(() => {
    for (const element of document.querySelectorAll("[data-controller]")) {
      for (const identifier of (element as HTMLElement).dataset.controller!.split(/\s+/u)) {
        if (!(connected!.has(element) && connected!.get(element)!.has(identifier)))
          throw new Error("Not connected");
      }
    }
  });
  return page;
}

export function stop(): void {
  if (errors!.length > 0) throw errors![0];
  application!.stop();
  document.body.innerHTML = "";
  application = null;
  connected = null;
  errors = null;
}
