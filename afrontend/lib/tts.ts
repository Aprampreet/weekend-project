// utils/tts.ts
export const readQuestionAloud = (text: string, callback?: () => void) => {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, your browser does not support text-to-speech.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    if (callback) callback();
  };

  window.speechSynthesis.speak(utterance);
};
