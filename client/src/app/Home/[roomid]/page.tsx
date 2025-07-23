import EditorPanel from "../../(root)/_components/EditorPanel";
import Header from "../../(root)/_components/Header";
import OutputPanel from "../../(root)/_components/OutputPanel";
import AI from "@/app/(root)/_components/AI-Assistant";

export default function Home({}: { params: { roomId: string } }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel />
          <OutputPanel />
          <AI />
        </div>
      </div>
    </div>
  );
}
