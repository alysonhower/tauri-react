import "./index.css";
import PDFViewer from "./PDFViewer";

function App() {
  return (
    <main className="w-screen h-screen flex flex-col">
      <div className="w-1/2 h-full">
        <PDFViewer />
      </div>
    </main>
  );
}

export default App;