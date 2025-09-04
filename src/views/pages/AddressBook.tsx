import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Mail, User, Building, Star, StarOff, Wallet, Plus, X } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  company?: string;
  isFavorite: boolean;
  createdAt: Date;
}

const AddressBook = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
    company: ""
  });

  // Sample data
  const sampleContacts: Contact[] = [
    {
      id: "1",
      name: "Luke",
      email: "luke@protonmail.com",
      walletAddress: "0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b6",
      company: "WorldIP",
      isFavorite: true,
      createdAt: new Date("2024-01-15")
    },
    {
      id: "2",
      name: "Wokeblunt",
      email: "wokeblunt@gmail.com",
      walletAddress: "0x1234567890123456789012345678901234567890",
      company: "Blockchain Solutions",
      isFavorite: false,
      createdAt: new Date("2024-01-20")
    },
    {
      id: "3",
      name: "Keshav",
      email: "keshav@techcorp.com",
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      company: "TechCorp",
      isFavorite: true,
      createdAt: new Date("2024-01-25")
    }
  ];

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem("addressBook");
    if (savedContacts && savedContacts !== "[]") {
      try {
        const parsedContacts = JSON.parse(savedContacts).map((contact: any) => ({
          ...contact,
          createdAt: new Date(contact.createdAt)
        }));
        setContacts(parsedContacts);
      } catch (error) {
        console.error("Error parsing saved contacts:", error);
        setContacts(sampleContacts);
      }
    } else {
      // If no saved contacts or empty array, use sample data
      setContacts(sampleContacts);
    }
  }, []);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("addressBook", JSON.stringify(contacts));
    }
  }, [contacts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || (!formData.email.trim() && !formData.walletAddress.trim())) {
      alert("Name and either email or wallet address are required");
      return;
    }

    if (editingContact) {
      // Update existing contact
      setContacts(prev => prev.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...formData }
          : contact
      ));
      setEditingContact(null);
    } else {
      // Add new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
        isFavorite: false,
        createdAt: new Date()
      };
      setContacts(prev => [...prev, newContact]);
    }

    // Reset form
    resetForm();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      walletAddress: contact.walletAddress || "",
      company: contact.company || ""
    });
    setSelectedContact(contact);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
  };

  const toggleFavorite = (id: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      walletAddress: "",
      company: ""
    });
    setEditingContact(null);
    setSelectedContact(null);
  };

  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (contact.walletAddress && contact.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Address Book</h1>
              <p className="text-gray-600">Manage your contacts and collaborators</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Contacts List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            {/* Search Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9519] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? "No contacts found" : "No contacts yet"}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? "Try adjusting your search terms" 
                      : "Add your first contact using the form on the right"
                    }
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedContact?.id === contact.id
                          ? "bg-[#FF9519]/10 border-2 border-[#FF9519]"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#5865F2] to-[#FF9519] rounded-full flex items-center justify-center text-white font-bold">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            <p className="text-sm text-gray-600">
                              {contact.email || contact.walletAddress}
                            </p>
                            {contact.company && (
                              <p className="text-xs text-gray-500">{contact.company}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(contact.id);
                            }}
                            className="text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                          >
                            {contact.isFavorite ? (
                              <Star className="w-4 h-4 fill-current text-yellow-500" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(contact);
                            }}
                            className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contact.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Add/Edit Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingContact ? "Edit Contact" : "Add New Contact"}
                </h2>
                {editingContact && (
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9519] focus:border-transparent transition-all duration-200"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9519] focus:border-transparent transition-all duration-200"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9519] focus:border-transparent transition-all duration-200"
                      placeholder="Enter wallet address (0x...)"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Either email or wallet address is required
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9519] focus:border-transparent transition-all duration-200"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#FF9519] hover:bg-[#E6850F] text-white py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {editingContact ? "Update Contact" : "Add Contact"}
                  </button>
                </div>

                {editingContact && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressBook; 