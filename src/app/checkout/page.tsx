// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CreditCard, Smartphone, Banknote, ArrowLeft, Loader2, MapPin, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Step = 1 | 2 | 3;
type PaymentMethod = 'COD' | 'UPI' | 'ONLINE';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const subtotal = cartTotal;
  const delivery = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + delivery;

  useEffect(() => {
    if (items.length === 0 && step !== 3) {
      router.push('/cart');
    }
  }, [items, step, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => (prev - 1) as Step);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedId = `AW-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(generatedId);
      setSubmitting(false);
      nextStep();
      clearCart();
    }, 1500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Order Confirmed! 🎊\nOrder ID: ${orderId}\nName: ${formData.fullName}\nTotal: ₹${total}\nPayment: ${paymentMethod}`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  if (items.length === 0 && step !== 3) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-white/10 z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-cyan-400 z-0 transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {['Delivery', 'Payment', 'Confirmation'].map((label, idx) => {
              const isActive = step >= idx + 1;
              const isCurrent = step === idx + 1;
              return (
                <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-geist-mono transition-colors duration-300 ${isActive ? 'bg-cyan-500 text-black' : 'bg-zinc-900 border border-white/20 text-zinc-500'}`}>
                    {step > idx + 1 ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-sm font-geist-sans ${isCurrent ? 'text-white' : 'text-zinc-500'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div className="relative min-h-[60vh]">
          <AnimatePresence custom={direction} mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <div className="glass-card p-8 bg-white/[0.02] border border-white/10 rounded-3xl">
                  <h2 className="text-2xl font-geist-sans font-bold mb-6 flex items-center gap-2">
                    <MapPin className="text-cyan-400" /> Delivery Details
                  </h2>
                  <form onSubmit={handleDeliverySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-400 font-geist-mono">Full Name *</label>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-400 font-geist-mono">Phone Number *</label>
                        <input required type="tel" pattern="[0-9]{10}" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-zinc-400 font-geist-mono">Email (Optional)</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-zinc-400 font-geist-mono">Full Address *</label>
                        <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-400 font-geist-mono">City *</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-400 font-geist-mono">Pincode *</label>
                        <input required type="text" pattern="[0-9]{6}" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                      <Link href="/cart">
                        <button type="button" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                          <ArrowLeft className="w-4 h-4" /> Back to Cart
                        </button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="bg-cyan-500 text-black font-geist-sans font-bold px-8 py-3 rounded-xl hover:bg-cyan-400 transition-colors"
                      >
                        Continue to Payment
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0 flex flex-col md:flex-row gap-8"
              >
                <div className="flex-1 space-y-6">
                  <div className="glass-card p-8 bg-white/[0.02] border border-white/10 rounded-3xl h-full">
                    <h2 className="text-2xl font-geist-sans font-bold mb-6">Payment Method</h2>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'COD', icon: Banknote, label: 'Cash on Delivery', desc: 'Pay when you receive' },
                        { id: 'UPI', icon: Smartphone, label: 'UPI (GPay/PhonePe)', desc: 'Instant digital payment' },
                        { id: 'ONLINE', icon: CreditCard, label: 'Online Payment', desc: 'Secure online payment' }
                      ].map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 flex items-center gap-4 ${isSelected ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                          >
                            <div className={`p-3 rounded-full ${isSelected ? 'bg-cyan-400 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                              <method.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="font-geist-sans font-semibold text-lg">{method.label}</div>
                              <div className="text-sm text-zinc-400 font-geist-mono">{method.desc}</div>
                            </div>
                            {isSelected && (
                              <div className="ml-auto text-cyan-400">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3">
                  <div className="glass-card p-6 bg-white/[0.02] border border-white/10 rounded-3xl sticky top-28">
                    <h3 className="text-lg font-bold mb-4 font-geist-sans">Order Summary</h3>
                    
                    <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-zinc-400 truncate pr-4">{item.quantity}x {item.name}</span>
                          <span className="font-geist-mono">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10 font-geist-mono text-sm mb-6">
                      <div className="flex justify-between text-zinc-400">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Delivery</span>
                        <span>{delivery === 0 ? <span className="text-cyan-400">FREE</span> : `₹${delivery}`}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span className="text-cyan-400">₹{total}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePlaceOrder}
                        disabled={submitting}
                        className="w-full bg-cyan-500 text-black font-geist-sans font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Place Order'}
                      </motion.button>
                      <button 
                        onClick={prevStep}
                        disabled={submitting}
                        className="w-full py-2 text-zinc-400 hover:text-white text-sm transition-colors disabled:opacity-50"
                      >
                        Back to Delivery
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full absolute top-0 left-0"
              >
                <div className="glass-card p-10 bg-white/[0.02] border border-white/10 rounded-3xl max-w-2xl mx-auto text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>

                  <h2 className="text-3xl font-geist-sans font-bold mb-2">Order Placed Successfully!</h2>
                  <p className="text-zinc-400 font-geist-mono mb-8">Order ID: <span className="text-white font-bold">{orderId}</span></p>

                  <div className="bg-white/5 rounded-2xl p-6 text-left mb-8 space-y-4 border border-white/10">
                    <h3 className="font-geist-sans font-bold text-lg mb-2">Order Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-zinc-400">Name:</div>
                      <div className="font-medium">{formData.fullName}</div>
                      
                      <div className="text-zinc-400">Address:</div>
                      <div className="font-medium truncate">{formData.address}, {formData.city}</div>
                      
                      <div className="text-zinc-400">Payment:</div>
                      <div className="font-medium">{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'UPI' ? 'UPI' : 'Online Payment'}</div>
                      
                      <div className="text-zinc-400 mt-2">Total Amount:</div>
                      <div className="font-medium text-cyan-400 font-geist-mono text-lg mt-2">₹{total}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWhatsAppShare}
                      className="bg-[#25D366] text-white font-geist-sans font-bold px-8 py-3 rounded-full hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
                    >
                      Share on WhatsApp
                    </motion.button>
                    
                    <Link href="/shop">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black font-geist-sans font-bold px-8 py-3 rounded-full hover:bg-zinc-200 transition-colors w-full sm:w-auto"
                      >
                        Continue Shopping
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
