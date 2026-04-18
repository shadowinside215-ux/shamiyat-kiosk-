import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Utensils, 
  ClipboardList, 
  Plus, 
  LogOut, 
  ChevronLeft,
  Trash2,
  CheckCircle,
  Clock,
  PackageCheck,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Loader2
} from 'lucide-react';
import { MenuItem, Order, Category, CATEGORIES_LIST as categories } from '../types';
import { menuService, orderService } from '../services/dbService';
import { formatPrice } from '../lib/utils';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { seedMenu } from '../services/seedData';

import { auth, db, storage } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Timestamp } from 'firebase/firestore';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'dragonballsam86@gmail.com') {
        setIsAdminUser(true);
      } else {
        setIsAdminUser(false);
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!isAdminUser) return;
    
    const unsubOrders = orderService.subscribe(setOrders);
    const unsubMenu = menuService.subscribe(setMenuItems);
    return () => {
      unsubOrders();
      unsubMenu();
    };
  }, [isAdminUser]);

  const handleLogin = async () => {
    setLoginError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login failed', error);
      setLoginError(error.message || 'Login failed. Please check if popups are blocked.');
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-sham-dark text-gold-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-sham-dark p-8">
        <div className="max-w-md w-full bg-sham-surface border border-sham-border rounded-[40px] p-12 text-center shadow-2xl">
          <BarChart3 className="w-16 h-16 text-gold-500 mx-auto mb-6" />
          <h2 className="text-4xl font-serif gold-text-gradient mb-4">Admin Portal</h2>
          <p className="text-gold-500/60 mb-8">Sign in with Google. If authorized, you can manage menu items with names and prices in <b>DH</b>.</p>
          {loginError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {loginError}
            </div>
          )}
          <button 
            onClick={handleLogin}
            className="w-full py-4 gold-gradient text-sham-dark rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Sign In with Google
          </button>
          <button 
            onClick={onBack}
            className="mt-6 text-gold-500/40 hover:text-gold-500 transition-colors uppercase text-sm tracking-widest font-bold"
          >
            Back to Kiosk
          </button>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-sham-dark p-8 text-center">
        <AlertCircle className="w-20 h-20 text-red-500 mb-6" />
        <h2 className="text-4xl font-serif text-white mb-4">Access Denied</h2>
        <p className="text-gray-400 mb-2 max-w-md text-lg">Your account ({user.email}) is not an authorized administrator.</p>
        <p className="text-gold-500/60 mb-8 max-w-sm text-sm">To gain access, ensure your User UID (<b>{user.uid}</b>) is added to the <b>admins</b> collection in Firestore.</p>
        <div className="flex gap-4">
          <button onClick={handleLogout} className="px-8 py-4 bg-sham-surface border border-sham-border rounded-xl font-bold hover:bg-white/5 transition-all">Sign Out</button>
          <button onClick={onBack} className="px-8 py-4 gold-gradient text-sham-dark rounded-xl font-bold hover:scale-105 transition-all">Back to Kiosk</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-sham-dark text-white">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={cn(
              "fixed top-8 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border backdrop-blur-md",
              notification.type === 'success' ? "bg-green-500/90 text-white border-green-400/50" : "bg-red-500/90 text-white border-red-400/50"
            )}
          >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="w-80 bg-sham-surface border-r border-sham-border flex flex-col">
        <div className="p-8 border-b border-sham-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-sham-dark" />
            </div>
            <h1 className="text-2xl font-serif gold-text-gradient font-bold tracking-tight">Shamiyat Admin</h1>
          </div>
          <p className="text-gold-500/40 text-xs uppercase tracking-widest px-1">Kiosk Control Panel</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium",
              activeTab === 'orders' ? "bg-gold-500 text-sham-dark" : "text-gold-500/60 hover:bg-white/5"
            )}
          >
            <ClipboardList className="w-6 h-6" />
            Orders
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium",
              activeTab === 'menu' ? "bg-gold-500 text-sham-dark" : "text-gold-500/60 hover:bg-white/5"
            )}
          >
            <Utensils className="w-6 h-6" />
            Menu Management
          </button>
        </nav>

        <div className="p-6 border-t border-sham-border flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-gold-500/20" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.displayName}</p>
              <p className="text-[10px] text-gold-500/40 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut className="w-6 h-6" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 bg-[#0a0a0a]">
        {activeTab === 'orders' ? (
          <OrderManagement orders={orders} />
        ) : (
          <MenuManagement 
            items={menuItems} 
            showForm={showAddForm} 
            setShowForm={setShowAddForm}
            setNotification={setNotification}
          />
        )}
      </div>
    </div>
  );
}

