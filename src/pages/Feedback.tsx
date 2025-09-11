import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MessageSquare, Send, CheckCircle, AlertCircle, Star, Lightbulb, Bug } from 'lucide-react';

interface FeedbackForm {
  name: string;
  email: string;
  category: 'general' | 'feature' | 'bug' | 'improvement';
  subject: string;
  message: string;
  rating: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function Feedback() {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
    rating: 0
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'general', label: 'Feedback Umum', icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { value: 'feature', label: 'Request Fitur', icon: Lightbulb, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { value: 'bug', label: 'Laporkan Bug', icon: Bug, color: 'text-red-500', bgColor: 'bg-red-50' },
    { value: 'improvement', label: 'Saran Perbaikan', icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-50' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek wajib diisi';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan wajib diisi';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Pesan minimal 10 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create email content
      const selectedCategory = categories.find(cat => cat.value === formData.category);
      const emailSubject = `[Reviotax Feedback] ${selectedCategory?.label} - ${formData.subject}`;
      
      const emailBody = `
Feedback Baru dari Reviotax

Nama: ${formData.name}
Email: ${formData.email}
Kategori: ${selectedCategory?.label}
Rating: ${formData.rating > 0 ? `${formData.rating}/5 bintang` : 'Tidak ada rating'}

Subjek: ${formData.subject}

Pesan:
${formData.message}

---
Dikirim dari Reviotax Feedback Form
Waktu: ${new Date().toLocaleString('id-ID')}
      `.trim();

      // Create mailto link
      const mailtoLink = `mailto:pixelbymoz@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success state
      setIsSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          category: 'general',
          subject: '',
          message: '',
          rating: 0
        });
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Terjadi kesalahan saat mengirim feedback. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange('rating', star)}
            className={`p-1 rounded transition-colors ${
              star <= formData.rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
          </button>
        ))}
        {formData.rating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {formData.rating}/5 bintang
          </span>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
          <Card className="text-center">
            <div className="py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Terima Kasih!</h2>
              <p className="text-gray-600 mb-6">
                Feedback Anda telah dikirim. Email client akan terbuka untuk mengirim pesan ke pixelbymoz@gmail.com
              </p>
              <p className="text-sm text-gray-500">
                Kami sangat menghargai masukan Anda untuk pengembangan Reviotax ke depannya.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-2">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback & Saran</h1>
          </div>
          <p className="text-gray-600">
            Bantu kami mengembangkan Reviotax dengan memberikan feedback, request fitur, atau melaporkan bug yang Anda temukan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card padding="sm">
              <div className="text-center">
                <div className="bg-teal-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Feedback Umum</h3>
                <p className="text-sm text-gray-600">
                  Bagikan pengalaman Anda menggunakan Reviotax
                </p>
              </div>
            </Card>

            <Card padding="sm">
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Request Fitur</h3>
                <p className="text-sm text-gray-600">
                  Usulkan fitur baru yang ingin Anda lihat
                </p>
              </div>
            </Card>

            <Card padding="sm">
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Bug className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Laporkan Bug</h3>
                <p className="text-sm text-gray-600">
                  Laporkan masalah atau error yang Anda temukan
                </p>
              </div>
            </Card>
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Kirim Feedback</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="nama@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kategori Feedback
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <label
                          key={category.value}
                          className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                            formData.category === category.value
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category.value}
                            checked={formData.category === category.value}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`p-2 rounded-lg mr-3 ${category.bgColor}`}>
                            <Icon className={`h-5 w-5 ${category.color}`} />
                          </div>
                          <span className="font-medium text-gray-900">{category.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rating Pengalaman (Opsional)
                  </label>
                  <div className="flex items-center space-x-4">
                    {renderStarRating()}
                    {formData.rating > 0 && (
                      <button
                        type="button"
                        onClick={() => handleInputChange('rating', 0)}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                      errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ringkasan singkat feedback Anda"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none ${
                      errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Jelaskan feedback, saran, atau masalah yang ingin Anda sampaikan..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message ? (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.message}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Minimal 10 karakter</p>
                    )}
                    <p className="text-sm text-gray-400">
                      {formData.message.length}/1000
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[140px]"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
            <div className="flex items-start space-x-4">
              <div className="bg-teal-100 rounded-full p-2 flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-900 mb-2">Tentang Feedback Anda</h3>
                <div className="text-sm text-teal-800 space-y-1">
                  <p>• Feedback akan dikirim langsung ke email developer (pixelbymoz@gmail.com)</p>
                  <p>• Kami akan merespons dalam 1-3 hari kerja</p>
                  <p>• Semua saran dan masukan sangat berharga untuk pengembangan Reviotax</p>
                  <p>• Data pribadi Anda hanya digunakan untuk komunikasi terkait feedback</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}