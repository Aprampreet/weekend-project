export const startVoiceRecognition = (
  onResult: (transcript: string) => void,
  onEnd?: () => void
) => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Sorry, your browser does not support voice recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true; 
  recognition.interimResults = true; // show partial results while speaking
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        onResult(transcript); // final result
      } else {
        interimTranscript += transcript;
      }
    }
    if (interimTranscript) onResult(interimTranscript); // show interim
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "network") {
      alert(
        "Voice recognition encountered a network error. Try speaking in shorter sentences."
      );
      recognition.stop();
      if (onEnd) onEnd();
    }
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();

  // return a function to stop recognition manually
  return () => {
    recognition.stop();
  };
};
