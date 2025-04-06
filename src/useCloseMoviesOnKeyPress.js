import { useEffect } from "react";

export function useCloseMoviesOnKeyPress(key, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toUpperCase() === key.toUpperCase()) {
          action();
        }
      }

      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
