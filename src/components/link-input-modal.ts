import { App, Modal, Setting, Notice, debounce } from "obsidian";
import { VALID_URL_REG } from "../constants";

/**
 * url-input modal
 */
export class InsertLinkModal extends Modal {
	linkUrl: string;
	isOpen: boolean;
	onSubmit: (linkUrl: string) => void;

	constructor(app: App, onSubmit: (linkUrl: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.isOpen = false;
	}

	onOpen() {
		this.isOpen = true;
		const { contentEl } = this;
		this.linkUrl = "";
		contentEl.createEl("h1", { text: "リンクブックマークを挿入" });

		new Setting(contentEl)
			.setName("リンク先のURL")
			.addText((text) =>
				text.setValue(this.linkUrl).onChange((value) => {
					this.linkUrl = value;
				})
			)
			.setClass("link-input");

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("挿入")
				.setCta()
				.onClick(() => {
					this.checkUrl(this.linkUrl);
				})
		);

		this.containerEl.addEventListener("keydown", (evt) => {
			if (evt.key === "Enter") {
				this.checkUrl(this.linkUrl);
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		this.isOpen = false;
	}

	checkUrl = debounce((url: string) => {
		if (VALID_URL_REG.test(url)) {
			this.close();
			this.onSubmit(url);
		} else {
			new Notice("有効なURLを入力");
		}
	}, 10);
}
