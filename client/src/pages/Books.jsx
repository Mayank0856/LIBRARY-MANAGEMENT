import api from '../services/api';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const ITEMS_PER_PAGE = 10;

const BookModal = ({ book, categories, authors, publishers, onClose, onSaved }) => {
  const isEdit = !!book?.id;
  const [form, setForm] = useState({
    title: book?.title || '',
    isbn: book?.isbn || '',
    edition: book?.edition || '',
    language: book?.language || 'English',
    total_copies: book?.total_copies || 1,
    available_copies: book?.available_copies || 1,
    shelf_location: book?.shelf_location || '',
    description: book?.description || '',
    author_id: book?.author_id || '',
    category_id: book?.category_id || '',
    publisher_id: book?.publisher_id || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) await api.put(`/books/${book.id}`, form);
      else await api.post('/books', form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        {error && <div className="mx-5 mt-4 bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input className="input" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Edition</label>
            <input className="input" value={form.edition} onChange={e => setForm({...form, edition: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <input className="input" value={form.language} onChange={e => setForm({...form, language: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shelf Location</label>
            <input className="input" value={form.shelf_location} onChange={e => setForm({...form, shelf_location: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Copies</label>
            <input type="number" min="1" className="input" required value={form.total_copies} onChange={e => setForm({...form, total_copies: +e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Available Copies</label>
            <input type="number" min="0" className="input" required value={form.available_copies} onChange={e => setForm({...form, available_copies: +e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author *</label>
            <select className="input" required value={form.author_id} onChange={e => setForm({...form, author_id: e.target.value})}>
              <option value="">Select Author</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select className="input" required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Publisher</label>
            <select className="input" value={form.publisher_id} onChange={e => setForm({...form, publisher_id: e.target.value})}>
              <option value="">Select Publisher</option>
              {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Update Book' : 'Add Book'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Books = () => {
  const { user } = useAuth();
  const canEdit = user.role === 'Admin' || user.role === 'Librarian';
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | book object
  const [qrModal, setQrModal] = useState(null); // book object
  const [page, setPage] = useState(1);

  const fetchBooks = () => api.get('/books').then(r => setBooks(r.data));

  useEffect(() => {
    fetchBooks();
    api.get('/categories').then(r => setCategories(r.data));
    api.get('/authors').then(r => setAuthors(r.data));
    api.get('/publishers').then(r => setPublishers(r.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  const filtered = books.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn?.includes(search) ||
    b.Author?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">📚 Book Catalog</h1>
        {canEdit && (
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setModal('add')}>
            <Plus size={18} /> Add Book
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          className="input pl-10 w-full max-w-md"
          placeholder="Search by title, ISBN, author..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">ISBN</th>
              <th className="px-4 py-3 text-center">Copies</th>
              <th className="px-4 py-3 text-center">Available</th>
              <th className="px-4 py-3 text-center">Status</th>
              {canEdit && <th className="px-4 py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No books found.</td></tr>
            ) : paginated.map(book => (
              <tr key={book.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-900">{book.title}</td>
                <td className="px-4 py-3 text-gray-600">{book.Author?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{book.Category?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{book.isbn || '—'}</td>
                <td className="px-4 py-3 text-center">{book.total_copies}</td>
                <td className="px-4 py-3 text-center font-semibold text-indigo-700">{book.available_copies}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.available_copies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {book.available_copies > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                {canEdit && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <button className="p-1.5 hover:bg-gray-100 text-gray-600 rounded" title="View QR" onClick={() => setQrModal(book)}>
                        <QrCode size={15} />
                      </button>
                      <button className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded" onClick={() => setModal(book)}>
                        <Edit2 size={15} />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 text-red-500 rounded" onClick={() => handleDelete(book.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {(page-1)*ITEMS_PER_PAGE+1}–{Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="btn btn-secondary py-1 px-2 disabled:opacity-40"><ChevronLeft size={16}/></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="btn btn-secondary py-1 px-2 disabled:opacity-40"><ChevronRight size={16}/></button>
          </div>
        </div>
      )}

      {modal && (
        <BookModal
          book={modal === 'add' ? null : modal}
          categories={categories}
          authors={authors}
          publishers={publishers}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchBooks(); }}
        />
      )}

      {qrModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl relative max-w-sm w-full mx-auto">
             <button onClick={() => setQrModal(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition">
                <X size={20} />
             </button>
             <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{qrModal.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Scan to pull up record</p>
             </div>
             <div className="p-4 bg-white border-4 border-indigo-600 rounded-xl">
                <QRCodeSVG value={JSON.stringify({ id: qrModal.id, type: 'BOOK', isbn: qrModal.isbn })} size={200} />
             </div>
             <div className="text-center py-2 px-4 bg-gray-50 rounded-lg w-full">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none">ISBN</p>
                <p className="text-sm font-mono mt-1">{qrModal.isbn || 'N/A'}</p>
             </div>
             <button onClick={() => window.print()} className="btn btn-secondary w-full">Print Label</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
