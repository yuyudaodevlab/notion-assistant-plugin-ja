// import ExamplePlugin from "./main";
import TypingAsstPlugin from "main";
import { App, PluginSettingTab, Setting, setIcon } from "obsidian";
import Sortable from "sortablejs";
import { CMD_CONFIG, HEADING_MENU } from "src/constants";

export type CMD_TYPE = (typeof HEADING_MENU)[number]
export interface ExamplePluginSettings {
    nonEmptyLineDisabled: boolean;
    showPlaceholder: boolean;
    disableSelectionMenu: boolean;
    cmdsSorting: CMD_TYPE[]
}
export class ExampleSettingTab extends PluginSettingTab {
    plugin: TypingAsstPlugin;
    hasChanged: boolean;

    constructor(app: App, plugin: TypingAsstPlugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.hasChanged = false;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "Typing Assistant" });

        const support = containerEl.createEl("p", { text: "質問や提案は" });
        support.createEl("a", {
            text: "GitHub",
            href: "https://github.com/Jambo2018/notion-assistant-plugin",
        });
        support.appendText("で受け付ける。");

        new Setting(containerEl)
            .setName("空行でのみコマンドメニューを表示")
            .setDesc("空行の先頭で「/」を入力したときだけコマンドメニューを表示する。")
            .addToggle((component) =>
                component
                    .setValue(this.plugin.settings.nonEmptyLineDisabled)
                    .onChange(async (value) => {
                        this.hasChanged = true;
                        this.plugin.settings.nonEmptyLineDisabled = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("入力ヒントを表示")
            .setDesc("空行に「💡『/』を入力してコマンドを表示」というヒントを表示する。")
            .addToggle((component) =>
                component
                    .setValue(this.plugin.settings.showPlaceholder)
                    .onChange(async (value) => {
                        this.hasChanged = true;
                        this.plugin.settings.showPlaceholder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("文字選択メニューを表示")
            .setDesc("文字を選択したときに書式を変更するメニューを表示する。")
            .addToggle((component) =>
                component
                    .setValue(!this.plugin.settings.disableSelectionMenu)
                    .onChange(async (value) => {
                        this.plugin.settings.disableSelectionMenu = !value;
                        await this.plugin.saveSettings();
                    })
            );


        new Setting(containerEl)
            .setName("コマンドメニュー")
            .setDesc("表示するコマンドを選び、ドラッグ＆ドロップで順序を変更できます。コマンドは5個以上有効にする必要があります。")

        const CmdSettings = containerEl.createDiv({ cls: "heading-config" })

        const CmdsOn = containerEl.createDiv({ attr: { id: 'cmds-on' }, cls: "heading-config-on" });
        const CmdsOff = containerEl.createDiv({ attr: { id: 'cmds-off' }, cls: "heading-config-off" });

        CmdSettings.appendChild(CmdsOn)
        CmdSettings.appendChild(CmdsOff)

        let cmdsSorting = this.plugin.settings?.cmdsSorting || []
        const cmdsAll = [...new Set([...cmdsSorting, ...HEADING_MENU])]
        for (let i = 0; i < cmdsAll.length; i++) {
            const cmd = cmdsAll[i]
            let HeaderItem: HTMLDivElement;
            const isChecked = this.plugin.settings.cmdsSorting.includes(cmd)
            if (isChecked) {
                HeaderItem = CmdsOn.createDiv({ cls: 'heading-item' })
            } else {
                HeaderItem = CmdsOff.createDiv({ cls: 'heading-item' })
            }
            const IconDiv = HeaderItem.createDiv({ cls: 'heading-item-icon' })
            setIcon(IconDiv, CMD_CONFIG[cmd].icon);
            new Setting(HeaderItem)
                .setName(CMD_CONFIG[cmd].title)
                .addToggle((component) =>
                    component.setValue(isChecked)
                        .onChange(async () => {
                            if (cmdsSorting.includes(cmd)) {
                                cmdsSorting = cmdsSorting.filter(i => i !== cmd)
                                CmdsOn.removeChild(HeaderItem)
                                CmdsOff.insertBefore(HeaderItem, CmdsOff.firstElementChild)
                            } else {
                                cmdsSorting.push(cmd)
                                CmdsOff.removeChild(HeaderItem)
                                CmdsOn.appendChild(HeaderItem)
                            }
                            this.hasChanged = true;
                            this.plugin.settings.cmdsSorting = [...cmdsSorting]
                            await this.plugin.saveSettings();
                        })
                ).setDisabled(cmdsSorting.length <= 5 && cmdsSorting.includes(cmd))
        }

        new Sortable(CmdsOn, {
            onEnd: async (e) => {
                const cmdsSorting = Array.from(e.to.children).map(item => {
                    return HEADING_MENU.find(cmd => CMD_CONFIG[cmd].title === item.textContent)
                })
                this.plugin.settings.cmdsSorting = [...cmdsSorting] as CMD_TYPE[]
                this.hasChanged = true;
                await this.plugin.saveSettings();
            },
        })
    }

    hide() {
        if (this.hasChanged) {
            (this.app as any).commands.executeCommandById("app:reload");
        }
    }
}