import { Controller } from "@hotwired/stimulus";
import { Popover } from "bootstrap";

export default class PopoverController extends Controller {
  private popover?: Popover;

  public connect(): void {
    this.popover = new Popover(this.element);
  }

  public disconnect(): void {
    this.popover?.dispose();
    this.popover = undefined;
  }
}
