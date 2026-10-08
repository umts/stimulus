import { Controller } from "@hotwired/stimulus";

export default class ClipboardController extends Controller {
  public static targets = ["source", "indicator"];

  declare public readonly sourceTarget: HTMLElement;
  declare public readonly indicatorTargets: HTMLElement[];

  public connect(): void {
    this.reset();
  }

  public copy(): void {
    navigator.clipboard
      .writeText(this.sourceTarget.innerText)
      .then(() => {
        this.indicate("fa-fw fa-solid fa-check", "Copied");
        return null;
      })
      .catch(() => {
        this.indicate("fa-fw fa-solid fa-xmark", "Failed");
      });
  }

  public reset(): void {
    this.indicate("fa-fw fa-regular fa-clipboard", "");
  }

  private indicate(className: string, status: string): void {
    requestAnimationFrame(() => {
      for (const target of this.indicatorTargets) {
        target.role = "status";
        target.className = className;
        const label = document.createElement("div");
        label.className = "visually-hidden";
        label.innerText = status;
        target.replaceChildren(label);
      }
    });
  }
}
