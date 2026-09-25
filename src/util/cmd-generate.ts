import { Editor, MarkdownView } from "obsidian";
import { CONTENT_MAP } from "src/constants";

/**
 * create customized cmds
 */
export function loadCommands() {

    const formatUnderline = (
        editor: Editor,
        line: number,
        left: number,
        right: number
    ) => {
        // range of selected content
        const selectedRange = [
            { line, ch: left },
            { line, ch: right },
        ] as const;
        let selection = editor.getRange(...selectedRange);
        if (/((?!u>).*?)((<u>(?!u>).*<\/u>)+)((?!u>).*?)/.test(selection)) {
            selection = selection.replace(/<\/?u>/g, "");
        }
        editor.replaceRange(`<u>${selection}</u>`, ...selectedRange);
        const content = editor.getLine(line);
        const arr = content.split(/<\/?u>/g);
        let joinContent = "";
        arr.forEach((item, index) => {
            if (index % 2 === 0) {
                joinContent += item ?? "";
                if (index < arr.length - 1) {
                    joinContent += "<u>";
                }
            } else {
                joinContent += (item ?? "") + "</u>";
            }
        });
        joinContent = joinContent.replace(/(<\/u><u>)|(<u><\/u>)/g, "");
        editor.setLine(line, joinContent);
    };



    const replaceContent = (content: string) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView)
        if (view) {
            if (content === CONTENT_MAP['bookmark']) {
                content = ''
            }
            const cursor = view.editor.getCursor();
            const editLine = view.editor.getLine(cursor.line);
            const searchText = editLine.match(/[^\/]*$/)?.[0] ?? ''
            if (editLine.length > searchText.length + 1) {
                view.editor.replaceRange(
                    `\n${content}`,
                    { line: cursor.line, ch: cursor.ch - searchText.length - 1 },
                    cursor
                );
                view.editor.setCursor({
                    line: cursor.line + 1,
                    ch: content.length,
                });
            } else {
                view.editor.setLine(cursor.line, content);
                view.editor.setCursor({
                    line: cursor.line,
                    ch: content.length,
                });
            }
            view.editor.focus();
        }
    }

    this.addCommand({
        id: "insert-text",
        name: "テキストを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['text'])
        },
    });

    this.addCommand({
        id: "insert-heading1",
        name: "見出し1を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['heading1'])
        },
    });
    this.addCommand({
        id: "insert-heading2",
        name: "見出し2を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['heading2'])
        },
    });
    this.addCommand({
        id: "insert-heading3",
        name: "見出し3を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['heading3'])
        },
    });
    this.addCommand({
        id: "insert-heading4",
        name: "見出し4を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['heading4'])
        },
    });
    this.addCommand({
        id: "insert-heading5",
        name: "見出し5を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['heading5'])
        },
    });
    this.addCommand({
        id: "insert-heading6",
        name: "見出し6を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['heading6'])
        },
    });
    this.addCommand({
        id: "insert-todo",
        name: "タスクリストを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['todoList'])
        },
    });
    this.addCommand({
        id: "insert-bulletList",
        name: "箇条書きリストを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['bulletList'])
        },
    });
    this.addCommand({
        id: "insert-numberList",
        name: "番号付きリストを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['numberList'])
        },
    });
    this.addCommand({
        id: "insert-table",
        name: "表を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent('')
            this.app.commands.executeCommandById('editor:insert-table')

        },
    });
    this.addCommand({
        id: "insert-bookmark",
        name: "リンクブックマークを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['bookmark'])
        },
    });
    this.addCommand({
        id: "insert-divide",
        name: "区切り線を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['divide'])
        },
    });
    this.addCommand({
        id: "insert-quote",
        name: "引用を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['quote'])
        },
    });
    this.addCommand({
        id: "insert-note-callout",
        name: "コールアウト（ノート）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["noteCallout"]);
        }
    });
    this.addCommand({
        id: "insert-abstract-callout",
        name: "コールアウト（要約）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["abstractCallout"]);
        }
    });
    this.addCommand({
        id: "insert-info-callout",
        name: "コールアウト（情報）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["infoCallout"]);
        }
    });
    this.addCommand({
        id: "insert-todo-callout",
        name: "コールアウト（タスク）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["todoCallout"]);
        }
    });
    this.addCommand({
        id: "insert-tip-callout",
        name: "コールアウト（ヒント）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["tipCallout"]);
        }
    });
    this.addCommand({
        id: "insert-success-callout",
        name: "コールアウト（成功）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["successCallout"]);
        }
    });
    this.addCommand({
        id: "insert-question-callout",
        name: "コールアウト（質問）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["questionCallout"]);
        }
    });
    this.addCommand({
        id: "insert-warning-callout",
        name: "コールアウト（警告）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["warningCallout"]);
        }
    });
    this.addCommand({
        id: "insert-failure-callout",
        name: "コールアウト（失敗）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["failureCallout"]);
        }
    });
    this.addCommand({
        id: "insert-danger-callout",
        name: "コールアウト（危険）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["dangerCallout"]);
        }
    });
    this.addCommand({
        id: "insert-bug-callout",
        name: "コールアウト（バグ）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["bugCallout"]);
        }
    });
    this.addCommand({
        id: "insert-example-callout",
        name: "コールアウト（例）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["exampleCallout"]);
        }
    });
    this.addCommand({
        id: "insert-quote-callout",
        name: "コールアウト（引用）を挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP["quoteCallout"]);
        }
    });
    this.addCommand({
        id: "insert-mathblock",
        name: "数式ブロックを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['math'])
            CONTENT_MAP['code']
            const view = this.app.workspace.getActiveViewOfType(MarkdownView)
            if (view) {
                const cursor = view.editor.getCursor();
                const editLine = view.editor.getLine(cursor.line);
                view.editor.setCursor(cursor.line - 1)
                view.editor.focus();
            }
        },
    });
    this.addCommand({
        id: "insert-codeblock",
        name: "コードブロックを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['code'])
            const view = this.app.workspace.getActiveViewOfType(MarkdownView)
            if (view) {
                const cursor = view.editor.getCursor();
                const editLine = view.editor.getLine(cursor.line);
                view.editor.setCursor(cursor.line - 1)
                view.editor.focus();
            }
        },
    });
    this.addCommand({
        id: "insert-tag",
        name: "タグを挿入",
        editorCallback: (editor: Editor) => {
            const view = this.app.workspace.getActiveViewOfType(MarkdownView)
            if (view) {
                const cursor = view.editor.getCursor();
                const editLine = view.editor.getLine(cursor.line);
                let content = editLine.length > 1 ? " #" : '#'
                view.editor.replaceRange(
                    content,
                    { line: cursor.line, ch: cursor.ch - 1 },
                    cursor
                );
                view.editor.focus();
            }
        },
    });

    this.addCommand({
        id: "insert-embed",
        name: "埋め込みを挿入",
        editorCallback: (editor: Editor) => {
            replaceContent(CONTENT_MAP['embed'])
            const view = this.app.workspace.getActiveViewOfType(MarkdownView)
            if (view) {
                const cursor = view.editor.getCursor();
                view.editor.setCursor({ ...cursor, ch: cursor.ch - 2 })
                view.editor.focus();
            }
        },
    });


    // This adds a simple command that can be triggered anywhere
    this.addCommand({
        id: "underline",
        name: "下線を切り替え",
        editorCallback: (editor: Editor) => {
            const from = editor.getCursor("from");
            const to = editor.getCursor("to");
            for (let i = from.line; i <= to.line; i++) {
                const len = editor.getLine(i).length;
                if (from.line === to.line) {
                    formatUnderline(editor, i, from.ch, to.ch);
                } else if (i === from.line && i < to.line) {
                    formatUnderline(editor, i, from.ch, len);
                } else if (i > from.line && i < to.line) {
                    formatUnderline(editor, i, 0, len);
                } else if (i > from.line && i === to.line) {
                    formatUnderline(editor, i, 0, to.ch);
                }
            }
        },
    });
    this.addCommand({
        id: "todo-list",
        name: "タスクリストを追加",
        editorCallback: (editor: Editor) => {
            const { line, ch } = editor.getCursor();
            const content = editor.getLine(line);
            if (content.startsWith("[ ] ")) {
                editor.replaceRange("", { line, ch: 0 }, { line, ch: 4 });
            } else {
                editor.replaceRange(
                    `- [ ] `,
                    { line, ch: 0 },
                    { line, ch: 0 }
                );
            }
        },
    });

}