function OrderManagement({ orders }: { orders: Order[] }) {
  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      await orderService.updateStatus(id, status);
    } catch (error) {
      console.error('Status update failed');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparing': return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'ready': return <PackageCheck className="w-5 h-5 text-green-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif gold-text-gradient mb-2">Live Orders</h2>
          <p className="text-gold-500/40 uppercase tracking-widest text-sm">Real-time kiosk stream</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {orders.map(order => (
            <motion.div
              layout
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "bg-sham-surface border-2 rounded-[32px] p-8 flex flex-col h-full",
                order.status === 'pending' ? "border-gold-500/40 shadow-lg shadow-gold-500/10" : "border-sham-border"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-serif font-bold">#{order.orderNumber}</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-tighter",
                      order.type === 'dine-in' ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                    )}>
                      {order.type}
                    </span>
                  </div>
                  <p className="text-gold-500/40 text-xs">
                    {(order.createdAt instanceof Timestamp) 
                      ? order.createdAt.toDate().toLocaleTimeString() 
                      : (typeof order.createdAt === 'number') 
                        ? new Date(order.createdAt).toLocaleTimeString()
                        : 'Processing...'}
                  </p>
                </div>
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl bg-sham-dark border border-sham-border",
                )}>
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-bold uppercase tracking-widest">{order.status}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-sham-dark/30 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-gold-500/10 text-gold-500 rounded-lg text-sm font-bold">
                        {item.quantity}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-sham-border flex items-center justify-between gap-4">
                <div className="text-xl font-serif font-bold text-gold-400">
                  {formatPrice(order.total)}
                </div>
                
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'preparing')}
                      className="px-6 py-3 bg-blue-600/20 text-blue-400 text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Process
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'ready')}
                      className="px-6 py-3 bg-green-600/20 text-green-400 text-sm font-bold rounded-xl hover:bg-green-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Ready
                    </button>
                  )}
                   {order.status === 'ready' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="px-6 py-3 bg-gray-600/20 text-gray-400 text-sm font-bold rounded-xl hover:bg-gray-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MenuManagement({ 
  items, 
  showForm, 
  setShowForm,
  setNotification
}: { 
  items: MenuItem[], 
  showForm: boolean, 
  setShowForm: (v: boolean) => void,
  setNotification: (v: {message: string, type: 'success' | 'error'} | null) => void
}) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Shawarma',
    image: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is too large. Please use a file smaller than 5MB.');
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: localUrl }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert('Please fill in all required fields (Name, Price, and Photo)');
      return;
    }
    
    // Truly instant: Save to Firestore immediately with local URL
    const dataToSave = { ...formData };
    const fileToUpload = selectedFile;
    
    // Ensure category is present
    if (!dataToSave.category) dataToSave.category = 'Shawarma';
    
    setShowForm(false);
    setFormData({ name: '', description: '', price: 0, category: 'Shawarma', image: '' });
    setSelectedFile(null);

  const syncTask = async () => {
      try {
        // Step 1: Create the document in Firestore with the local preview URL
        const docRef = await menuService.add({
          name: dataToSave.name || '',
          description: dataToSave.description || '',
          price: dataToSave.price || 0,
          category: dataToSave.category || 'Shawarma',
          image: dataToSave.image || '',
        } as MenuItem);

        // Step 2: Now upload the heavy image in the background
        if (fileToUpload) {
          const storageRef = ref(storage, `menu/${Date.now()}_${fileToUpload.name}`);
          const snapshot = await uploadBytes(storageRef, fileToUpload);
          const finalImageUrl = await getDownloadURL(snapshot.ref);

          // Step 3: Update with the permanent cloud URL
          await menuService.update(docRef.id, { image: finalImageUrl });
        }
        
        setNotification({ message: 'Item saved successfully!', type: 'success' });
      } catch (error: any) {
        console.error('Background sync failed', error);
        setNotification({ 
          message: error.message?.includes('permission-denied') 
            ? 'Access Denied: Please check if you are logged in as admin.'
            : 'Failed to save item. Please try again.', 
          type: 'error' 
        });
      }
    };
    
    syncTask();
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    await menuService.update(id, { isAvailable: !current });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      await menuService.delete(id);
    }
  };

  const handleSeed = async () => {
    if (confirm('Add default menu items to the database?')) {
      try {
        await seedMenu();
        alert('Menu seeded successfully!');
      } catch (err) {
        alert('Failed to seed menu. Check console.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif gold-text-gradient mb-2">Menu Collection</h2>
          <p className="text-gold-500/40 uppercase tracking-widest text-sm text-left">Update your digital display</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSeed}
            className="px-8 py-4 bg-sham-surface border border-gold-500/20 text-gold-500 rounded-2xl font-bold hover:bg-gold-500/10 transition-all"
          >
            Seed Sample Data
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-gold-500 text-sham-dark rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
          >
            <Plus className="w-6 h-6" />
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-sham-surface border border-sham-border rounded-3xl overflow-hidden group">
            <div className="relative h-48">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-sham-dark/80 backdrop-blur-md rounded-full text-[10px] uppercase font-black text-gold-500 border border-gold-500/20">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif mb-1">{item.name}</h3>
              <p className="text-gold-400 font-bold mb-4">{formatPrice(item.price)}</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleAvailability(item.id, item.isAvailable)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all",
                    item.isAvailable ? "bg-green-600/20 text-green-400 border border-green-600/30" : "bg-gray-600/20 text-gray-400"
                  )}
                >
                  {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                </button>
                <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-600/20 text-red-500 border border-red-600/30 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            ></motion.div>
            
            <motion.form
              onSubmit={handleAdd}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative bg-sham-surface border border-gold-500/20 rounded-[40px] p-10 max-w-2xl w-full shadow-2xl max-h-[95vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-sham-surface z-30 pb-4 mb-4 border-b border-gold-500/10">
                <h3 className="text-4xl font-serif gold-text-gradient">Add Food Item</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="col-span-2 space-y-2">
                  <label className="text-gold-500/60 uppercase text-xs tracking-widest font-bold">Item Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-sham-dark border border-sham-border p-4 rounded-xl focus:border-gold-500 outline-none"
                    placeholder="e.g. Damascus Chicken Shawarma"
                  />
                </div>

                <div className="space-y-2">
                   <label className="text-gold-500/60 uppercase text-xs tracking-widest font-bold">Category</label>
                   <select 
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
                    className="w-full bg-sham-dark border border-sham-border p-4 rounded-xl focus:border-gold-500 outline-none"
                   >
                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-gold-500/60 uppercase text-xs tracking-widest font-bold">Price (DH)</label>
                   <input 
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-sham-dark border border-sham-border p-4 rounded-xl focus:border-gold-500 outline-none"
                    placeholder="45"
                   />
                </div>

                <div className="col-span-2 space-y-2">
                   <label className="text-gold-500/60 uppercase text-xs tracking-widest font-bold">Description</label>
                   <textarea 
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-sham-dark border border-sham-border p-4 rounded-xl focus:border-gold-500 outline-none h-24 resize-none"
                    placeholder="Tell your customers about this dish..."
                   />
                </div>

                 <div className="col-span-2 space-y-2">
                   <label className="text-gold-500/60 uppercase text-xs tracking-widest font-bold">Menu Photo</label>
                   <div className="flex flex-col gap-4">
                     <div className={cn(
                       "relative h-64 w-full border-2 border-dashed border-sham-border rounded-2xl flex flex-col items-center justify-center gap-4 transition-all overflow-hidden bg-sham-dark/30",
                       formData.image && "border-solid border-gold-500/40"
                     )}>
                       {formData.image ? (
                         <>
                           <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                             <Upload className="w-8 h-8 text-white" />
                             <span className="text-xs font-bold uppercase tracking-widest text-white">Change Photo</span>
                           </div>
                           <button 
                             type="button"
                             onClick={(e) => {
                               e.stopPropagation();
                               setFormData(prev => ({ ...prev, image: '' }));
                               setSelectedFile(null);
                             }}
                             className="absolute top-4 right-4 z-20 p-3 bg-red-600/80 text-white rounded-xl hover:bg-red-600 transition-all shadow-xl"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </>
                       ) : (
                         <>
                           <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center">
                             <ImageIcon className="w-8 h-8 text-gold-500" />
                           </div>
                           <div className="text-center">
                             <p className="text-sm font-bold text-white mb-1">Click to Upload Photo</p>
                             <p className="text-[10px] text-gold-500/40 uppercase tracking-widest">JPG or PNG • Recommended 1:1 ratio</p>
                           </div>
                         </>
                       )}
                       
                       <input 
                         type="file"
                         ref={fileInputRef}
                         onChange={handleFileUpload}
                         accept="image/*"
                         className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                       />
                     </div>
                   </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-5 bg-sham-dark border border-sham-border rounded-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 gold-gradient text-sham-dark rounded-xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  Save Item
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
