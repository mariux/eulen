function mountOverlay(): { overlay: HTMLElement; dialog: HTMLElement; close: () => void } {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const dialog = document.createElement("div");
  dialog.className = "dialog";
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  return { overlay, dialog, close: () => overlay.remove() };
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
}

export function confirmDialog(o: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const { overlay, dialog, close } = mountOverlay();
    const done = (v: boolean) => {
      document.removeEventListener("keydown", onKey);
      close();
      resolve(v);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") done(false);
      else if (e.key === "Enter") done(true);
    };
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) done(false);
    });

    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = o.title;
    const message = document.createElement("p");
    message.className = "dialog-message";
    message.textContent = o.message;
    const footer = document.createElement("div");
    footer.className = "dialog-footer";
    const cancel = document.createElement("button");
    cancel.className = "btn btn-cancel";
    cancel.textContent = o.cancelLabel;
    cancel.addEventListener("click", () => done(false));
    const ok = document.createElement("button");
    ok.className = o.danger ? "btn btn-clear" : "btn btn-ok";
    ok.textContent = o.confirmLabel;
    ok.addEventListener("click", () => done(true));
    footer.append(cancel, ok);
    dialog.append(title, message, footer);
    queueMicrotask(() => ok.focus());
  });
}

export interface PromptOptions {
  title: string;
  placeholder?: string;
  initial?: string;
  confirmLabel: string;
  cancelLabel: string;
  maxLength?: number;
}

export function promptDialog(o: PromptOptions): Promise<string | null> {
  return new Promise((resolve) => {
    const { overlay, dialog, close } = mountOverlay();
    const done = (v: string | null) => {
      document.removeEventListener("keydown", onKey);
      close();
      resolve(v);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") done(null);
    };
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) done(null);
    });

    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = o.title;
    const form = document.createElement("form");
    form.className = "name-form";
    const input = document.createElement("input");
    input.className = "name-input";
    input.type = "text";
    input.maxLength = o.maxLength ?? 20;
    if (o.placeholder) input.placeholder = o.placeholder;
    if (o.initial) input.value = o.initial;
    const footer = document.createElement("div");
    footer.className = "dialog-footer";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "btn btn-cancel";
    cancel.textContent = o.cancelLabel;
    cancel.addEventListener("click", () => done(null));
    const ok = document.createElement("button");
    ok.type = "submit";
    ok.className = "btn btn-ok";
    ok.textContent = o.confirmLabel;
    footer.append(cancel, ok);
    form.append(input, footer);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) {
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 400);
        return;
      }
      done(value);
    });
    dialog.append(title, form);
    queueMicrotask(() => input.focus());
  });
}
