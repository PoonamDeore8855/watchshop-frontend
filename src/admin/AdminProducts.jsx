import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Package, Search, Filter, Upload, X, ChevronRight, HardDrive, AlertTriangle } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State (for both add and edit)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(10);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products/get");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setBrand("");
    setStock(10);
    setImage(null);
    setEditingProduct(null);
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setBrand(product.brand);
    setStock(product.stock || 10);
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !brand) {
      alert("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (editingProduct) {
      try {
        setAdding(true);
        await axios.put(`/api/admin/products/${editingProduct.id}`, {
          name,
          price: Number(price),
          brand,
          stock: Number(stock)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Product updated successfully! ✨");
        fetchProducts();
        resetForm();
      } catch (err) {
        console.error("Error updating product:", err);
        alert("Failed to update product.");
      } finally {
        setAdding(false);
      }
    } else {
      if (!image) {
        alert("Please select an image for new products.");
        return;
      }
      setAdding(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("brand", brand);
      formData.append("image", image);

      try {
        await axios.post("/api/admin/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        });
        alert("Product added successfully! 🚀");
        fetchProducts();
        resetForm();
      } catch (err) {
        console.error("Error adding product:", err);
        alert("Failed to add product.");
      } finally {
        setAdding(false);
      }
    }
  };

  const deleteProduct = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/admin/products/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 uppercase relative">

      {/* 🌟 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 font-medium mt-1 uppercase italic">Manage your exclusive luxury watch inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search watches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black shadow-sm focus:ring-4 focus:ring-purple-50 transition-all outline-none w-full md:w-80 uppercase tracking-widest italic"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

        {/* 📝 FORM SECTION */}
        <div className="xl:col-span-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col gap-6 sticky top-28">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 shadow-inner">
                {editingProduct ? <Edit size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {editingProduct ? "Update Piece" : "New Collection"}
              </h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Product Identity</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rolex Submariner"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-black focus:ring-4 focus:ring-purple-50 transition outline-none uppercase tracking-widest italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Value (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="950000"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-black focus:ring-4 focus:ring-purple-50 transition outline-none italic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Maison</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Rolex"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-black focus:ring-4 focus:ring-purple-50 transition outline-none uppercase tracking-widest italic"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Inventory Count</label>
                <div className="relative">
                  <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-xs font-black focus:ring-4 focus:ring-purple-50 transition outline-none italic"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Product Visual</label>
                {editingProduct ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group h-32">
                    <img src={editingProduct.imageUrl || editingProduct.image} alt="Current" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                      <p className="text-[10px] font-black text-white uppercase text-center tracking-widest leading-relaxed">External assets cannot be modified in edit mode</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative group cursor-pointer border-2 border-dashed border-gray-100 rounded-[1.5rem] p-8 text-center hover:border-purple-400 hover:bg-purple-50/20 transition-all duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-purple-600 transition-colors">
                        <Upload size={20} />
                      </div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {image ? "✓ Media Ready" : "Upload high-res image"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {image && (
                <div className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-lg animate-in zoom-in-95 duration-500">
                  <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button
                disabled={adding}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-lg active:scale-95
                  ${adding ? "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black hover:shadow-purple-100"}
                `}
              >
                {adding ? (editingProduct ? "Updating..." : "Deploying...") : (editingProduct ? "Save Changes" : "Establish Product")}
              </button>

              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  Discard Changes
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 📦 PRODUCT LIST */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex justify-between items-center italic">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Inventory <span className="text-gray-900 not-italic">({filteredProducts.length})</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProducts.length === 0 && (
              <div className="p-20 text-center col-span-2 bg-white rounded-[3rem] border-2 border-dashed border-gray-50 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                  <Package size={40} />
                </div>
                <p className="text-xl font-black text-gray-300 uppercase italic">No active timepieces matched</p>
                <p className="text-gray-400 text-xs mt-1 uppercase font-bold tracking-widest italic">Ensure your search criteria matches our exclusive catalog.</p>
              </div>
            )}

            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 flex gap-5 items-center group/card hover:border-purple-200 transition-all duration-300">
                <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 group-hover/card:scale-105 transition-transform duration-700 shadow-inner">
                  <img src={p.imageUrl || p.image || "/default-image.jpg"} alt={p.name} className="w-full h-full object-cover grayscale-[30%] group-hover/card:grayscale-0 transition-all duration-700" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black uppercase rounded-lg border border-purple-100 tracking-tighter shadow-sm">
                      {p.brand}
                    </span>
                    {p.stock <= 5 && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-black uppercase rounded-lg border border-red-100 animate-pulse tracking-tighter shadow-sm">
                        Scarcity Warning
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-gray-900 truncate tracking-tight uppercase italic text-sm">{p.name}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-black text-purple-700 italic tracking-tighter">₹{p.price?.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                      Units: <span className="text-gray-900 not-italic">{p.stock || 0}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-purple-600 hover:text-white transition-all duration-300 border border-gray-100 shadow-sm"
                    title="Edit Piece"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 border border-gray-100 shadow-sm"
                    title="Delete Piece"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ⚠️ DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300 uppercase">
          <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500 text-center border border-red-50">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6 shadow-inner text-red-500">
              <AlertTriangle size={36} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 italic">Confirm Depletion</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed uppercase italic">Are you sure you want to remove this <span className="text-red-600 font-black">Timepiece</span> from your inventory? This action is irreversible.</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="py-4 rounded-2xl bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors italic"
              >
                Cancel
              </button>
              <button
                onClick={deleteProduct}
                disabled={deleting}
                className="py-4 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-95"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={16} />
                )}
                Purge Metadata
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
