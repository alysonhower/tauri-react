import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from "@/components/ui/button"
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PDFViewer() {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number | null }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function firstPage() {
        setPageNumber(1);
    }

    function lastPage() {
        if (numPages) {
            setPageNumber(numPages);
        }
    }

    function zoomIn() {
        setScale(prevScale => Math.min(prevScale + 0.1, 3));
    }

    function zoomOut() {
        setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
    }

    function rotateClockwise() {
        setRotation(prevRotation => (prevRotation + 90) % 360);
    }

    function rotateCounterclockwise() {
        setRotation(prevRotation => (prevRotation - 90 + 360) % 360);
    }

    function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
        if (event.ctrlKey) {
            event.preventDefault();
            const zoomFactor = event.deltaY > 0 ? -0.1 : 0.1;
            setScale(prevScale => Math.min(Math.max(prevScale + zoomFactor, 0.5), 3));
        }
    }

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setScale(Math.min(width / 600, height / 800));
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div 
                ref={containerRef} 
                className="flex-grow overflow-auto" 
                onWheel={handleWheel}
            >
                <Document
                    file="test.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} scale={scale} rotate={rotation} />
                </Document>
            </div>
            <div className="flex flex-row gap-2 p-2 justify-center items-center">
                <p>
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </p>
                <Button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={firstPage}
                    size="icon"
                >
                    <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    size="icon"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    disabled={pageNumber >= (numPages || 0)}
                    onClick={nextPage}
                    size="icon"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    disabled={pageNumber >= (numPages || 0)}
                    onClick={lastPage}
                    size="icon"
                >
                    <ChevronLast className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    onClick={zoomOut}
                    size="icon"
                >
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    onClick={zoomIn}
                    size="icon"
                >
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    onClick={rotateCounterclockwise}
                    size="icon"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    onClick={rotateClockwise}
                    size="icon"
                >
                    <RotateCw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}