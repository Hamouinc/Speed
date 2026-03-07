"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Language = "en" | "es" | "ar";

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    graduationYear: string;
  }>;
  skills: string;
}

const defaultData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: "",
};

const translations = {
  en: {
    title: "CV Generator",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    location: "Location",
    summary: "Professional Summary",
    experience: "Experience",
    addExperience: "Add Experience",
    company: "Company",
    position: "Position",
    startDate: "Start Date",
    endDate: "End Date",
    description: "Description",
    education: "Education",
    addEducation: "Add Education",
    institution: "Institution",
    degree: "Degree",
    graduationYear: "Graduation Year",
    skills: "Skills (comma separated)",
    exportPDF: "Export to PDF",
    remove: "Remove",
    preview: "Live Preview",
  },
  es: {
    title: "Generador de CV",
    personalInfo: "Información Personal",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono",
    location: "Ubicación",
    summary: "Resumen Profesional",
    experience: "Experiencia",
    addExperience: "Añadir Experiencia",
    company: "Empresa",
    position: "Posición",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Fin",
    description: "Descripción",
    education: "Educación",
    addEducation: "Añadir Educación",
    institution: "Institución",
    degree: "Título",
    graduationYear: "Año de Graduación",
    skills: "Habilidades (separadas por comas)",
    exportPDF: "Exportar a PDF",
    remove: "Eliminar",
    preview: "Vista Previa",
  },
  ar: {
    title: "منشئ السيرة الذاتية",
    personalInfo: "المعلومات الشخصية",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    location: "الموقع",
    summary: "الملخص المهني",
    experience: "الخبرة",
    addExperience: "إضافة خبرة",
    company: "الشركة",
    position: "المنصب",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    description: "الوصف",
    education: "التعليم",
    addEducation: "إضافة تعليم",
    institution: "المؤسسة",
    degree: "الدرجة العلمية",
    graduationYear: "سنة التخرج",
    skills: "المهارات (مفصولة بفاصلة)",
    exportPDF: "تصدير إلى PDF",
    remove: "إزالة",
    preview: "معاينة مباشرة",
  },
};

export function CVGenerator() {
  const [lang, setLang] = useState<Language>("en");
  const [data, setData] = useState<CVData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const isRTL = lang === "ar";

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cv-data");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved CV data");
      }
    }
    const savedLang = localStorage.getItem("cv-lang") as Language;
    if (savedLang && ["en", "es", "ar"].includes(savedLang)) {
      setLang(savedLang);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cv-data", JSON.stringify(data));
      localStorage.setItem("cv-lang", lang);
    }
  }, [data, lang, isLoaded]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), company: "", position: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), institution: "", degree: "", graduationYear: "" },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const exportPDF = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 sm:p-6 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">{t.title}</h2>
        <div className="flex gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="ar">العربية</option>
          </select>
          <button
            onClick={exportPDF}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {t.exportPDF}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Form */}
        <div className="space-y-8 bg-neutral-800 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[80vh] custom-scrollbar">
          
          {/* Personal Info */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-neutral-700 pb-2">{t.personalInfo}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder={t.fullName}
                value={data.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
              />
              <input
                type="email"
                name="email"
                placeholder={t.email}
                value={data.personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
              />
              <input
                type="tel"
                name="phone"
                placeholder={t.phone}
                value={data.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
              />
              <input
                type="text"
                name="location"
                placeholder={t.location}
                value={data.personalInfo.location}
                onChange={handlePersonalInfoChange}
                className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
              />
              <textarea
                name="summary"
                placeholder={t.summary}
                value={data.personalInfo.summary}
                onChange={handlePersonalInfoChange}
                rows={3}
                className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full sm:col-span-2"
              />
            </div>
          </section>

          {/* Experience */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b border-neutral-700 pb-2">
              <h3 className="text-xl font-semibold text-white">{t.experience}</h3>
              <button onClick={addExperience} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                + {t.addExperience}
              </button>
            </div>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700 relative">
                  <button 
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    {t.remove}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <input
                      type="text"
                      placeholder={t.company}
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.position}
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.startDate}
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.endDate}
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <textarea
                      placeholder={t.description}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      rows={3}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full sm:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b border-neutral-700 pb-2">
              <h3 className="text-xl font-semibold text-white">{t.education}</h3>
              <button onClick={addEducation} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                + {t.addEducation}
              </button>
            </div>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700 relative">
                  <button 
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    {t.remove}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <input
                      type="text"
                      placeholder={t.institution}
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.degree}
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.graduationYear}
                      value={edu.graduationYear}
                      onChange={(e) => updateEducation(edu.id, "graduationYear", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full sm:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-neutral-700 pb-2">{t.skills}</h3>
            <textarea
              placeholder={t.skills}
              value={data.skills}
              onChange={(e) => setData({ ...data, skills: e.target.value })}
              rows={3}
              className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
            />
          </section>

        </div>

        {/* Live Preview */}
        <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[80vh] custom-scrollbar">
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-neutral-700 pb-2">{t.preview}</h3>
          
          {/* A4 Paper Container for Preview */}
          <div className="bg-white text-black p-8 shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm', transform: 'scale(0.8)', transformOrigin: 'top center' }}>
            <div ref={previewRef} className="bg-white p-8" style={{ width: '100%', minHeight: '100%' }}>
              
              {/* Header */}
              <div className="border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  {data.personalInfo.fullName || "YOUR NAME"}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                  {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                  {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
              </div>

              {/* Summary */}
              {data.personalInfo.summary && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
                </div>
              )}

              {/* Experience */}
              {data.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                    {t.experience}
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                          <span className="text-sm text-gray-600 font-medium">
                            {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                          </span>
                        </div>
                        <div className="text-md text-gray-700 font-medium mb-2">{exp.company}</div>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                    {t.education}
                  </h2>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                          <span className="text-sm text-gray-600 font-medium">{edu.graduationYear}</span>
                        </div>
                        <div className="text-md text-gray-700">{edu.institution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {data.skills && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                    {t.skills}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.split(',').map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
