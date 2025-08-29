// components/Footer.js

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 p-10 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* Services */}
        <div>
          <h6 className="text-lg font-semibold text-white mb-3">Services</h6>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Branding</a></li>
            <li><a href="#" className="hover:text-white transition">Design</a></li>
            <li><a href="#" className="hover:text-white transition">Marketing</a></li>
            <li><a href="#" className="hover:text-white transition">Advertisement</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h6 className="text-lg font-semibold text-white mb-3">Company</h6>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">About us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
            <li><a href="#" className="hover:text-white transition">Jobs</a></li>
            <li><a href="#" className="hover:text-white transition">Press kit</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h6 className="text-lg font-semibold text-white mb-3">Legal</h6>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Terms of use</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy policy</a></li>
            <li><a href="#" className="hover:text-white transition">Cookie policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Skill Mint. All rights reserved.
      </div>
    </footer>
  );
}
