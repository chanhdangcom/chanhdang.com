interface ViewTransitionDocument extends Document {
  startViewTransition?: (callback?: () => void) => ViewTransition;
}

export function withViewTransition(callback: () => void) {
  const doc = document as ViewTransitionDocument;
  if (typeof doc.startViewTransition !== "function") {
    callback();
    return;
  }

  const transition = doc.startViewTransition(() => callback());
  transition.finished.then(() => {
    console.log("🎬 View Transition đã hoàn tất!");
  });
}