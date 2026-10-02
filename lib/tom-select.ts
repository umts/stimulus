import { Controller } from "@hotwired/stimulus";
import TomSelect from "tom-select";

type TomSelectSettings = NonNullable<ConstructorParameters<typeof TomSelect>[1]>;

export default class TomSelectController extends Controller {
  private tomSelect?: TomSelect;

  public connect(): void {
    this.tomSelect = new TomSelect(this.select, this.options());
  }

  public disconnect(): void {
    this.tomSelect?.destroy();
    this.tomSelect = undefined;
  }

  private get select(): HTMLSelectElement {
    return this.element as HTMLSelectElement;
  }

  private options(): TomSelectSettings {
    const plugins: string[] = [];
    const options: TomSelectSettings = {
      create: false,
      refreshThrottle: 0,
      allowEmptyOption: true,
      render: {
        option: (data: { text: string }, escape: (content: string) => string): string =>
          `<div>${escape(data.text || "\u00A0")}</div>`,
      },
    };
    if (this.select.multiple) {
      plugins.push("clear_button");
    }
    if ("search" in this.select.dataset) {
      plugins.push("dropdown_input");
      if (!("truncate" in this.select.dataset)) {
        options.maxOptions = null;
      }
    } else {
      options.controlInput = null;
      options.maxOptions = null;
    }
    options.plugins = plugins;
    return options;
  }
}
