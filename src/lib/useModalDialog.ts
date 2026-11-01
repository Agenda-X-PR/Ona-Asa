import { useEffect, useRef } from 'react';

/** Native modal dialog: focus trap, Escape and inert background come from the browser. */
export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open) {
      if (dialog && !dialog.open) dialog.showModal?.();
      // Lock the page behind the dialog so it does not scroll under it.
      document.body.classList.add('scroll-locked');
    } else {
      if (dialog?.open) dialog.close();
      document.body.classList.remove('scroll-locked');
    }
  }, [open]);

  // Never leave the page locked if the component goes away while open.
  useEffect(() => () => document.body.classList.remove('scroll-locked'), []);
  return ref;
}
