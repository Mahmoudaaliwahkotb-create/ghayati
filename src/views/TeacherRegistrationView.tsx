import React, { useState, useRef } from 'react';
import { ActiveTab, TeacherRegistrationData } from '../types';
import { SUBJECT_CATALOG } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { saveTeacherRegistration } from '../lib/supabase';

interface TeacherRegistrationViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

const DEFAULT_AVATARS = [
  {
    label: 'معلم ١',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  },
  {
    label: 'معلمة ١',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  },
  {
    label: 'معلم ٢',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  },
  {
    label: 'معلمة ٢',
    url: 'https://images.unsplash.com/photo-1580894732484-8255e71e72a8?auto=format&fit=crop&q=80&w=256',
  },
];

export const TeacherRegistrationView: React.FC<TeacherRegistrationViewProps> = ({ setActiveTab }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [subject, setSubject] = useState(SUBJECT_CATALOG[1]?.title || 'اللغة العربية');
  const [monthlyPrice, setMonthlyPrice] = useState<string>('350');
  const [experienceYears, setExperienceYears] = useState<string>('5');
  const [bio, setBio] = useState('');

  // UI & Submission State
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<TeacherRegistrationData | null>(null);
  const [referenceId, setReferenceId] = useState<string>('');

  // Handle Photo File Upload (drag & drop or manual file selection)
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhoto(result);
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSelectAvatar = (url: string) => {
    setPhoto(url);
    setPhotoPreview(url);
    setErrorMessage(null);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 3) {
      setErrorMessage('يرجى إدخال الاسم الكامل الثلاثي أو الرباعي للمعلم.');
      return;
    }

    const priceNum = Number(monthlyPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('يرجى تحديد السعر الشهري بصورة صحيحة بالجنيه المصري.');
      return;
    }

    const expNum = Number(experienceYears);
    if (isNaN(expNum) || expNum < 0) {
      setErrorMessage('يرجى إدخال عدد سنوات خبرة صالح.');
      return;
    }

    if (!bio.trim() || bio.trim().length < 15) {
      setErrorMessage('يرجى كتابة نبذة تعريفية موجزة عن مؤهلك العلمي وخبرتك التدريسية (15 حرفاً على الأقل).');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalPhoto =
        photo ||
        photoPreview ||
        DEFAULT_AVATARS[0].url;

      const payload: TeacherRegistrationData = {
        fullName: trimmedName,
        photo: finalPhoto,
        subject,
        monthlyPrice: priceNum,
        experienceYears: expNum,
        bio: bio.trim(),
        status: 'pending', // Explicitly set to 'pending' by default
      };

      const result = await saveTeacherRegistration(payload);

      setSubmittedData(payload);
      setReferenceId(result.referenceId);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Registration submit error:', err);
      setErrorMessage('تعذر إرسال الطلب في الوقت الحالي. يرجى مراجعة الاتصال وإعادة المحاولة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setPhoto('');
    setPhotoPreview('');
    setMonthlyPrice('350');
    setExperienceYears('5');
    setBio('');
    setIsSuccess(false);
    setSubmittedData(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full text-right">
      {/* Unified Breadcrumbs Navigation */}
      <Breadcrumbs
        onBack={() => setActiveTab('teachers')}
        backLabel="العودة إلى المعلمين"
        items={[
          {
            label: 'فصولي (الرئيسية)',
            icon: 'home',
            onClick: () => setActiveTab('classes'),
          },
          {
            label: 'دليل المعلمين',
            onClick: () => setActiveTab('teachers'),
          },
          {
            label: 'تسجيل معلم جديد (انضم إلينا)',
            isCurrent: true,
          },
        ]}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-margin py-space-xl flex flex-col gap-space-xl">
        {/* Banner Section */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg md:p-space-xl shadow-sm relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-52 h-52 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-10 w-64 h-32 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-start md:items-center gap-space-md">
              <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-3xl">how_to_reg</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-headline-md font-headline-md text-on-surface font-bold tracking-tight">
                    تسجيل معلم جديد | منصة غايتي
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-label-sm bg-primary/10 text-primary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    انضم لنخبة المعلمين
                  </span>
                </div>
                <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
                  سجل بياناتك ومؤهلاتك للانضمام إلى منصة غايتي التعليمية. تخضع جميع الطلبات لمراجعة دقيقة لضمان أعلى معايير الجودة الأكاديمية.
                </p>
              </div>
            </div>

            {/* Status Policy Notice */}
            <div className="hidden lg:flex flex-col items-end gap-1 text-left bg-surface-container-low border border-outline-variant/60 px-3.5 py-2.5 rounded-xl">
              <span className="text-[11px] text-outline font-medium">سياسة الاعتماد</span>
              <span className="text-label-sm font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-amber-500">verified_user</span>
                <span>المراجعة خلال 24 ساعة</span>
              </span>
            </div>
          </div>
        </section>

        {/* SUCCESS VIEW */}
        {isSuccess ? (
          <section className="bg-surface-container-lowest border-2 border-emerald-500/40 rounded-2xl p-space-xl shadow-lg text-center space-y-space-lg animate-in fade-in zoom-in-95 duration-200">
            {/* Animated Celebration Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                تم تسجيل طلبك بنجاح!
              </h2>

              {/* Exact user-requested message */}
              <p className="text-title-lg font-title-lg font-bold text-emerald-700 bg-emerald-50 py-3 px-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                تم إرسال طلبك، سيتم مراجعته والتواصل معك قريبًا.
              </p>

              <p className="text-body-sm font-body-sm text-on-surface-variant pt-1">
                رقم المرجع الأكاديمي للطلب:{' '}
                <span className="font-mono font-bold text-primary dir-ltr inline-block bg-surface-container px-2 py-0.5 rounded-md">
                  {referenceId}
                </span>
              </p>
            </div>

            {/* Submission Summary Card */}
            {submittedData && (
              <div className="bg-surface-container-low border border-outline-variant/70 rounded-xl p-space-md text-right max-w-lg mx-auto space-y-3">
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
                  <span className="text-label-md font-bold text-on-surface">تفاصيل الطلب المرسل:</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>حالة الطلب: قيد المراجعة (Pending)</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={submittedData.photo}
                    alt={submittedData.fullName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 shadow-xs"
                  />
                  <div className="space-y-0.5">
                    <p className="font-bold text-on-surface">{submittedData.fullName}</p>
                    <p className="text-body-sm text-primary font-medium">{submittedData.subject}</p>
                    <p className="text-label-sm text-outline">
                      {submittedData.experienceYears} سنوات خبرة • {submittedData.monthlyPrice} ج.م / شهرياً
                    </p>
                  </div>
                </div>

                {submittedData.bio && (
                  <p className="text-body-xs font-body-sm text-on-surface-variant bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                    "{submittedData.bio}"
                  </p>
                )}

                <div className="text-[11px] text-outline flex items-center gap-1.5 pt-1">
                  <span className="material-symbols-outlined text-xs text-secondary">info</span>
                  <span>
                    ملاحظة هامة: حفاظاً على جودة المنصة، لا تظهر الحسابات ذات الحالة "Pending" في القائمة العامة حتى تتم مراجعتها واعتمادها (Approved).
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-space-md flex-wrap pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('teachers')}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow hover:bg-primary/90 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                <span>الانتقال لدليل المعلمين المعتمدين</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface font-semibold hover:bg-surface-container active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>تسجيل معلم آخر</span>
              </button>
            </div>
          </section>
        ) : (
          /* REGISTRATION FORM */
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg md:p-space-xl shadow-sm space-y-space-lg"
          >
            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-body-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-red-600 shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Full Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="teacher-fullname" className="block text-label-md font-bold text-on-surface">
                الاسم الكامل للمعلم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="teacher-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أ. محمود محمد الشافعي"
                  className="w-full h-12 pr-11 pl-4 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <span className="material-symbols-outlined absolute right-3.5 top-3 text-outline pointer-events-none text-xl">
                  badge
                </span>
              </div>
              <p className="text-[11px] text-outline">
                يرجى كتابة الاسم الثلاثي أو الرباعي مسبوقاً باللقب الأكاديمي (أ. / د.).
              </p>
            </div>

            {/* 2. Photo Upload Field (Drag & Drop + File Selector + Presets) */}
            <div className="space-y-2">
              <label className="block text-label-md font-bold text-on-surface">
                الصورة الشخصية للمعلم <span className="text-red-500">*</span>
              </label>

              {/* Dropzone container */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant bg-surface-container-low hover:border-primary/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <img
                      src={photoPreview}
                      alt="معاينة الصورة"
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
                    />
                    <div className="text-right space-y-1">
                      <p className="text-body-sm font-bold text-on-surface">تم اختيار الصورة بنجاح</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 rounded-lg bg-surface-container text-xs font-bold text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          تغيير الصورة
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPhoto('');
                            setPhotoPreview('');
                          }}
                          className="px-3 py-1 rounded-lg bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-body-sm font-bold text-on-surface">
                        اسحب وأفلت صورتك هنا، أو{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary underline underline-offset-4 hover:text-primary/80 font-bold cursor-pointer"
                        >
                          تصفح من جهازك
                        </button>
                      </p>
                      <p className="text-body-xs text-outline">يدعم PNG و JPG حتى 5 ميجابايت</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Or Select from Presets */}
              <div className="pt-1">
                <span className="text-[11px] text-outline font-semibold block mb-1.5">
                  أو اختر صورة رمزية سريعة:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {DEFAULT_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAvatar(avatar.url)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        photoPreview === avatar.url
                          ? 'border-primary ring-2 ring-primary/40 scale-105'
                          : 'border-outline-variant hover:border-primary/50 opacity-80 hover:opacity-100'
                      }`}
                      title={avatar.label}
                    >
                      <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Subject Dropdown (from existing subjects) */}
            <div className="space-y-1.5">
              <label htmlFor="teacher-subject" className="block text-label-md font-bold text-on-surface">
                المادة الدراسية <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="teacher-subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-12 pr-11 pl-8 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  {SUBJECT_CATALOG.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                  <option value="الفيزياء والكيمياء">الفيزياء والكيمياء (المرحلة الثانوية)</option>
                  <option value="الأحياء والجيولوجيا">الأحياء والجيولوجيا</option>
                  <option value="تأسيس القدرات والتحصيلي">تأسيس القدرات والتحصيلي</option>
                </select>
                <span className="material-symbols-outlined absolute right-3.5 top-3 text-outline pointer-events-none text-xl">
                  menu_book
                </span>
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
              <p className="text-[11px] text-outline">
                المواد المستخرجة من كتالوج مناهج منصة غايتي المعتمدة.
              </p>
            </div>

            {/* 4. Two Columns: Monthly Price & Years of Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Monthly Price */}
              <div className="space-y-1.5">
                <label htmlFor="teacher-monthly-price" className="block text-label-md font-bold text-on-surface">
                  السعر الشهري للطالب (ج.م) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="teacher-monthly-price"
                    type="number"
                    min="50"
                    max="5000"
                    step="10"
                    required
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    placeholder="350"
                    className="w-full h-12 pr-11 pl-12 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 top-3 text-outline pointer-events-none text-xl">
                    payments
                  </span>
                  <span className="absolute left-3.5 top-3.5 text-xs text-outline font-bold">
                    ج.م
                  </span>
                </div>
                <p className="text-[11px] text-outline">
                  المتوسط المعتاد لمعلمي المرحلة الإعدادية يتراوح بين 250 - 450 ج.م شهرياً.
                </p>
              </div>

              {/* Years of Experience */}
              <div className="space-y-1.5">
                <label htmlFor="teacher-experience" className="block text-label-md font-bold text-on-surface">
                  سنوات الخبرة الأكاديمية <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="teacher-experience"
                    type="number"
                    min="0"
                    max="50"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="5"
                    className="w-full h-12 pr-11 pl-16 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 top-3 text-outline pointer-events-none text-xl">
                    work_history
                  </span>
                  <span className="absolute left-3.5 top-3.5 text-xs text-outline font-bold">
                    سنوات
                  </span>
                </div>
                <p className="text-[11px] text-outline">
                  عدد سنوات التدريس بالمدارس الرسمية، اللغات، أو الدروس التفاعلية.
                </p>
              </div>
            </div>

            {/* 5. Short Bio / Qualifications */}
            <div className="space-y-1.5">
              <label htmlFor="teacher-bio" className="block text-label-md font-bold text-on-surface">
                نبذة تعريفية مختصرة (المؤهل وطريقة الشرح) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="teacher-bio"
                required
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="مثال: معلم أول لغة عربية وخبير بالشهادة الإعدادية. حاصل على ليسانس آداب وتربية جامعة عين شمس، أعتمد على الخرائط الذهنية وتبسيط القواعد النحوية وحل نماذج امتحانات المحافظات السابقة بأسلوب تفاعلي."
                className="w-full p-3.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
              <div className="flex items-center justify-between text-[11px] text-outline">
                <span>تظهر هذه النبذة في ملفك الشخصي بعد اعتماد الحساب.</span>
                <span>{bio.length} حرفاً</span>
              </div>
            </div>

            {/* Status Information Box */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-3.5 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">
                shield
              </span>
              <div className="text-body-xs text-on-surface-variant space-y-1">
                <p className="font-bold text-on-surface">حالة الطلب الأولية (Default Status):</p>
                <p>
                  يتم حفظ الطلب الجديد في جدول <code className="bg-surface-container px-1 py-0.5 rounded text-primary font-mono font-bold">teachers</code> بقيمة افتراضية{' '}
                  <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">status = "pending"</span>.
                  ولن يظهر حسابك للطلاب في قائمة المعلمين العامة إلا بعد مراجعته وتغيير الحالة إلى{' '}
                  <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">status = "approved"</span>.
                </p>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('teachers')}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جارٍ إرسال الطلب وحفظه...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">send</span>
                    <span>إرسال طلب التسجيل</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
