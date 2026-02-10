export default function Payment() {
  return (
    <div className="pt-40 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[420px] text-center">
        
        <h1 className="text-2xl font-bold mb-4">
          Payment Page
        </h1>

        <p className="text-gray-500 mb-6">
          Payment gateway will be integrated here.
        </p>

        <button
          className="w-full bg-black text-white py-3 rounded-lg
                     hover:bg-gray-900 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
