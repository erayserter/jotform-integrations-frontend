import { useEffect } from "react";

function useOnClickOutside(refs, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (
        Object.values(refs).find((ref) => ref.current?.contains(event.target))
      )
        return;

      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [refs, handler]);
}

export default useOnClickOutside;
