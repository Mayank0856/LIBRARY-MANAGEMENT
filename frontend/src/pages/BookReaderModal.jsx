import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import api from '../services/api';
import {
  X, BookOpen, Download, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, ZoomIn, ZoomOut, Maximize2, BookMarked
} from 'lucide-react';

// ── PDF.js Worker (required) ────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// ── Debounce helper ──────────────────────────────────────────────────────────
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ════════════════════════════════════════════════════════════════════════════
const BookReaderModal = ({ book, onClose }) => {
  const canvasRef       = useRef(null);
  const pdfRef          = useRef(null);
  const renderTaskRef   = useRef(null);

  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale,      setScale]      = useState(1.3);
  const [status,     setStatus]     = useState('loading'); // loading | ready | error
  const [saveLabel,  setSaveLabel]  = useState('');        // feedback toast

  const pdfUrl = book?.reader_url;

  // ── Prevent body scroll, ESC to close ─────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h); };
  }, [onClose]);

  // ── Load PDF + restore last page ──────────────────────────────────────────
  useEffect(() => {
    if (!pdfUrl) { setStatus('error'); return; }
    let cancelled = false;

    (async () => {
      try {
        setStatus('loading');

        // 1. Fetch saved progress from backend
        let startPage = 1;
        try {
          const { data } = await api.get(`/progress/${book.id}`);
          if (data?.page_number > 1) startPage = data.page_number;
        } catch (_) {}

        // 2. Load PDF document
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist/cmaps/',
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);

        const goTo = Math.min(startPage, pdf.numPages);
        setPage(goTo);
        setStatus('ready');
      } catch (err) {
        if (!cancelled) setStatus('error');
        console.error('PDF load error:', err);
      }
    })();

    return () => { cancelled = true; pdfRef.current = null; };
  }, [pdfUrl, book?.id]);

  // ── Render current page onto canvas ───────────────────────────────────────
  const renderPage = useCallback(async (pageNum, scaleVal) => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;

    // Cancel any in-progress render
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch (_) {}
    }

    try {
      const pdfPage = await pdf.getPage(pageNum);
      const viewport = pdfPage.getViewport({ scale: scaleVal });

      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width  = viewport.width;

      const task = pdfPage.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      await task.promise;
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Render error:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'ready') renderPage(page, scale);
  }, [page, scale, status, renderPage]);

  // ── Save progress to backend (debounced, fires 1.5s after page change) ────
  const persistProgress = useCallback(
    debounce(async (pageNum) => {
      if (!book?.id || !totalPages) return;
      try {
        await api.post(`/progress/${book.id}`, {
          page_number: pageNum,
          total_pages: totalPages,
        });
        setSaveLabel(`📌 Bookmarked page ${pageNum}`);
        setTimeout(() => setSaveLabel(''), 2500);
      } catch (_) {}
    }, 1500),
    [book?.id, totalPages]
  );

  useEffect(() => {
    if (status === 'ready' && page > 0) persistProgress(page);
  }, [page, status]);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const goTo   = (n) => setPage(Math.max(1, Math.min(n, totalPages)));
  const prev   = () => goTo(page - 1);
  const next   = () => goTo(page + 1);
  const zoomIn  = () => setScale(s => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.6));

  // Keyboard shortcuts: arrow keys for page, +/- for zoom
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); prev(); }
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-')                  zoomOut();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [page, totalPages]);

  const percent = totalPages ? Math.round((page / totalPages) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0f0f1a]"
      style={{ animation: 'fadeIn 0.2s ease' }}>

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#16213e] border-b border-white/10 shrink-0 gap-3">

        {/* Book info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-indigo-600 rounded-lg shrink-0">
            <BookOpen size={15} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-black text-xs leading-none truncate max-w-[150px] md:max-w-[380px]">
              {book?.title}
            </p>
            <p className="text-indigo-400 text-[9px] mt-0.5 font-bold uppercase tracking-widest">
              {status === 'loading' ? 'Opening…' : status === 'ready' ? `Page ${page} of ${totalPages}` : 'Error'}
            </p>
          </div>
        </div>

        {/* Page controls */}
        {status === 'ready' && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={prev} disabled={page <= 1}
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-lg transition-all">
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => goTo(Number(e.target.value))}
                className="w-14 text-center bg-white/10 border border-white/20 text-white text-xs font-black rounded-lg py-1.5 outline-none focus:border-indigo-400"
              />
              <span className="text-gray-400 text-xs font-bold">/ {totalPages}</span>
            </div>

            <button onClick={next} disabled={page >= totalPages}
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-lg transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={zoomOut} title="Zoom out (-)"
            className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-all hidden md:flex">
            <ZoomOut size={14} />
          </button>
          <span className="text-gray-400 text-[10px] font-bold hidden md:block">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} title="Zoom in (+)"
            className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-all hidden md:flex">
            <ZoomIn size={14} />
          </button>

          {pdfUrl && (
            <a href={pdfUrl} download title="Download PDF"
              className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-all hidden md:flex">
              <Download size={14} />
            </a>
          )}

          <button onClick={onClose} title="Close (Esc)"
            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-all">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      {status === 'ready' && (
        <div className="h-1 bg-white/5 shrink-0">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* ── Reader canvas area ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto bg-[#1a1a2e] flex items-start justify-center py-6 px-4">

        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-4 mt-20">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-900" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-white font-black">Opening Book…</p>
            <p className="text-gray-500 text-xs">Restoring your last position</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center gap-5 mt-20 text-center">
            <div className="p-5 bg-rose-500/10 rounded-3xl border border-rose-500/20">
              <AlertCircle size={40} className="text-rose-400 mx-auto" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">PDF Not Available Yet</h3>
              <p className="text-gray-400 text-sm mt-2 max-w-xs">
                The book file hasn't been downloaded yet. Use the Book Downloader page to get it.
              </p>
            </div>
          </div>
        )}

        {/* Canvas — PDF renders here */}
        <canvas
          ref={canvasRef}
          className={`shadow-2xl shadow-black/60 rounded-lg max-w-full ${status !== 'ready' ? 'hidden' : ''}`}
        />
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-2 bg-[#16213e] border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile zoom */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={zoomOut} className="p-1.5 bg-white/10 text-gray-300 rounded-lg"><ZoomOut size={13}/></button>
            <span className="text-gray-400 text-[9px] font-bold">{Math.round(scale*100)}%</span>
            <button onClick={zoomIn}  className="p-1.5 bg-white/10 text-gray-300 rounded-lg"><ZoomIn  size={13}/></button>
          </div>
          {/* Bookmark toast */}
          {saveLabel && (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold animate-in fade-in">
              <BookMarked size={12} /> {saveLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {status === 'ready' && (
            <span className="text-[10px] text-gray-500 font-bold">
              {percent}% read · {totalPages - page} pages left
            </span>
          )}
          <span className="text-[10px] text-gray-600 font-bold hidden md:block">← → to navigate · ESC to close</span>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
};

export default BookReaderModal;
