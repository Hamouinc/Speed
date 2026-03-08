"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Language = "en" | "es" | "ar";
type Template = "modern" | "classic" | "minimal" | "creative";

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

const demoData: CVData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "New York, NY",
    summary: "Experienced professional with a passion for developing innovative solutions that expedite the efficiency and effectiveness of organizational success. Well-versed in modern technologies and best practices to create systems that are reliable and user-friendly.",
  },
  experience: [
    {
      id: "demo-exp-1",
      company: "Tech Solutions Inc.",
      position: "Senior Developer",
      startDate: "Jan 2020",
      endDate: "Present",
      description: "Lead a team of 5 developers to create a new web application.\nImproved system performance by 30%.\nImplemented CI/CD pipelines.",
    },
    {
      id: "demo-exp-2",
      company: "Web Dev Corp",
      position: "Frontend Developer",
      startDate: "Jun 2017",
      endDate: "Dec 2019",
      description: "Developed responsive user interfaces using React.\nCollaborated with designers to implement UI/UX best practices.",
    }
  ],
  education: [
    {
      id: "demo-edu-1",
      institution: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      graduationYear: "2017",
    }
  ],
  skills: "JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Agile",
};

const translations = {
  en: {
    title: "CV Generator",
    template: "Template",
    modern: "Modern",
    classic: "Classic",
    minimal: "Minimal",
    creative: "Creative",
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
    template: "Plantilla",
    modern: "Moderno",
    classic: "Clásico",
    minimal: "Minimalista",
    creative: "Creativo",
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
    template: "القالب",
    modern: "حديث",
    classic: "كلاسيكي",
    minimal: "بسيط",
    creative: "إبداعي",
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
  const [template, setTemplate] = useState<Template>("modern");
  const [data, setData] = useState<CVData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

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
    const savedTemplate = localStorage.getItem("cv-template") as Template;
    if (savedTemplate && ["modern", "classic", "minimal", "creative"].includes(savedTemplate)) {
      setTemplate(savedTemplate);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cv-data", JSON.stringify(data));
      localStorage.setItem("cv-lang", lang);
      localStorage.setItem("cv-template", template);
    }
  }, [data, lang, template, isLoaded]);

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
    if (!pdfRef.current) return;
    
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 794,
        height: 1123,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Fix LAB color issues by converting all elements to use hex colors
          const allElements = clonedDoc.querySelectorAll('*');
          const colorMap: Record<string, string> = {
            'rgb(0, 0, 0)': '#000000',
            'rgb(255, 255, 255)': '#ffffff',
          };
          
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            // Force background color to white if not set
            const bg = window.getComputedStyle(htmlEl).backgroundColor;
            if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
              htmlEl.style.backgroundColor = '#ffffff';
            }
            // Ensure text color is a valid hex
            const color = window.getComputedStyle(htmlEl).color;
            if (color && !color.startsWith('#')) {
              htmlEl.style.color = '#000000';
            }
          });
          
          // Also set explicit styles on the container
          const container = clonedDoc.body;
          container.style.backgroundColor = '#ffffff';
          container.style.color = '#000000';
        }
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

  const previewData = {
    personalInfo: {
      fullName: data.personalInfo.fullName || demoData.personalInfo.fullName,
      email: data.personalInfo.email || demoData.personalInfo.email,
      phone: data.personalInfo.phone || demoData.personalInfo.phone,
      location: data.personalInfo.location || demoData.personalInfo.location,
      summary: data.personalInfo.summary || demoData.personalInfo.summary,
    },
    experience: data.experience.length > 0 ? data.experience : demoData.experience,
    education: data.education.length > 0 ? data.education : demoData.education,
    skills: data.skills || demoData.skills,
  };

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 sm:p-6 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">{t.title}</h2>
        <div className="flex gap-2">
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as Template)}
            className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="modern">{t.modern}</option>
            <option value="classic">{t.classic}</option>
            <option value="minimal">{t.minimal}</option>
            <option value="creative">{t.creative}</option>
          </select>
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
        <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[80vh] custom-scrollbar flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-neutral-700 pb-2 shrink-0">{t.preview}</h3>
          
          {/* Responsive Preview Container */}
          <div ref={previewRef} className="w-full bg-white rounded-lg border border-neutral-700 text-black">
                {template === "modern" && (
                  <div className="p-10 font-sans min-h-[1123px]">
                    <div className="border-b-2 border-gray-800 pb-4 mb-6">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
                        {previewData.personalInfo.fullName}
                      </h1>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                        {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                        {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                      </div>
                    </div>

                    {previewData.personalInfo.summary && (
                      <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed">{previewData.personalInfo.summary}</p>
                      </div>
                    )}

                    {previewData.experience.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.experience}
                        </h2>
                        <div className="space-y-4">
                          {previewData.experience.map((exp) => (
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

                    {previewData.education.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.education}
                        </h2>
                        <div className="space-y-4">
                          {previewData.education.map((edu) => (
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

                    {previewData.skills && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.skills}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {previewData.skills.split(',').map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {template === "classic" && (
                  <div className="p-12 font-serif min-h-[1123px]">
                    <div className="text-center mb-8">
                      <h1 className="text-4xl font-bold text-black mb-2">{previewData.personalInfo.fullName}</h1>
                      <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-800">
                        {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                        {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                        {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                      </div>
                    </div>
                    
                    {previewData.personalInfo.summary && (
                      <div className="mb-6">
                        <p className="text-gray-800 leading-relaxed text-justify">{previewData.personalInfo.summary}</p>
                      </div>
                    )}

                    {previewData.experience.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.experience}
                        </h2>
                        <div className="space-y-5">
                          {previewData.experience.map((exp) => (
                            <div key={exp.id}>
                              <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-lg font-bold text-black">{exp.position}</h3>
                                <span className="text-sm text-gray-800 italic">
                                  {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                                </span>
                              </div>
                              <div className="text-md text-gray-800 italic mb-2">{exp.company}</div>
                              <p className="text-sm text-gray-800 whitespace-pre-line">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.education.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.education}
                        </h2>
                        <div className="space-y-4">
                          {previewData.education.map((edu) => (
                            <div key={edu.id}>
                              <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-lg font-bold text-black">{edu.degree}</h3>
                                <span className="text-sm text-gray-800 italic">{edu.graduationYear}</span>
                              </div>
                              <div className="text-md text-gray-800">{edu.institution}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.skills && (
                      <div>
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.skills}
                        </h2>
                        <p className="text-gray-800 leading-relaxed text-center">
                          {previewData.skills.split(',').map(s => s.trim()).join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {template === "minimal" && (
                  <div className="p-12 font-sans text-gray-800 min-h-[1123px]">
                    <div className="mb-10">
                      <h1 className="text-5xl font-light text-black mb-4">{previewData.personalInfo.fullName}</h1>
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                        {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                        {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                      </div>
                    </div>
                    
                    {previewData.personalInfo.summary && (
                      <div className="mb-10">
                        <p className="text-gray-600 leading-relaxed text-lg font-light">{previewData.personalInfo.summary}</p>
                      </div>
                    )}

                    {previewData.experience.length > 0 && (
                      <div className="mb-10">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{t.experience}</h2>
                        <div className="space-y-8">
                          {previewData.experience.map((exp) => (
                            <div key={exp.id} className="grid grid-cols-4 gap-4">
                              <div className="col-span-1 text-sm text-gray-500">
                                {exp.startDate} <br/> {exp.endDate}
                              </div>
                              <div className="col-span-3">
                                <h3 className="text-lg font-medium text-black">{exp.position}</h3>
                                <div className="text-md text-gray-600 mb-2">{exp.company}</div>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.education.length > 0 && (
                      <div className="mb-10">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{t.education}</h2>
                        <div className="space-y-6">
                          {previewData.education.map((edu) => (
                            <div key={edu.id} className="grid grid-cols-4 gap-4">
                              <div className="col-span-1 text-sm text-gray-500">
                                {edu.graduationYear}
                              </div>
                              <div className="col-span-3">
                                <h3 className="text-lg font-medium text-black">{edu.degree}</h3>
                                <div className="text-md text-gray-600">{edu.institution}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.skills && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.skills}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {previewData.skills.split(',').map((skill, index) => (
                            <span key={index} className="text-gray-700">{skill.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {template === "creative" && (
                  <div className="flex min-h-[1123px] font-sans">
                    {/* Sidebar */}
                    <div className="w-1/3 bg-blue-900 text-white p-8">
                      <h1 className="text-3xl font-bold mb-6 leading-tight">{previewData.personalInfo.fullName}</h1>
                      
                      <div className="space-y-4 text-sm text-blue-100 mb-10">
                        {previewData.personalInfo.email && <div className="break-all">{previewData.personalInfo.email}</div>}
                        {previewData.personalInfo.phone && <div>{previewData.personalInfo.phone}</div>}
                        {previewData.personalInfo.location && <div>{previewData.personalInfo.location}</div>}
                      </div>

                      {previewData.skills && (
                        <div>
                          <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-4 uppercase tracking-wider">{t.skills}</h2>
                          <div className="flex flex-col gap-2">
                            {previewData.skills.split(',').map((skill, index) => (
                              <span key={index} className="text-sm">{skill.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Main Content */}
                    <div className="w-2/3 bg-white p-8 text-gray-800">
                      {previewData.personalInfo.summary && (
                        <div className="mb-8">
                          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.summary}</h2>
                          <p className="text-sm leading-relaxed">{previewData.personalInfo.summary}</p>
                        </div>
                      )}

                      {previewData.experience.length > 0 && (
                        <div className="mb-8">
                          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.experience}</h2>
                          <div className="space-y-6">
                            {previewData.experience.map((exp) => (
                              <div key={exp.id}>
                                <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-md text-blue-600 font-medium">{exp.company}</span>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {previewData.education.length > 0 && (
                        <div className="mb-8">
                          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.education}</h2>
                          <div className="space-y-4">
                            {previewData.education.map((edu) => (
                              <div key={edu.id}>
                                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                                <div className="flex justify-between items-center">
                                  <span className="text-md text-gray-700">{edu.institution}</span>
                                  <span className="text-sm text-gray-500">{edu.graduationYear}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        {/* Hidden PDF Export Container - Always A4 size */}
        <div ref={pdfRef} className="fixed left-[-9999px] top-0" style={{ width: '794px', minHeight: '1123px' }}>
        {template === "modern" && (
          <div className="p-10 font-sans bg-white" style={{ width: '794px', minHeight: '1123px' }}>
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
                {previewData.personalInfo.fullName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
              </div>
            </div>

            {previewData.personalInfo.summary && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{previewData.personalInfo.summary}</p>
              </div>
            )}

            {previewData.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                  {t.experience}
                </h2>
                <div className="space-y-4">
                  {previewData.experience.map((exp) => (
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

            {previewData.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                  {t.education}
                </h2>
                <div className="space-y-4">
                  {previewData.education.map((edu) => (
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

            {previewData.skills && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                  {t.skills}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {previewData.skills.split(',').map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {template === "classic" && (
          <div className="p-12 font-serif bg-white" style={{ width: '794px', minHeight: '1123px' }}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black mb-2">{previewData.personalInfo.fullName}</h1>
              <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-800">
                {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
              </div>
            </div>
            
            {previewData.personalInfo.summary && (
              <div className="mb-6">
                <p className="text-gray-800 leading-relaxed text-justify">{previewData.personalInfo.summary}</p>
              </div>
            )}

            {previewData.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                  {t.experience}
                </h2>
                <div className="space-y-5">
                  {previewData.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-black">{exp.position}</h3>
                        <span className="text-sm text-gray-800 italic">
                          {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                        </span>
                      </div>
                      <div className="text-md text-gray-800 italic mb-2">{exp.company}</div>
                      <p className="text-sm text-gray-800 whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewData.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                  {t.education}
                </h2>
                <div className="space-y-4">
                  {previewData.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-black">{edu.degree}</h3>
                        <span className="text-sm text-gray-800 italic">{edu.graduationYear}</span>
                      </div>
                      <div className="text-md text-gray-800">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewData.skills && (
              <div>
                <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                  {t.skills}
                </h2>
                <p className="text-gray-800 leading-relaxed text-center">
                  {previewData.skills.split(',').map(s => s.trim()).join(' • ')}
                </p>
              </div>
            )}
          </div>
        )}

        {template === "minimal" && (
          <div className="p-12 font-sans text-gray-800 bg-white" style={{ width: '794px', minHeight: '1123px' }}>
            <div className="mb-10">
              <h1 className="text-5xl font-light text-black mb-4">{previewData.personalInfo.fullName}</h1>
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
              </div>
            </div>
            
            {previewData.personalInfo.summary && (
              <div className="mb-10">
                <p className="text-gray-600 leading-relaxed text-lg font-light">{previewData.personalInfo.summary}</p>
              </div>
            )}

            {previewData.experience.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{t.experience}</h2>
                <div className="space-y-8">
                  {previewData.experience.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 text-sm text-gray-500">
                        {exp.startDate} <br/> {exp.endDate}
                      </div>
                      <div className="col-span-3">
                        <h3 className="text-lg font-medium text-black">{exp.position}</h3>
                        <div className="text-md text-gray-600 mb-2">{exp.company}</div>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewData.education.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{t.education}</h2>
                <div className="space-y-6">
                  {previewData.education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 text-sm text-gray-500">
                        {edu.graduationYear}
                      </div>
                      <div className="col-span-3">
                        <h3 className="text-lg font-medium text-black">{edu.degree}</h3>
                        <div className="text-md text-gray-600">{edu.institution}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewData.skills && (
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.skills}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {previewData.skills.split(',').map((skill, index) => (
                    <span key={index} className="text-gray-700">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {template === "creative" && (
          <div className="flex min-h-[1123px] font-sans bg-white" style={{ width: '794px' }}>
            <div className="w-1/3 bg-blue-900 text-white p-8">
              <h1 className="text-3xl font-bold mb-6 leading-tight">{previewData.personalInfo.fullName}</h1>
              
              <div className="space-y-4 text-sm text-blue-100 mb-10">
                {previewData.personalInfo.email && <div className="break-all">{previewData.personalInfo.email}</div>}
                {previewData.personalInfo.phone && <div>{previewData.personalInfo.phone}</div>}
                {previewData.personalInfo.location && <div>{previewData.personalInfo.location}</div>}
              </div>

              {previewData.skills && (
                <div>
                  <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-4 uppercase tracking-wider">{t.skills}</h2>
                  <div className="flex flex-col gap-2">
                    {previewData.skills.split(',').map((skill, index) => (
                      <span key={index} className="text-sm">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-2/3 bg-white p-8 text-gray-800">
              {previewData.personalInfo.summary && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.summary}</h2>
                  <p className="text-sm leading-relaxed">{previewData.personalInfo.summary}</p>
                </div>
              )}

              {previewData.experience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.experience}</h2>
                  <div className="space-y-6">
                    {previewData.experience.map((exp) => (
                      <div key={exp.id}>
                        <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-md text-blue-600 font-medium">{exp.company}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.education}</h2>
                  <div className="space-y-4">
                    {previewData.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-md text-gray-700">{edu.institution}</span>
                          <span className="text-sm text-gray-500">{edu.graduationYear}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
