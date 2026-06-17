import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineLocationMarker,
  HiOutlinePlusSm,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { placeOrder } from '../services/orderService';
import { getAddresses, addAddress } from '../services/addressService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../constants';

const ADDRESS_STORAGE_KEY = 'blinkit_checkout_address';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('blinkit_checkout_addresses_list');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');
  const [substitutes, setSubstitutes] = useState([]);

  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', houseNo: '', area: '', city: '', state: '', pincode: '',
  });

  useEffect(() => {
    getAddresses()
      .then(({ data }) => {
        const fetched = data.addresses || [];
        setAddresses((prev) => {
          const localOnly = prev.filter((p) => p.local);
          const merged = [...fetched, ...localOnly];
          localStorage.setItem('blinkit_checkout_addresses_list', JSON.stringify(merged));
          return merged;
        });
        if (!selectedAddress && fetched.length > 0) {
          setSelectedAddress(fetched[0]);
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem('blinkit_checkout_addresses_list');
          const localList = stored ? JSON.parse(stored) : [];
          setAddresses(localList);
          if (!selectedAddress && localList.length > 0) {
            setSelectedAddress(localList[0]);
          }
        } catch {}
      });
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(selectedAddress));
    }
  }, [selectedAddress]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const required = ['fullName', 'phone', 'houseNo', 'area', 'city', 'state', 'pincode'];
    const missing = required.filter((k) => !addressForm[k].trim());
    if (missing.length) { toast.error('Please fill all address fields'); return; }
    
    let savedAddr;
    try {
      const { data } = await addAddress(addressForm);
      savedAddr = data.address;
      toast.success('Address saved!');
    } catch {
      // Save locally if API fails
      savedAddr = { ...addressForm, _id: Date.now().toString(), local: true };
      toast.success('Address saved locally');
    }

    if (savedAddr) {
      setAddresses((prev) => {
        const updated = [...prev, savedAddr];
        localStorage.setItem('blinkit_checkout_addresses_list', JSON.stringify(updated));
        return updated;
      });
      setSelectedAddress(savedAddr);
      setShowAddressForm(false);
      setAddressForm({
        fullName: '', phone: '', houseNo: '', area: '', city: '', state: '', pincode: '',
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select or add a delivery address'); return; }
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }
    setPlacing(true);
    setError('');
    setSubstitutes([]);
    try {
      const items = cartItems.map((ci) => ({
        product: ci.product._id,
        quantity: ci.quantity,
      }));
      const { data } = await placeOrder(items);
      setOrderResult(data);
      await clearCart();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      const subs = err.response?.data?.substitutes || [];
      setError(msg);
      setSubstitutes(subs);
    } finally {
      setPlacing(false);
    }
  };

  // Order success screen
  if (orderResult) {
    const { bill, order } = orderResult;
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-8">Your order is being prepared and will arrive in 10 minutes.</p>

          {/* Bill breakdown from backend */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-left mb-6">
            <h2 className="font-black text-gray-900 mb-4">Bill Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span className="font-semibold">{formatCurrency(bill?.itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-semibold">{bill?.deliveryFee === 0 ? 'FREE' : formatCurrency(bill?.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Packaging Fee</span>
                <span className="font-semibold">{formatCurrency(bill?.packagingFee)}</span>
              </div>
              {bill?.surgeFee > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Peak Hours Surge</span>
                  <span className="font-semibold">{formatCurrency(bill?.surgeFee)}</span>
                </div>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between font-black text-gray-900 text-base">
                <span>Total Paid</span>
                <span>{formatCurrency(bill?.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              to={`/orders/${order?._id}`}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Track Order
            </Link>
            <Link
              to="/"
              className="bg-white border-2 border-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const deliveryFee = cartTotal >= 99 ? 0 : 20;
  const packagingFee = 5;
  const currentHour = new Date().getHours();
  const surgeFee = currentHour >= 19 && currentHour <= 23 ? 20 : 0;
  const estimatedTotal = cartTotal + deliveryFee + packagingFee + surgeFee;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Address + Items */}
        <div className="md:col-span-2 space-y-5">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <HiOutlineLocationMarker className="text-yellow-500 text-xl" />
                Delivery Address
              </h2>
              <button
                onClick={() => {
                  setShowAddressForm((v) => !v);
                  setAddressForm({
                    fullName: '', phone: '', houseNo: '', area: '', city: '', state: '', pincode: '',
                  });
                }}
                className="text-sm font-semibold text-yellow-600 flex items-center gap-1 hover:underline"
              >
                <HiOutlinePlusSm /> Add New
              </button>
            </div>

            {/* Add address form */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleSaveAddress}
                  className="mb-4 overflow-hidden"
                >
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {['fullName', 'phone', 'houseNo', 'area', 'city', 'state', 'pincode'].map((field) => (
                        <div key={field} className={field === 'fullName' || field === 'area' ? 'col-span-2' : ''}>
                          <input
                            type="text"
                            placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                            value={addressForm[field]}
                            onChange={(e) => setAddressForm((f) => ({ ...f, [field]: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400 transition-colors bg-white"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setAddressForm({
                            fullName: '', phone: '', houseNo: '', area: '', city: '', state: '', pincode: '',
                          });
                        }}
                        className="px-4 py-2 rounded-xl text-sm border border-gray-200 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Address list */}
            {addresses.length > 0 ? (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${selectedAddress?._id === addr._id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => setSelectedAddress(addr)}
                      className="mt-1 accent-yellow-400"
                    />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">{addr.fullName} · {addr.phone}</p>
                      <p className="text-gray-500">{addr.houseNo}, {addr.area}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              !showAddressForm && (
                <div className="text-center py-6 text-gray-400">
                  <HiOutlineLocationMarker className="text-3xl mx-auto mb-2" />
                  <p className="text-sm">No address saved. Add one above.</p>
                </div>
              )
            )}
          </div>

          {/* Cart items preview */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-black text-gray-900 mb-4">Items ({cartItems.length})</h2>
            <div className="space-y-3">
              {cartItems.map((item) => {
                const product = item.product || {};
                const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={product.image || PLACEHOLDER_IMAGE}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-50"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(effectivePrice * item.quantity)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Bill + CTA */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
            <h2 className="font-black text-gray-900 mb-4">Bill Estimate</h2>
            <div className="space-y-2.5 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span className="font-semibold">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-500' : ''}`}>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Packaging Fee</span>
                <span className="font-semibold">{formatCurrency(packagingFee)}</span>
              </div>
              {surgeFee > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Peak Hours Surge 🌙</span>
                  <span className="font-semibold">{formatCurrency(surgeFee)}</span>
                </div>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between font-black text-gray-900 text-base">
                <span>To Pay</span>
                <span>{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-1">
              * Final amount confirmed by server at order placement
            </p>
            <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
              📍 Delivering to: <span className="text-gray-700 font-medium truncate">
                {selectedAddress ? `${selectedAddress.area}, ${selectedAddress.city}` : 'No address selected'}
              </span>
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex items-start gap-2">
                <HiOutlineExclamationCircle className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Substitutes on error */}
            {substitutes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Try these instead:</p>
                {substitutes.map((s) => (
                  <Link
                    key={s._id}
                    to={`/products/${s._id}`}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-xl"
                  >
                    <img src={s.image || PLACEHOLDER_IMAGE} alt={s.name} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-green-600">₹{s.discountPrice || s.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placing || !selectedAddress || cartItems.length === 0}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
