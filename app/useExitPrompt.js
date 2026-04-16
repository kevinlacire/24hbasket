import { useState, useEffect } from "react";

const initBeforeUnLoad = (showExitPrompt) => {
  window.onbeforeunload = (event) => {
    if (showExitPrompt) {
      event.preventDefault();
    }
  };
};

export default function useExitPrompt(bool) {
  const [showExitPrompt, setShowExitPrompt] = useState(bool);

  useEffect(() => {
    initBeforeUnLoad(showExitPrompt);
  }, [showExitPrompt]);

  return [showExitPrompt, setShowExitPrompt];
}
