import { useSentences } from "./hooks/useSentences";
import { HomeScreen } from "./screens/HomeScreen";

const STARTER_RUN_SIZE = 20;

export default function App() {
  const sentenceRequest = useSentences(1, STARTER_RUN_SIZE, true);

  const sentences = sentenceRequest.data?.items ?? [];
  const totalSentences = sentenceRequest.data?.total ?? 0;
  const lastPosition = 1;

  function startListening(): void {
    if (sentences.length === 0) {
      return;
    }

    console.log("Start listening with:", sentences);
  }

  function browseSentences(): void {
    console.log("Browse sentences");
  }

  return (
    <HomeScreen
      lastPosition={lastPosition}
      totalSentences={totalSentences}
      onStartListening={startListening}
      onBrowseSentences={browseSentences}
    />
  );
}
