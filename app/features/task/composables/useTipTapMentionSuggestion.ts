import type { MentionOptions } from "@tiptap/extension-mention";
import type { WorkspaceMember } from "~/features/workspace/types/workspace";

export function useTipTapMentionSuggestion(
	members: MaybeRefOrGetter<WorkspaceMember[]>,
) {
	return computed((): MentionOptions["suggestion"] => ({
		char: "@",
		allowSpaces: false,
		items: ({ query }) => {
			const q = query.trim().toLowerCase();
			const active = toValue(members).filter(m => m.status === "active");
			if (!q) {
				return active.slice(0, 8);
			}
			return active
				.filter(
					m =>
						m.name.toLowerCase().includes(q)
						|| m.email.toLowerCase().includes(q),
				)
				.slice(0, 8);
		},
		render: () => {
			let popup: HTMLDivElement | null = null;
			let selectedIndex = 0;
			let latestProps: {
				items: WorkspaceMember[];
				command: (item: { id: string; label: string }) => void;
				clientRect?: (() => DOMRect | null) | null;
			} | null = null;

			function renderItems() {
				if (!popup || !latestProps) {
					return;
				}
				popup.innerHTML = "";
				latestProps.items.forEach((item, index) => {
					const button = document.createElement("button");
					button.type = "button";
					button.className =
						"tiptap-mention-popup__item"
						+ (index === selectedIndex ? " tiptap-mention-popup__item--active" : "");
					button.innerHTML = `<span class="font-medium">${item.name}</span><span class="text-xs text-muted">${item.email}</span>`;
					button.addEventListener("mousedown", event => {
						event.preventDefault();
						latestProps?.command({ id: item.id, label: item.name });
					});
					popup?.appendChild(button);
				});
			}

			return {
				onStart: (props) => {
					selectedIndex = 0;
					latestProps = {
						items: props.items as WorkspaceMember[],
						command: props.command,
						clientRect: props.clientRect,
					};
					popup = document.createElement("div");
					popup.className = "tiptap-mention-popup";
					popup.setAttribute("role", "listbox");
					document.body.appendChild(popup);
					renderItems();
					updatePopupPosition(popup, props.clientRect?.());
				},
				onUpdate: (props) => {
					selectedIndex = 0;
					latestProps = {
						items: props.items as WorkspaceMember[],
						command: props.command,
						clientRect: props.clientRect,
					};
					renderItems();
					if (popup) {
						updatePopupPosition(popup, props.clientRect?.());
					}
				},
				onKeyDown: (props) => {
					if (!latestProps?.items.length) {
						return false;
					}
					if (props.event.key === "Escape") {
						return true;
					}
					if (props.event.key === "ArrowUp") {
						selectedIndex =
							(selectedIndex - 1 + latestProps.items.length)
							% latestProps.items.length;
						renderItems();
						return true;
					}
					if (props.event.key === "ArrowDown") {
						selectedIndex = (selectedIndex + 1) % latestProps.items.length;
						renderItems();
						return true;
					}
					if (props.event.key === "Enter" || props.event.key === "Tab") {
						const item = latestProps.items[selectedIndex];
						if (item) {
							props.command({ id: item.id, label: item.name });
						}
						return true;
					}
					return false;
				},
				onExit: () => {
					popup?.remove();
					popup = null;
					latestProps = null;
				},
			};
		},
	}));
}

function updatePopupPosition(
	popup: HTMLElement,
	rect?: DOMRect | (() => DOMRect | null) | null,
) {
	const resolved = typeof rect === "function" ? rect() : rect;
	if (!resolved) {
		return;
	}
	popup.style.position = "fixed";
	popup.style.left = `${resolved.left}px`;
	popup.style.top = `${resolved.bottom + 4}px`;
	popup.style.zIndex = "100";
}
