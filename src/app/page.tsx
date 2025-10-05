import { TicTacToeGame } from "@/components/tic-tac-toe/tic-tac-toe-game";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%),_radial-gradient(circle_at_center,_rgba(20,184,166,0.2),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.25),_transparent_55%)]" />
      <div className="mx-auto w-full max-w-5xl">
        <TicTacToeGame />
      </div>
    </main>
  );
}
