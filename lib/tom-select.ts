import { Controller } from "@hotwired/stimulus";
import TomSelect from "tom-select";

type TomSettings = NonNullable<ConstructorParameters<typeof TomSelect>[1]>;
type TomOption = Record<string, unknown>;

export default class TomSelectController extends Controller {
  private tomSelect?: TomSelect;
  private remote?: string;

  public connect(): void {
    this.remote = this.scopedData("remote") || undefined;
    this.tomSelect = new TomSelect(this.element as HTMLSelectElement, this.settings());
  }

  public disconnect(): void {
    this.tomSelect?.destroy();
    this.tomSelect = undefined;
    this.remote = undefined;
  }

  private scopedData(key: string): string | null {
    return this.element.getAttribute(`data-${this.identifier}-${key}`);
  }

  private settings(): TomSettings {
    const isMultiple = (this.element as HTMLSelectElement).multiple;
    const isSearch = this.scopedData("search") !== null;
    const isTruncate = this.scopedData("truncate") !== null;
    const isRemote = this.scopedData("remote") !== null;

    const plugins: string[] = [];
    if (isMultiple) plugins.push("clear_button");
    if (isSearch) plugins.push("dropdown_input");

    const options: TomSettings = {
      plugins,
      create: false,
      allowEmptyOption: true,
      refreshThrottle: 0,
      render: {
        option: (data: { [key: string]: string }, escape: (content: string) => string): string =>
          `<div>${escape(data[this.tomSelect!.settings.labelField] || "\u00A0")}</div>`,
      },
    };

    if (!isSearch) options.controlInput = null;
    if (!isSearch || !isTruncate) options.maxOptions = null;

    if (isRemote) {
      options.preload = true;
      options.load = (query: string, callback: (options?: Array<object>) => void): void => {
        const url = new URL(this.remote!, window.location.origin);
        url.searchParams.set("q", query);
        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            this.syncOrder();
            // oxlint-disable-next-line promise/no-callback-in-promise
            return callback(json);
          })
          // oxlint-disable-next-line promise/no-callback-in-promise
          .catch(() => callback());
      };
    }

    return options;
  }

  // html options and remote options are numbered individually which leads to erroenous interleaving
  private syncOrder(): void {
    const tomSelect = this.tomSelect!;
    tomSelect.order = Math.max(
      tomSelect.order,
      ...Object.values(tomSelect.options).map((option: TomOption) => Number(option.$order) || 0),
    );
  }
}
