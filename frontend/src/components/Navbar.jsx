export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <span className="text-xl font-extrabold">CareerNova</span>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-10">
          <a className="text-sm font-semibold hover:text-indigo-600">Features</a>
          <a className="text-sm font-semibold hover:text-indigo-600">Pricing</a>
          <a className="text-sm font-semibold hover:text-indigo-600">Testimonials</a>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="px-6 py-2 text-sm font-bold hover:bg-indigo-50 rounded-full">
            Login
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full">
            Register
          </button>
        </div>

      </div>
    </nav>
  );
}    



// export default function Navbar() {
//   return (
//     <nav className="sticky top-0 z-50 glass-nav border-b border-indigo-100">
//       <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

//         {/* Logo */}
//         <div className="flex items-center gap-3">
//           <div className="bg-indigo-600 p-2 rounded-xl text-white">
//             🚀
//           </div>
//           <span className="text-xl font-extrabold">CareerNova</span>
//         </div>

//         {/* Menu */}
//         <div className="hidden md:flex items-center gap-10">
//           <a href="#" className="text-sm font-semibold hover:text-indigo-600">
//             Features
//           </a>
//           <a href="#" className="text-sm font-semibold hover:text-indigo-600">
//             Pricing
//           </a>
//           <a href="#" className="text-sm font-semibold hover:text-indigo-600">
//             Testimonials
//           </a>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center gap-3">
//           <button className="px-5 py-2 text-sm font-bold hover:bg-indigo-50 rounded-full">
//             Login
//           </button>

//           <button className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full shadow hover:scale-105 transition">
//             Register
//           </button>
//         </div>

//       </div>
//     </nav>
//   );
// }