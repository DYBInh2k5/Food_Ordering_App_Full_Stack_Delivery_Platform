function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FoodApp 🍕</h3>
            <p className="text-gray-400">
              The best food ordering platform in your city
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Browse Restaurants</a></li>
              <li><a href="#" className="hover:text-white">Track Orders</a></li>
              <li><a href="#" className="hover:text-white">My Orders</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Restaurants</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Partner With Us</a></li>
              <li><a href="#" className="hover:text-white">Restaurant Login</a></li>
              <li><a href="#" className="hover:text-white">Help & Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 FoodApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
