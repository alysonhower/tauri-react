import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from "@/components/ui/button"

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

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setScale(Math.min(width / 600, height / 800)); // Adjust 600 and 800 based on your PDF's dimensions
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div ref={containerRef} className="flex-grow overflow-auto">
                <Document
                    file="test.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} scale={scale} />
                </Document>
            </div>
            <div className="flex flex-row gap-2 p-2 justify-center items-center">
                <p>
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </p>
                <Button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    disabled={pageNumber >= (numPages || 0)}
                    onClick={nextPage}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}