import Row from "@/components/common/Row";
import TextElement from "@/components/common/TextElement";
import { Dumbbell } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Row className="relative w-full min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950" />

      {/* Radial glow behind logo */}
      <div className="absolute top-32 w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full" />

      {/* Floating gradient blobs */}
      <div className="absolute top-[-120px] left-[-120px] size-[320px] bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] size-[320px] bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />

      <div className="relative flex flex-col items-center gap-8 w-full">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-blue-400 blur-lg opacity-40" />

            <div className="relative size-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
              <Dumbbell className="size-8 text-white" />
            </div>
          </div>

          <TextElement
            as="h1"
            className="font-heading text-4xl font-bold text-white tracking-tight"
          >
            Gymtal
          </TextElement>

          <TextElement as="p" className="text-white/70 text-sm tracking-wide">
            Smart Gym Management
          </TextElement>
        </div>

        {/* Login Card */}
        <div className="relative w-full max-w-md">
          {/* Glow */}
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-3xl opacity-30" />

          {/* Card */}
          <div className="relative rounded-lg md:rounded-2xl bg-white/95 backdrop-blur-lg shadow-2xl border border-white/40 p-2 md:p-4">
            {children}
          </div>
        </div>
      </div>
    </Row>
  );
}
