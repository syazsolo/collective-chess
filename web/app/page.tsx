import { ChessGame } from "./components/chess";

export default function Home() {
  return (
    // TODO: rethink the background color and text color, maybe use a theme provider
    <main className="flex min-h-dvh items-center justify-center bg-[#262421] p-3 text-[#f4f1ea] sm:p-6">
      <ChessGame />
    </main>
  );
}
