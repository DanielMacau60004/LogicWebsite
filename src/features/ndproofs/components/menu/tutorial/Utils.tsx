import {TreeComponent} from "../../../types/proofBoard";
import {store} from "../../../../../store";

export function drawContainmentBox(
    selectors: string[],
    overlaySelector: string,
    padding = 0
) {
    const elements: Element[] = selectors
        .map((sel) => document.querySelector(sel))
        .filter((el): el is Element => el !== null);

    if (elements.length === 0) {
        throw new Error("No elements found for the provided selectors");
    }

    const overlay = document.createElement("div");

    if (overlaySelector.startsWith(".")) {
        overlay.className = overlaySelector.slice(1);
    } else if (overlaySelector.startsWith("#")) {
        overlay.id = overlaySelector.slice(1);
    } else {
        overlay.className = overlaySelector;
    }

    Object.assign(overlay.style, {
        position: "absolute",
        pointerEvents: "none",
        boxSizing: "border-box",
        zIndex: "10",
        padding: `${padding}px`,
    });

    const rects = elements.map((el) => el.getBoundingClientRect());

    const left = Math.min(...rects.map((r) => r.left)) + window.scrollX;
    const top = Math.min(...rects.map((r) => r.top)) + window.scrollY;
    const right = Math.max(...rects.map((r) => r.right)) + window.scrollX;
    const bottom = Math.max(...rects.map((r) => r.bottom)) + window.scrollY;

    overlay.style.left = `${left}px`;
    overlay.style.top = `${top}px`;
    overlay.style.width = `${right - left}px`;
    overlay.style.height = `${bottom - top}px`;

    document.body.appendChild(overlay);

    return overlay;
}

export function removeElementsByClass(overlaySelector: string) {
    const el = document.querySelector(overlaySelector);
    if (el) el.remove();
}


export async function simulateDrag(
    dragging: TreeComponent,
    targetIds: number[],
    duration = 800
) {
    const source = document.getElementById(String(dragging.id));
    if (!source || targetIds.length === 0) return;

    let deleted = false;

    const originalTransform = window.getComputedStyle(source).transform;

    while (!deleted) {
        const randomIndex = Math.floor(Math.random() * targetIds.length);
        const targetId = targetIds[randomIndex];
        const target = document.getElementById(String(targetId));
        if (!target) continue;

        source.style.position = "absolute";
        source.style.willChange = "transform";

        const startRect = source.getBoundingClientRect();
        const endRect = target.getBoundingClientRect();

        const deltaX = endRect.left - startRect.left - startRect.width / 4 - endRect.width / 4;
        const deltaY = endRect.top - startRect.top - startRect.height / 4;

        const steps = Math.max(10, Math.floor(duration / 16));
        const stepX = deltaX / steps;
        const stepY = deltaY / steps;

        const existingTransform = window.getComputedStyle(source).transform;
        let baseX = 0, baseY = 0;
        if (existingTransform && existingTransform !== "none") {
            const match = existingTransform.match(/matrix\(([^)]+)\)/);
            if (match) {
                const parts = match[1].split(",").map((n) => parseFloat(n.trim()));
                if (parts.length === 6) {
                    baseX = parts[4];
                    baseY = parts[5];
                }
            }
        }

        setTimeout(() => {
            const root = document.getElementById(String(dragging.id)) as HTMLElement;
            if (root) root.style.opacity = "1";
        }, 50);

        await new Promise(r => setTimeout(r, 1000));

        let s = store.getState().board
        if (s.boardItems[dragging.id] === undefined || s.components[dragging.id].isBeingSubmitted)
            return

        setTimeout(() => {
            const root = document.getElementById(String(dragging.id)) as HTMLElement;
            if (root) root.style.opacity = "0.4";
        }, 50);

        for (let i = 0; i <= steps; i++) {
            await new Promise(r => setTimeout(r, duration / steps));
            const x = baseX + stepX * i;
            const y = baseY + stepY * i;

            s = store.getState().board
            if (s.boardItems[dragging.id] === undefined || s.components[dragging.id].isBeingSubmitted) {
                source.style.transform = originalTransform;
                return
            }

            source.style.transform = `translate(${x}px, ${y}px)`;
        }

        await new Promise(r => setTimeout(r, 500));
        source.style.transform = originalTransform;

        s = store.getState().board
        if (s.boardItems[dragging.id] === undefined || s.components[dragging.id].isBeingSubmitted)
            return

        setTimeout(() => {
            const root = document.getElementById(String(dragging.id)) as HTMLElement;
            if (root) root.style.opacity = "1";
        }, 50);
    }

}
