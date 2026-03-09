"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import * as domtoimage from "dom-to-image-more";

type Language = "en" | "es" | "ar";
type Template = "modern" | "classic" | "minimal" | "creative";
type ProficiencyLevel = "Native" | "Fluent" | "Advanced" | "Intermediate" | "Beginner";

interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    graduationYear: string;
    gpa: string;
  }>;
  skills: {
    technical: string;
    soft: string;
    additional: string;
  };
  spokenLanguages: Array<{
    id: string;
    language: string;
    proficiency: ProficiencyLevel;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expires: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    keySkills: string;
    link: string;
  }>;
  awards: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
}

const defaultData: CVData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: "",
    soft: "",
    additional: "",
  },
  spokenLanguages: [],
  certifications: [],
  projects: [],
  awards: [],
};

const demoData: CVData = {
  personalInfo: {
    fullName: "Sarah Johnson",
    jobTitle: "Marketing Director",
    email: "sarah.johnson@example.com",
    phone: "+1 234 567 890",
    location: "New York, NY",
    linkedin: "linkedin.com/in/sarahjohnson",
    website: "sarahjohnson.com",
    summary: "Results-driven marketing professional with 8+ years of experience developing and executing comprehensive marketing strategies. Proven track record of increasing brand awareness, driving customer engagement, and delivering measurable ROI. Skilled in team leadership, budget management, and cross-functional collaboration.",
  },
  experience: [
    {
      id: "demo-exp-1",
      company: "Global Brands Inc.",
      position: "Marketing Director",
      location: "New York, NY",
      startDate: "Jan 2020",
      endDate: "Present",
      description: "• Lead a team of 12 marketing professionals across digital, content, and brand teams\n• Increased brand awareness by 45% through integrated marketing campaigns\n• Managed $2M annual budget, consistently delivering 15% under budget\n• Launched successful product campaigns generating $5M in new revenue",
    },
    {
      id: "demo-exp-2",
      company: "Creative Agency Partners",
      position: "Senior Marketing Manager",
      location: "Chicago, IL",
      startDate: "Jun 2017",
      endDate: "Dec 2019",
      description: "• Developed marketing strategies for 15+ clients across various industries\n• Increased client ROI by average of 35% through data-driven campaign optimization\n• Managed cross-functional teams of designers, copywriters, and analysts\n• Presented quarterly performance reports to C-level executives",
    }
  ],
  education: [
    {
      id: "demo-edu-1",
      institution: "University of Marketing & Business",
      degree: "Master of Business Administration",
      fieldOfStudy: "Marketing",
      location: "Boston, MA",
      graduationYear: "2017",
      gpa: "3.9/4.0",
    },
    {
      id: "demo-edu-2",
      institution: "State University",
      degree: "Bachelor of Arts",
      fieldOfStudy: "Communications",
      location: "Los Angeles, CA",
      graduationYear: "2015",
      gpa: "3.7/4.0",
    }
  ],
  skills: {
    technical: "Google Analytics, SEO/SEM, CRM Systems, Adobe Creative Suite, Social Media Management, Marketing Automation",
    soft: "Leadership, Strategic Planning, Communication, Budget Management, Team Building, Public Speaking",
    additional: "Project Management, Event Planning, Market Research, Data Analysis, Content Strategy",
  },
  spokenLanguages: [
    { id: "demo-lang-1", language: "English", proficiency: "Native" },
    { id: "demo-lang-2", language: "Spanish", proficiency: "Fluent" },
    { id: "demo-lang-3", language: "French", proficiency: "Intermediate" },
  ],
  certifications: [
    {
      id: "demo-cert-1",
      name: "Digital Marketing Professional",
      issuer: "Digital Marketing Institute",
      date: "2022",
      expires: "",
    },
    {
      id: "demo-cert-2",
      name: "Google Analytics Certified",
      issuer: "Google",
      date: "2021",
      expires: "",
    },
    {
      id: "demo-cert-3",
      name: "Project Management Professional (PMP)",
      issuer: "PMI",
      date: "2020",
      expires: "",
    }
  ],
  projects: [
    {
      id: "demo-proj-1",
      name: "Global Product Launch Campaign",
      description: "Led the successful launch of a new product line across 12 international markets, resulting in $3M first-year sales",
      keySkills: "Market Research, Brand Strategy, Digital Campaigns",
      link: "",
    },
    {
      id: "demo-proj-2",
      name: "Customer Loyalty Program",
      description: "Designed and implemented a comprehensive loyalty program that increased customer retention by 28%",
      keySkills: "CRM Integration, Email Marketing, Customer Analytics",
      link: "",
    }
  ],
  awards: [
    {
      id: "demo-award-1",
      title: "Marketing Excellence Award",
      issuer: "Global Brands Inc.",
      date: "2023",
      description: "Recognized for outstanding campaign performance and innovative marketing strategies",
    },
    {
      id: "demo-award-2",
      title: "Top 40 Under 40 Marketing Professionals",
      issuer: "Marketing Today Magazine",
      date: "2022",
      description: "Selected among top marketing professionals for exceptional leadership and results",
    }
  ],
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
    jobTitle: "Job Title / Headline",
    email: "Email",
    phone: "Phone",
    location: "Location",
    linkedin: "LinkedIn URL",
    website: "Portfolio / Website",
    summary: "Professional Summary",
    experience: "Work Experience",
    addExperience: "Add Experience",
    company: "Company",
    position: "Position",
    expLocation: "Location (City, State)",
    startDate: "Start Date",
    endDate: "End Date",
    current: "Current",
    description: "Description (use • for bullet points)",
    education: "Education",
    addEducation: "Add Education",
    institution: "Institution",
    degree: "Degree",
    fieldOfStudy: "Field of Study",
    eduLocation: "Location",
    graduationYear: "Graduation Year",
    gpa: "GPA (optional)",
    skills: "Skills",
    technicalSkills: "Technical Skills",
    softSkills: "Soft Skills",
    additionalSkills: "Programming Languages",
    spokenLanguages: "Languages",
    addLanguage: "Add Language",
    language: "Language",
    proficiency: "Proficiency",
    certifications: "Certifications",
    addCertification: "Add Certification",
    certName: "Certification Name",
    issuer: "Issuing Organization",
    date: "Date",
    expires: "Expires (optional)",
    projects: "Projects",
    addProject: "Add Project",
    projectName: "Project Name",
    projectDesc: "Description",
    keySkills: "Key Skills / Methods",
    projectLink: "Project Link",
    awards: "Awards & Honors",
    addAward: "Add Award",
    awardTitle: "Title",
    awardIssuer: "Issuer",
    awardDate: "Date",
    awardDesc: "Description",
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
    jobTitle: "Título Profesional",
    email: "Correo Electrónico",
    phone: "Teléfono",
    location: "Ubicación",
    linkedin: "LinkedIn",
    website: "Portafolio / Sitio Web",
    summary: "Resumen Profesional",
    experience: "Experiencia Laboral",
    addExperience: "Añadir Experiencia",
    company: "Empresa",
    position: "Posición",
    expLocation: "Ubicación (Ciudad, Estado)",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Fin",
    current: "Actual",
    description: "Descripción (usa • para viñetas)",
    education: "Educación",
    addEducation: "Añadir Educación",
    institution: "Institución",
    degree: "Título",
    fieldOfStudy: "Campo de Estudio",
    eduLocation: "Ubicación",
    graduationYear: "Año de Graduación",
    gpa: "Promedio (opcional)",
    skills: "Habilidades",
    technicalSkills: "Habilidades Técnicas",
    softSkills: "Habilidades Blandas",
    additionalSkills: "Lenguajes de Programación",
    spokenLanguages: "Idiomas",
    addLanguage: "Añadir Idioma",
    language: "Idioma",
    proficiency: "Nivel",
    certifications: "Certificaciones",
    addCertification: "Añadir Certificación",
    certName: "Nombre de Certificación",
    issuer: "Organización Emisora",
    date: "Fecha",
    expires: "Expira (opcional)",
    projects: "Proyectos",
    addProject: "Añadir Proyecto",
    projectName: "Nombre del Proyecto",
    projectDesc: "Descripción",
    keySkills: "Habilidades / Métodos Clave",
    projectLink: "Enlace del Proyecto",
    awards: "Premios y Reconocimientos",
    addAward: "Añadir Premio",
    awardTitle: "Título",
    awardIssuer: "Emisor",
    awardDate: "Fecha",
    awardDesc: "Descripción",
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
    jobTitle: "المسمى الوظيفي",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    location: "الموقع",
    linkedin: "LinkedIn",
    website: "الموقع الشخصي",
    summary: "الملخص المهني",
    experience: "الخبرة العملية",
    addExperience: "إضافة خبرة",
    company: "الشركة",
    position: "المنصب",
    expLocation: "الموقع (المدينة، الولاية)",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    current: "حالياً",
    description: "الوصف (استخدم • للنقاط)",
    education: "التعليم",
    addEducation: "إضافة تعليم",
    institution: "المؤسسة",
    degree: "الدرجة العلمية",
    fieldOfStudy: "مجال الدراسة",
    eduLocation: "الموقع",
    graduationYear: "سنة التخرج",
    gpa: "المعدل (اختياري)",
    skills: "المهارات",
    technicalSkills: "المهارات التقنية",
    softSkills: "المهارات الشخصية",
    additionalSkills: "لغات البرمجة",
    spokenLanguages: "اللغات",
    addLanguage: "إضافة لغة",
    language: "اللغة",
    proficiency: "المستوى",
    certifications: "الشهادات",
    addCertification: "إضافة شهادة",
    certName: "اسم الشهادة",
    issuer: "الجهة المصدرة",
    date: "التاريخ",
    expires: "تاريخ الانتهاء (اختياري)",
    projects: "المشاريع",
    addProject: "إضافة مشروع",
    projectName: "اسم المشروع",
    projectDesc: "الوصف",
    keySkills: "المهارات / الأساليب الرئيسية",
    projectLink: "رابط المشروع",
    awards: "الجوائز والتقديرات",
    addAward: "إضافة جائزة",
    awardTitle: "العنوان",
    awardIssuer: "الجهة المانحة",
    awardDate: "التاريخ",
    awardDesc: "الوصف",
    exportPDF: "تصدير إلى PDF",
    remove: "إزالة",
    preview: "معاينة مباشرة",
  },
};

const proficiencyLevels: ProficiencyLevel[] = ["Native", "Fluent", "Advanced", "Intermediate", "Beginner"];

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
        { id: Date.now().toString(), company: "", position: "", location: "", startDate: "", endDate: "", description: "" },
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
        { id: Date.now().toString(), institution: "", degree: "", fieldOfStudy: "", location: "", graduationYear: "", gpa: "" },
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

  const addLanguage = () => {
    setData((prev) => ({
      ...prev,
      spokenLanguages: [
        ...prev.spokenLanguages,
        { id: Date.now().toString(), language: "", proficiency: "Fluent" },
      ],
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      spokenLanguages: prev.spokenLanguages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
    }));
  };

  const removeLanguage = (id: string) => {
    setData((prev) => ({
      ...prev,
      spokenLanguages: prev.spokenLanguages.filter((lang) => lang.id !== id),
    }));
  };

  const addCertification = () => {
    setData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now().toString(), name: "", issuer: "", date: "", expires: "" },
      ],
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    }));
  };

  const removeCertification = (id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now().toString(), name: "", description: "", keySkills: "", link: "" },
      ],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const addAward = () => {
    setData((prev) => ({
      ...prev,
      awards: [
        ...prev.awards,
        { id: Date.now().toString(), title: "", issuer: "", date: "", description: "" },
      ],
    }));
  };

  const updateAward = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      awards: prev.awards.map((award) => (award.id === id ? { ...award, [field]: value } : award)),
    }));
  };

  const removeAward = (id: string) => {
    setData((prev) => ({
      ...prev,
      awards: prev.awards.filter((award) => award.id !== id),
    }));
  };

  const exportPDF = async () => {
    if (!pdfRef.current) return;
    
    try {
      const dataUrl = await domtoimage.toPng(pdfRef.current, {
        quality: 1,
        scale: 2,
        bgcolor: '#ffffff',
        filter: (node: Node) => {
          const element = node as HTMLElement;
          if (element.style) {
            element.style.textShadow = 'none';
            element.style.boxShadow = 'none';
            element.style.outline = 'none';
            element.style.borderWidth = '0';
            element.style.borderStyle = 'none';
          }
          return true;
        },
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
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
      jobTitle: data.personalInfo.jobTitle || demoData.personalInfo.jobTitle,
      email: data.personalInfo.email || demoData.personalInfo.email,
      phone: data.personalInfo.phone || demoData.personalInfo.phone,
      location: data.personalInfo.location || demoData.personalInfo.location,
      linkedin: data.personalInfo.linkedin || demoData.personalInfo.linkedin,
      website: data.personalInfo.website || demoData.personalInfo.website,
      summary: data.personalInfo.summary || demoData.personalInfo.summary,
    },
    experience: data.experience.length > 0 ? data.experience : demoData.experience,
    education: data.education.length > 0 ? data.education : demoData.education,
    skills: {
      technical: data.skills.technical || demoData.skills.technical,
      soft: data.skills.soft || demoData.skills.soft,
      additional: data.skills.additional || demoData.skills.additional,
    },
    spokenLanguages: data.spokenLanguages && data.spokenLanguages.length > 0 ? data.spokenLanguages : demoData.spokenLanguages,
    certifications: data.certifications && data.certifications.length > 0 ? data.certifications : demoData.certifications,
    projects: data.projects && data.projects.length > 0 ? data.projects : demoData.projects,
    awards: data.awards && data.awards.length > 0 ? data.awards : demoData.awards,
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
                type="text"
                name="jobTitle"
                placeholder={t.jobTitle}
                value={data.personalInfo.jobTitle}
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
              <input
                type="text"
                name="linkedin"
                placeholder={t.linkedin}
                value={data.personalInfo.linkedin}
                onChange={handlePersonalInfoChange}
                className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
              />
              <input
                type="text"
                name="website"
                placeholder={t.website}
                value={data.personalInfo.website}
                onChange={handlePersonalInfoChange}
                className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full sm:col-span-2"
              />
              <textarea
                name="summary"
                placeholder={t.summary}
                value={data.personalInfo.summary}
                onChange={handlePersonalInfoChange}
                rows={4}
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
                      placeholder={t.expLocation}
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
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
                      rows={4}
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
                      placeholder={t.fieldOfStudy}
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.eduLocation}
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.graduationYear}
                      value={edu.graduationYear}
                      onChange={(e) => updateEducation(edu.id, "graduationYear", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.gpa}
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-neutral-700 pb-2">{t.skills}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.technicalSkills}</label>
                <textarea
                  placeholder={t.technicalSkills}
                  value={data.skills.technical}
                  onChange={(e) => setData({ ...data, skills: { ...data.skills, technical: e.target.value } })}
                  rows={2}
                  className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.softSkills}</label>
                <textarea
                  placeholder={t.softSkills}
                  value={data.skills.soft}
                  onChange={(e) => setData({ ...data, skills: { ...data.skills, soft: e.target.value } })}
                  rows={2}
                  className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.additionalSkills}</label>
                <textarea
                  placeholder={t.additionalSkills}
                  value={data.skills.additional}
                  onChange={(e) => setData({ ...data, skills: { ...data.skills, additional: e.target.value } })}
                  rows={2}
                  className="bg-neutral-900 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
            </div>
          </section>

          {/* Spoken Languages */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b border-neutral-700 pb-2">
              <h3 className="text-xl font-semibold text-white">{t.spokenLanguages}</h3>
              <button onClick={addLanguage} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                + {t.addLanguage}
              </button>
            </div>
            <div className="space-y-4">
              {data.spokenLanguages.map((lang) => (
                <div key={lang.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700 relative">
                  <button 
                    onClick={() => removeLanguage(lang.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    {t.remove}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <input
                      type="text"
                      placeholder={t.language}
                      value={lang.language}
                      onChange={(e) => updateLanguage(lang.id, "language", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    >
                      {proficiencyLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b border-neutral-700 pb-2">
              <h3 className="text-xl font-semibold text-white">{t.certifications}</h3>
              <button onClick={addCertification} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                + {t.addCertification}
              </button>
            </div>
            <div className="space-y-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700 relative">
                  <button 
                    onClick={() => removeCertification(cert.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    {t.remove}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <input
                      type="text"
                      placeholder={t.certName}
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.issuer}
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.date}
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.expires}
                      value={cert.expires}
                      onChange={(e) => updateCertification(cert.id, "expires", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b border-neutral-700 pb-2">
              <h3 className="text-xl font-semibold text-white">{t.projects}</h3>
              <button onClick={addProject} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                + {t.addProject}
              </button>
            </div>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700 relative">
                  <button 
                    onClick={() => removeProject(proj.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    {t.remove}
                  </button>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <input
                      type="text"
                      placeholder={t.projectName}
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.keySkills}
                      value={proj.keySkills}
                      onChange={(e) => updateProject(proj.id, "keySkills", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.projectLink}
                      value={proj.link}
                      onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <textarea
                      placeholder={t.projectDesc}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                      rows={3}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Awards */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b border-neutral-700 pb-2">
              <h3 className="text-xl font-semibold text-white">{t.awards}</h3>
              <button onClick={addAward} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                + {t.addAward}
              </button>
            </div>
            <div className="space-y-4">
              {data.awards.map((award) => (
                <div key={award.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700 relative">
                  <button 
                    onClick={() => removeAward(award.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    {t.remove}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <input
                      type="text"
                      placeholder={t.awardTitle}
                      value={award.title}
                      onChange={(e) => updateAward(award.id, "title", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.awardIssuer}
                      value={award.issuer}
                      onChange={(e) => updateAward(award.id, "issuer", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder={t.awardDate}
                      value={award.date}
                      onChange={(e) => updateAward(award.id, "date", e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <textarea
                      placeholder={t.awardDesc}
                      value={award.description}
                      onChange={(e) => updateAward(award.id, "description", e.target.value)}
                      rows={2}
                      className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full sm:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
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
                      {previewData.personalInfo.jobTitle && (
                        <p className="text-xl text-blue-700 font-medium mb-3">{previewData.personalInfo.jobTitle}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                        {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                        {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                        {previewData.personalInfo.linkedin && <span>{previewData.personalInfo.linkedin}</span>}
                        {previewData.personalInfo.website && <span>{previewData.personalInfo.website}</span>}
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
                              <div className="text-md text-gray-700 font-medium mb-2">
                                {exp.company}{exp.location && `, ${exp.location}`}
                              </div>
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
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                                </h3>
                                <span className="text-sm text-gray-600 font-medium">{edu.graduationYear}</span>
                              </div>
                              <div className="text-md text-gray-700">
                                {edu.institution}{edu.location && `, ${edu.location}`}
                                {edu.gpa && <span className="text-gray-500 ml-2">({edu.gpa})</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.skills}
                        </h2>
                        {previewData.skills.technical && (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-800">{t.technicalSkills}: </span>
                            <span className="text-gray-700">{previewData.skills.technical}</span>
                          </div>
                        )}
                        {previewData.skills.soft && (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-800">{t.softSkills}: </span>
                            <span className="text-gray-700">{previewData.skills.soft}</span>
                          </div>
                        )}
                        {previewData.skills.additional && (
                          <div>
                            <span className="font-semibold text-gray-800">{t.additionalSkills}: </span>
                            <span className="text-gray-700">{previewData.skills.additional}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {previewData.spokenLanguages.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.spokenLanguages}
                        </h2>
                        <div className="flex flex-wrap gap-4">
                          {previewData.spokenLanguages.map((lang) => (
                            <span key={lang.id} className="text-gray-700">
                              {lang.language} <span className="text-gray-500">({lang.proficiency})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.certifications}
                        </h2>
                        <div className="space-y-2">
                          {previewData.certifications.map((cert) => (
                            <div key={cert.id} className="text-gray-700">
                              <span className="font-medium">{cert.name}</span>
                              <span className="text-gray-500"> — {cert.issuer}</span>
                              <span className="text-gray-500 text-sm"> ({cert.date}{cert.expires && ` - ${t.expires}: ${cert.expires}`})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.projects.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.projects}
                        </h2>
                        <div className="space-y-4">
                          {previewData.projects.map((proj) => (
                            <div key={proj.id}>
                              <div className="flex items-baseline gap-2">
                                <h3 className="text-lg font-semibold text-gray-800">{proj.name}</h3>
                                {proj.link && <span className="text-sm text-blue-600">{proj.link}</span>}
                              </div>
                              {proj.keySkills && (
                                <p className="text-sm text-gray-600 italic mb-1">{proj.keySkills}</p>
                              )}
                              <p className="text-sm text-gray-700">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.awards.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide">
                          {t.awards}
                        </h2>
                        <div className="space-y-3">
                          {previewData.awards.map((award) => (
                            <div key={award.id}>
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-gray-800">{award.title}</span>
                                <span className="text-sm text-gray-500">{award.date}</span>
                              </div>
                              <div className="text-gray-600 text-sm">{award.issuer}</div>
                              {award.description && <p className="text-sm text-gray-600">{award.description}</p>}
                            </div>
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
                      {previewData.personalInfo.jobTitle && (
                        <p className="text-lg text-gray-700 italic mb-3">{previewData.personalInfo.jobTitle}</p>
                      )}
                      <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-800">
                        {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                        {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                        {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                        {previewData.personalInfo.linkedin && <span>{previewData.personalInfo.linkedin}</span>}
                        {previewData.personalInfo.website && <span>{previewData.personalInfo.website}</span>}
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
                              <div className="text-md text-gray-800 italic mb-2">
                                {exp.company}{exp.location && `, ${exp.location}`}
                              </div>
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
                                <h3 className="text-lg font-bold text-black">
                                  {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                                </h3>
                                <span className="text-sm text-gray-800 italic">{edu.graduationYear}</span>
                              </div>
                              <div className="text-md text-gray-800">
                                {edu.institution}{edu.location && `, ${edu.location}`}
                                {edu.gpa && <span className="italic ml-2">({edu.gpa})</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.skills}
                        </h2>
                        {previewData.skills.technical && (
                          <p className="text-gray-800 mb-2 text-center">
                            <span className="font-bold">{t.technicalSkills}: </span>{previewData.skills.technical}
                          </p>
                        )}
                        {previewData.skills.soft && (
                          <p className="text-gray-800 mb-2 text-center">
                            <span className="font-bold">{t.softSkills}: </span>{previewData.skills.soft}
                          </p>
                        )}
                        {previewData.skills.additional && (
                          <p className="text-gray-800 text-center">
                            <span className="font-bold">{t.additionalSkills}: </span>{previewData.skills.additional}
                          </p>
                        )}
                      </div>
                    )}

                    {previewData.spokenLanguages.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.spokenLanguages}
                        </h2>
                        <p className="text-gray-800 text-center">
                          {previewData.spokenLanguages.map(l => `${l.language} (${l.proficiency})`).join(" • ")}
                        </p>
                      </div>
                    )}

                    {previewData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.certifications}
                        </h2>
                        <div className="space-y-2">
                          {previewData.certifications.map((cert) => (
                            <div key={cert.id} className="text-gray-800 text-center">
                              <span className="font-bold">{cert.name}</span>
                              <span> — {cert.issuer}, {cert.date}</span>
                              {cert.expires && <span className="italic"> ({t.expires}: {cert.expires})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.projects.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.projects}
                        </h2>
                        <div className="space-y-4">
                          {previewData.projects.map((proj) => (
                            <div key={proj.id}>
                              <h3 className="text-lg font-bold text-black text-center">{proj.name}</h3>
                              {proj.keySkills && (
                                <p className="text-sm text-gray-700 italic text-center">{proj.keySkills}</p>
                              )}
                              <p className="text-sm text-gray-800 text-center">{proj.description}</p>
                              {proj.link && <p className="text-sm text-center text-blue-700">{proj.link}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.awards.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-black border-b border-black pb-1 mb-4 text-center uppercase tracking-widest">
                          {t.awards}
                        </h2>
                        <div className="space-y-3">
                          {previewData.awards.map((award) => (
                            <div key={award.id} className="text-center">
                              <span className="font-bold text-black">{award.title}</span>
                              <span className="text-gray-800"> — {award.issuer}, {award.date}</span>
                              {award.description && <p className="text-sm text-gray-700">{award.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {template === "minimal" && (
                  <div className="p-12 font-sans text-gray-800 min-h-[1123px]">
                    <div className="mb-10">
                      <h1 className="text-5xl font-light text-black mb-4">{previewData.personalInfo.fullName}</h1>
                      {previewData.personalInfo.jobTitle && (
                        <p className="text-xl text-gray-500 mb-4">{previewData.personalInfo.jobTitle}</p>
                      )}
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                        {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                        {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                        {previewData.personalInfo.linkedin && <span>{previewData.personalInfo.linkedin}</span>}
                        {previewData.personalInfo.website && <span>{previewData.personalInfo.website}</span>}
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
                                <div className="text-md text-gray-600 mb-2">
                                  {exp.company}{exp.location && `, ${exp.location}`}
                                </div>
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
                                <h3 className="text-lg font-medium text-black">
                                  {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                                </h3>
                                <div className="text-md text-gray-600">
                                  {edu.institution}{edu.location && `, ${edu.location}`}
                                  {edu.gpa && <span className="text-gray-400 ml-2">({edu.gpa})</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                      <div className="mb-10">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.skills}</h2>
                        {previewData.skills.technical && (
                          <div className="mb-3">
                            <span className="text-gray-400 text-sm">{t.technicalSkills}: </span>
                            <span className="text-gray-700">{previewData.skills.technical}</span>
                          </div>
                        )}
                        {previewData.skills.soft && (
                          <div className="mb-3">
                            <span className="text-gray-400 text-sm">{t.softSkills}: </span>
                            <span className="text-gray-700">{previewData.skills.soft}</span>
                          </div>
                        )}
                        {previewData.skills.additional && (
                          <div>
                            <span className="text-gray-400 text-sm">{t.additionalSkills}: </span>
                            <span className="text-gray-700">{previewData.skills.additional}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {previewData.spokenLanguages.length > 0 && (
                      <div className="mb-10">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.spokenLanguages}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {previewData.spokenLanguages.map((lang) => (
                            <span key={lang.id} className="text-gray-700">{lang.language} ({lang.proficiency})</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.certifications.length > 0 && (
                      <div className="mb-10">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.certifications}</h2>
                        <div className="space-y-2">
                          {previewData.certifications.map((cert) => (
                            <div key={cert.id} className="text-gray-700">
                              <span className="font-medium">{cert.name}</span>
                              <span className="text-gray-500"> — {cert.issuer}, {cert.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.projects.length > 0 && (
                      <div className="mb-10">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.projects}</h2>
                        <div className="space-y-4">
                          {previewData.projects.map((proj) => (
                            <div key={proj.id}>
                              <h3 className="text-lg font-medium text-black">{proj.name}</h3>
                              {proj.keySkills && <p className="text-sm text-gray-500">{proj.keySkills}</p>}
                              <p className="text-sm text-gray-600">{proj.description}</p>
                              {proj.link && <p className="text-sm text-blue-600">{proj.link}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewData.awards.length > 0 && (
                      <div>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.awards}</h2>
                        <div className="space-y-3">
                          {previewData.awards.map((award) => (
                            <div key={award.id}>
                              <span className="font-medium text-gray-800">{award.title}</span>
                              <span className="text-gray-500"> — {award.issuer}, {award.date}</span>
                              {award.description && <p className="text-sm text-gray-600">{award.description}</p>}
                            </div>
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
                      {previewData.personalInfo.jobTitle && (
                        <p className="text-lg text-blue-200 mb-6 italic">{previewData.personalInfo.jobTitle}</p>
                      )}
                      
                      <div className="space-y-4 text-sm text-blue-100 mb-10">
                        {previewData.personalInfo.email && <div className="break-all">{previewData.personalInfo.email}</div>}
                        {previewData.personalInfo.phone && <div>{previewData.personalInfo.phone}</div>}
                        {previewData.personalInfo.location && <div>{previewData.personalInfo.location}</div>}
                        {previewData.personalInfo.linkedin && <div>{previewData.personalInfo.linkedin}</div>}
                        {previewData.personalInfo.website && <div>{previewData.personalInfo.website}</div>}
                      </div>

                      {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                        <div className="mb-10">
                          <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-4 uppercase tracking-wider">{t.skills}</h2>
                          {previewData.skills.technical && (
                            <div className="mb-3">
                              <p className="text-blue-200 text-sm">{t.technicalSkills}</p>
                              <p className="text-sm">{previewData.skills.technical}</p>
                            </div>
                          )}
                          {previewData.skills.soft && (
                            <div className="mb-3">
                              <p className="text-blue-200 text-sm">{t.softSkills}</p>
                              <p className="text-sm">{previewData.skills.soft}</p>
                            </div>
                          )}
                          {previewData.skills.additional && (
                            <div>
                              <p className="text-blue-200 text-sm">{t.additionalSkills}</p>
                              <p className="text-sm">{previewData.skills.additional}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {previewData.spokenLanguages.length > 0 && (
                        <div className="mb-10">
                          <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-4 uppercase tracking-wider">{t.spokenLanguages}</h2>
                          <div className="flex flex-col gap-2">
                            {previewData.spokenLanguages.map((lang) => (
                              <div key={lang.id} className="text-sm">
                                {lang.language} <span className="text-blue-200">({lang.proficiency})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {previewData.certifications.length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-4 uppercase tracking-wider">{t.certifications}</h2>
                          <div className="flex flex-col gap-2">
                            {previewData.certifications.map((cert) => (
                              <div key={cert.id} className="text-sm">
                                <div>{cert.name}</div>
                                <div className="text-blue-200 text-xs">{cert.issuer}, {cert.date}</div>
                              </div>
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
                                  <span className="text-md text-blue-600 font-medium">
                                    {exp.company}{exp.location && `, ${exp.location}`}
                                  </span>
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
                                <h3 className="text-lg font-bold text-gray-900">
                                  {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                                </h3>
                                <div className="flex justify-between items-center">
                                  <span className="text-md text-gray-700">
                                    {edu.institution}{edu.location && `, ${edu.location}`}
                                  </span>
                                  <span className="text-sm text-gray-500">{edu.graduationYear}</span>
                                </div>
                                {edu.gpa && <p className="text-sm text-gray-500">{t.gpa}: {edu.gpa}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {previewData.projects.length > 0 && (
                        <div className="mb-8">
                          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.projects}</h2>
                          <div className="space-y-4">
                            {previewData.projects.map((proj) => (
                              <div key={proj.id}>
                                <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                                {proj.keySkills && <p className="text-sm text-blue-600">{proj.keySkills}</p>}
                                <p className="text-sm text-gray-600">{proj.description}</p>
                                {proj.link && <p className="text-sm text-blue-600">{proj.link}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {previewData.awards.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-100 pb-2 mb-4 uppercase tracking-wider">{t.awards}</h2>
                          <div className="space-y-3">
                            {previewData.awards.map((award) => (
                              <div key={award.id}>
                                <span className="font-bold text-gray-900">{award.title}</span>
                                <span className="text-gray-600"> — {award.issuer}, {award.date}</span>
                                {award.description && <p className="text-sm text-gray-600">{award.description}</p>}
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

        {/* Hidden PDF Export Container - Always A4 size */}
        <div ref={pdfRef} className="fixed left-[-9999px] top-0" style={{ width: '794px', minHeight: '1123px' }}>
          {template === "modern" && (
            <div className="p-8 bg-white" style={{ width: '794px', minHeight: '1123px', fontFamily: "'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'Arial', sans-serif" }} dir={isRTL ? "rtl" : "ltr"}>
              <div className="border-b-2 border-gray-800 pb-5 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ lineHeight: '1.2' }}>
                  {previewData.personalInfo.fullName}
                </h1>
                {previewData.personalInfo.jobTitle && (
                  <p className="text-xl text-blue-700 font-medium mb-3">{previewData.personalInfo.jobTitle}</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600" style={{ gap: '12px' }}>
                  {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                  {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                  {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                  {previewData.personalInfo.linkedin && <span>{previewData.personalInfo.linkedin}</span>}
                  {previewData.personalInfo.website && <span>{previewData.personalInfo.website}</span>}
                </div>
              </div>

              {previewData.personalInfo.summary && (
                <div className="mb-8">
                  <p className="text-gray-700" style={{ lineHeight: '1.6', fontSize: '14px' }}>{previewData.personalInfo.summary}</p>
                </div>
              )}

              {previewData.experience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-5 uppercase tracking-wide">
                    {t.experience}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {previewData.experience.map((exp) => (
                      <div key={exp.id} style={{ marginBottom: '16px' }}>
                        <div className="flex justify-between items-baseline" style={{ marginBottom: '6px' }}>
                          <h3 className="text-lg font-semibold text-gray-800" style={{ fontSize: '16px', fontWeight: 600 }}>{exp.position}</h3>
                          <span className="text-sm text-gray-600" style={{ fontSize: '13px', fontWeight: 500 }}>
                            {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                          </span>
                        </div>
                        <div className="text-gray-700 font-medium" style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                          {exp.company}{exp.location && `, ${exp.location}`}
                        </div>
                        <p className="text-gray-600" style={{ fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-5 uppercase tracking-wide">
                    {t.education}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {previewData.education.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: '12px' }}>
                        <div className="flex justify-between items-baseline" style={{ marginBottom: '6px' }}>
                          <h3 className="text-lg font-semibold text-gray-800" style={{ fontSize: '16px', fontWeight: 600 }}>
                            {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                          </h3>
                          <span className="text-sm text-gray-600" style={{ fontSize: '13px', fontWeight: 500 }}>{edu.graduationYear}</span>
                        </div>
                        <div className="text-gray-700" style={{ fontSize: '14px' }}>
                          {edu.institution}{edu.location && `, ${edu.location}`}
                          {edu.gpa && <span className="text-gray-500 ml-2">({edu.gpa})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-5 uppercase tracking-wide">
                    {t.skills}
                  </h2>
                  {previewData.skills.technical && (
                    <div className="mb-2" style={{ fontSize: '14px' }}>
                      <span style={{ fontWeight: 600 }}>{t.technicalSkills}: </span>
                      <span className="text-gray-700">{previewData.skills.technical}</span>
                    </div>
                  )}
                  {previewData.skills.soft && (
                    <div className="mb-2" style={{ fontSize: '14px' }}>
                      <span style={{ fontWeight: 600 }}>{t.softSkills}: </span>
                      <span className="text-gray-700">{previewData.skills.soft}</span>
                    </div>
                  )}
                  {previewData.skills.additional && (
                    <div style={{ fontSize: '14px' }}>
                      <span style={{ fontWeight: 600 }}>{t.additionalSkills}: </span>
                      <span className="text-gray-700">{previewData.skills.additional}</span>
                    </div>
                  )}
                </div>
              )}

              {previewData.spokenLanguages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-5 uppercase tracking-wide">
                    {t.spokenLanguages}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {previewData.spokenLanguages.map((lang) => (
                      <span key={lang.id} className="text-gray-700" style={{ fontSize: '14px' }}>
                        {lang.language} <span className="text-gray-500">({lang.proficiency})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {previewData.certifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-5 uppercase tracking-wide">
                    {t.certifications}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {previewData.certifications.map((cert) => (
                      <div key={cert.id} className="text-gray-700" style={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: 600 }}>{cert.name}</span>
                        <span className="text-gray-500"> — {cert.issuer}</span>
                        <span className="text-gray-500" style={{ fontSize: '13px' }}> ({cert.date}{cert.expires && ` - ${t.expires}: ${cert.expires}`})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.projects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-5 uppercase tracking-wide">
                    {t.projects}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {previewData.projects.map((proj) => (
                      <div key={proj.id}>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-lg font-semibold text-gray-800" style={{ fontSize: '16px', fontWeight: 600 }}>{proj.name}</h3>
                          {proj.link && <span className="text-sm text-blue-600" style={{ fontSize: '13px' }}>{proj.link}</span>}
                        </div>
                        {proj.keySkills && (
                          <p className="text-sm text-gray-600 italic mb-1" style={{ fontSize: '13px' }}>{proj.keySkills}</p>
                        )}
                        <p className="text-gray-700" style={{ fontSize: '13px', lineHeight: '1.5' }}>{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.awards.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-5 uppercase tracking-wide">
                    {t.awards}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {previewData.awards.map((award) => (
                      <div key={award.id}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-gray-800" style={{ fontSize: '14px', fontWeight: 600 }}>{award.title}</span>
                          <span className="text-sm text-gray-500" style={{ fontSize: '13px' }}>{award.date}</span>
                        </div>
                        <div className="text-gray-600 text-sm" style={{ fontSize: '13px' }}>{award.issuer}</div>
                        {award.description && <p className="text-sm text-gray-600" style={{ fontSize: '13px', lineHeight: '1.5' }}>{award.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {template === "classic" && (
            <div className="p-10 bg-white" style={{ width: '794px', minHeight: '1123px', fontFamily: "'Georgia', 'Times New Roman', 'Segoe UI', 'Tahoma', serif" }} dir={isRTL ? "rtl" : "ltr"}>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-black mb-3" style={{ fontSize: '36px', fontWeight: 700, lineHeight: '1.2' }}>{previewData.personalInfo.fullName}</h1>
                {previewData.personalInfo.jobTitle && (
                  <p className="text-lg text-gray-700 italic mb-3">{previewData.personalInfo.jobTitle}</p>
                )}
                <div className="flex justify-center flex-wrap text-sm text-gray-800" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '14px' }}>
                  {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                  {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                  {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                  {previewData.personalInfo.linkedin && <span>{previewData.personalInfo.linkedin}</span>}
                  {previewData.personalInfo.website && <span>{previewData.personalInfo.website}</span>}
                </div>
              </div>
              
              {previewData.personalInfo.summary && (
                <div className="mb-8">
                  <p className="text-gray-800" style={{ fontSize: '14px', lineHeight: '1.6', textAlign: isRTL ? 'right' : 'justify' }}>{previewData.personalInfo.summary}</p>
                </div>
              )}

              {previewData.experience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-5 text-center uppercase tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {t.experience}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {previewData.experience.map((exp) => (
                      <div key={exp.id} style={{ marginBottom: '16px' }}>
                        <div className="flex justify-between items-baseline" style={{ marginBottom: '6px' }}>
                          <h3 className="text-lg font-bold text-black" style={{ fontSize: '17px', fontWeight: 700 }}>{exp.position}</h3>
                          <span className="text-sm text-gray-800" style={{ fontSize: '13px', fontStyle: 'italic' }}>
                            {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                          </span>
                        </div>
                        <div className="text-gray-800 mb-2" style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '8px' }}>
                          {exp.company}{exp.location && `, ${exp.location}`}
                        </div>
                        <p className="text-gray-800" style={{ fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-5 text-center uppercase tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {t.education}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {previewData.education.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: '12px' }}>
                        <div className="flex justify-between items-baseline" style={{ marginBottom: '6px' }}>
                          <h3 className="text-lg font-bold text-black" style={{ fontSize: '17px', fontWeight: 700 }}>
                            {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                          </h3>
                          <span className="text-sm text-gray-800" style={{ fontSize: '13px', fontStyle: 'italic' }}>{edu.graduationYear}</span>
                        </div>
                        <div className="text-gray-800" style={{ fontSize: '15px' }}>
                          {edu.institution}{edu.location && `, ${edu.location}`}
                          {edu.gpa && <span className="italic ml-2">({edu.gpa})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-5 text-center uppercase tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {t.skills}
                  </h2>
                  {previewData.skills.technical && (
                    <p className="text-gray-800 mb-2 text-center" style={{ fontSize: '14px' }}>
                      <span style={{ fontWeight: 700 }}>{t.technicalSkills}: </span>{previewData.skills.technical}
                    </p>
                  )}
                  {previewData.skills.soft && (
                    <p className="text-gray-800 mb-2 text-center" style={{ fontSize: '14px' }}>
                      <span style={{ fontWeight: 700 }}>{t.softSkills}: </span>{previewData.skills.soft}
                    </p>
                  )}
                  {previewData.skills.additional && (
                    <p className="text-gray-800 text-center" style={{ fontSize: '14px' }}>
                      <span style={{ fontWeight: 700 }}>{t.additionalSkills}: </span>{previewData.skills.additional}
                    </p>
                  )}
                </div>
              )}

              {previewData.spokenLanguages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-5 text-center uppercase tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {t.spokenLanguages}
                  </h2>
                  <p className="text-gray-800 text-center" style={{ fontSize: '14px' }}>
                    {previewData.spokenLanguages.map(l => `${l.language} (${l.proficiency})`).join(" • ")}
                  </p>
                </div>
              )}

              {previewData.certifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-5 text-center uppercase tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {t.certifications}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {previewData.certifications.map((cert) => (
                      <div key={cert.id} className="text-gray-800 text-center" style={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: 700 }}>{cert.name}</span>
                        <span> — {cert.issuer}, {cert.date}</span>
                        {cert.expires && <span className="italic"> ({t.expires}: {cert.expires})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.projects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-5 text-center uppercase tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {t.projects}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {previewData.projects.map((proj) => (
                      <div key={proj.id}>
                        <h3 className="text-lg font-bold text-black text-center" style={{ fontSize: '17px', fontWeight: 700 }}>{proj.name}</h3>
                        {proj.keySkills && (
                          <p className="text-sm text-gray-700 italic text-center" style={{ fontSize: '13px' }}>{proj.keySkills}</p>
                        )}
                        <p className="text-sm text-gray-800 text-center" style={{ fontSize: '13px', lineHeight: '1.5' }}>{proj.description}</p>
                        {proj.link && <p className="text-sm text-center text-blue-700" style={{ fontSize: '13px' }}>{proj.link}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.awards.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-black border-b border-black pb-2 mb-5 text-center uppercase tracking-widest" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {t.awards}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {previewData.awards.map((award) => (
                      <div key={award.id} className="text-center">
                        <span className="font-bold text-black" style={{ fontSize: '14px', fontWeight: 700 }}>{award.title}</span>
                        <span className="text-gray-800" style={{ fontSize: '14px' }}> — {award.issuer}, {award.date}</span>
                        {award.description && <p className="text-sm text-gray-700" style={{ fontSize: '13px' }}>{award.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {template === "minimal" && (
            <div className="p-10 text-gray-800 bg-white" style={{ width: '794px', minHeight: '1123px', fontFamily: "'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif" }} dir={isRTL ? "rtl" : "ltr"}>
              <div className="mb-10">
                <h1 className="text-5xl font-light text-black mb-4" style={{ fontSize: '48px', fontWeight: 300, lineHeight: '1.1' }}>{previewData.personalInfo.fullName}</h1>
                {previewData.personalInfo.jobTitle && (
                  <p className="text-xl text-gray-500 mb-4">{previewData.personalInfo.jobTitle}</p>
                )}
                <div className="flex flex-col text-sm text-gray-500" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                  {previewData.personalInfo.email && <span>{previewData.personalInfo.email}</span>}
                  {previewData.personalInfo.phone && <span>{previewData.personalInfo.phone}</span>}
                  {previewData.personalInfo.location && <span>{previewData.personalInfo.location}</span>}
                  {previewData.personalInfo.linkedin && <span>{previewData.personalInfo.linkedin}</span>}
                  {previewData.personalInfo.website && <span>{previewData.personalInfo.website}</span>}
                </div>
              </div>
              
              {previewData.personalInfo.summary && (
                <div className="mb-10">
                  <p className="text-gray-600" style={{ fontSize: '16px', lineHeight: '1.6', fontWeight: 300 }}>{previewData.personalInfo.summary}</p>
                </div>
              )}

              {previewData.experience.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>{t.experience}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {previewData.experience.map((exp) => (
                      <div key={exp.id} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div className="text-gray-500" style={{ width: '140px', flexShrink: 0, fontSize: '13px' }}>
                          {exp.startDate} <br/> {exp.endDate}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 className="text-black" style={{ fontSize: '17px', fontWeight: 500, marginBottom: '4px' }}>{exp.position}</h3>
                          <div className="text-gray-600 mb-2" style={{ fontSize: '15px', marginBottom: '8px' }}>
                            {exp.company}{exp.location && `, ${exp.location}`}
                          </div>
                          <p className="text-gray-600" style={{ fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.education.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>{t.education}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {previewData.education.map((edu) => (
                      <div key={edu.id} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <div className="text-gray-500" style={{ width: '140px', flexShrink: 0, fontSize: '13px' }}>
                          {edu.graduationYear}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 className="text-black" style={{ fontSize: '17px', fontWeight: 500, marginBottom: '4px' }}>
                            {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                          </h3>
                          <div className="text-gray-600" style={{ fontSize: '15px' }}>
                            {edu.institution}{edu.location && `, ${edu.location}`}
                            {edu.gpa && <span className="text-gray-400 ml-2">({edu.gpa})</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                <div className="mb-10">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>{t.skills}</h2>
                  {previewData.skills.technical && (
                    <div className="mb-3" style={{ fontSize: '14px' }}>
                      <span className="text-gray-400">{t.technicalSkills}: </span>
                      <span className="text-gray-700">{previewData.skills.technical}</span>
                    </div>
                  )}
                  {previewData.skills.soft && (
                    <div className="mb-3" style={{ fontSize: '14px' }}>
                      <span className="text-gray-400">{t.softSkills}: </span>
                      <span className="text-gray-700">{previewData.skills.soft}</span>
                    </div>
                  )}
                  {previewData.skills.additional && (
                    <div style={{ fontSize: '14px' }}>
                      <span className="text-gray-400">{t.additionalSkills}: </span>
                      <span className="text-gray-700">{previewData.skills.additional}</span>
                    </div>
                  )}
                </div>
              )}

              {previewData.spokenLanguages.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>{t.spokenLanguages}</h2>
                  <div className="flex flex-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
                    {previewData.spokenLanguages.map((lang) => (
                      <span key={lang.id} className="text-gray-700" style={{ fontSize: '14px' }}>{lang.language} ({lang.proficiency})</span>
                    ))}
                  </div>
                </div>
              )}

              {previewData.certifications.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>{t.certifications}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {previewData.certifications.map((cert) => (
                      <div key={cert.id} className="text-gray-700" style={{ fontSize: '14px' }}>
                        <span className="font-medium">{cert.name}</span>
                        <span className="text-gray-500"> — {cert.issuer}, {cert.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.projects.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>{t.projects}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {previewData.projects.map((proj) => (
                      <div key={proj.id}>
                        <h3 className="text-black" style={{ fontSize: '17px', fontWeight: 500, marginBottom: '4px' }}>{proj.name}</h3>
                        {proj.keySkills && <p className="text-sm text-gray-500" style={{ fontSize: '13px' }}>{proj.keySkills}</p>}
                        <p className="text-sm text-gray-600" style={{ fontSize: '13px', lineHeight: '1.5' }}>{proj.description}</p>
                        {proj.link && <p className="text-sm text-blue-600" style={{ fontSize: '13px' }}>{proj.link}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewData.awards.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4" style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>{t.awards}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {previewData.awards.map((award) => (
                      <div key={award.id}>
                        <span className="font-medium text-gray-800" style={{ fontSize: '14px' }}>{award.title}</span>
                        <span className="text-gray-500" style={{ fontSize: '14px' }}> — {award.issuer}, {award.date}</span>
                        {award.description && <p className="text-sm text-gray-600" style={{ fontSize: '13px' }}>{award.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {template === "creative" && (
            <div className="flex min-h-[1123px] bg-white" style={{ width: '794px', fontFamily: "'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', sans-serif" }} dir={isRTL ? "rtl" : "ltr"}>
              <div style={{ width: '260px', backgroundColor: '#1e3a8a', color: '#ffffff', padding: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', lineHeight: '1.2' }}>{previewData.personalInfo.fullName}</h1>
                {previewData.personalInfo.jobTitle && (
                  <p style={{ fontSize: '16px', color: '#dbeafe', marginBottom: '24px', fontStyle: 'italic' }}>{previewData.personalInfo.jobTitle}</p>
                )}
                
                <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#dbeafe' }}>
                  {previewData.personalInfo.email && <div style={{ wordBreak: 'break-all' }}>{previewData.personalInfo.email}</div>}
                  {previewData.personalInfo.phone && <div>{previewData.personalInfo.phone}</div>}
                  {previewData.personalInfo.location && <div>{previewData.personalInfo.location}</div>}
                  {previewData.personalInfo.linkedin && <div>{previewData.personalInfo.linkedin}</div>}
                  {previewData.personalInfo.website && <div>{previewData.personalInfo.website}</div>}
                </div>

                {(previewData.skills.technical || previewData.skills.soft || previewData.skills.additional) && (
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid #1e40af', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.skills}</h2>
                    {previewData.skills.technical && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontSize: '13px', color: '#93c5fd', marginBottom: '4px' }}>{t.technicalSkills}</p>
                        <p style={{ fontSize: '14px' }}>{previewData.skills.technical}</p>
                      </div>
                    )}
                    {previewData.skills.soft && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontSize: '13px', color: '#93c5fd', marginBottom: '4px' }}>{t.softSkills}</p>
                        <p style={{ fontSize: '14px' }}>{previewData.skills.soft}</p>
                      </div>
                    )}
                    {previewData.skills.additional && (
                      <div>
                        <p style={{ fontSize: '13px', color: '#93c5fd', marginBottom: '4px' }}>{t.additionalSkills}</p>
                        <p style={{ fontSize: '14px' }}>{previewData.skills.additional}</p>
                      </div>
                    )}
                  </div>
                )}

                {previewData.spokenLanguages.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid #1e40af', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.spokenLanguages}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {previewData.spokenLanguages.map((lang) => (
                        <div key={lang.id} style={{ fontSize: '14px' }}>
                          {lang.language} <span style={{ color: '#93c5fd' }}>({lang.proficiency})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewData.certifications.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid #1e40af', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.certifications}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {previewData.certifications.map((cert) => (
                        <div key={cert.id} style={{ fontSize: '14px' }}>
                          <div>{cert.name}</div>
                          <div style={{ fontSize: '12px', color: '#93c5fd' }}>{cert.issuer}, {cert.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ width: '534px', backgroundColor: '#ffffff', padding: '32px', color: '#1f2937' }}>
                {previewData.personalInfo.summary && (
                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e3a8a', borderBottom: '2px solid #dbeafe', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.summary}</h2>
                    <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{previewData.personalInfo.summary}</p>
                  </div>
                )}

                {previewData.experience.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e3a8a', borderBottom: '2px solid #dbeafe', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.experience}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {previewData.experience.map((exp) => (
                        <div key={exp.id} style={{ marginBottom: '12px' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{exp.position}</h3>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '15px', color: '#2563eb', fontWeight: 500 }}>
                              {exp.company}{exp.location && `, ${exp.location}`}
                            </span>
                            <span style={{ fontSize: '13px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
                              {exp.startDate} {exp.startDate && exp.endDate ? "-" : ""} {exp.endDate}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewData.education.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e3a8a', borderBottom: '2px solid #dbeafe', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.education}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {previewData.education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                            {edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                          </h3>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '15px', color: '#374151' }}>
                              {edu.institution}{edu.location && `, ${edu.location}`}
                            </span>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>{edu.graduationYear}</span>
                          </div>
                          {edu.gpa && <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{t.gpa}: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewData.projects.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e3a8a', borderBottom: '2px solid #dbeafe', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.projects}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {previewData.projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{proj.name}</h3>
                          {proj.keySkills && <p style={{ fontSize: '14px', color: '#2563eb', marginBottom: '4px' }}>{proj.keySkills}</p>}
                          <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>{proj.description}</p>
                          {proj.link && <p style={{ fontSize: '13px', color: '#2563eb' }}>{proj.link}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewData.awards.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e3a8a', borderBottom: '2px solid #dbeafe', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.awards}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {previewData.awards.map((award) => (
                        <div key={award.id}>
                          <span style={{ fontWeight: 700, color: '#111827' }}>{award.title}</span>
                          <span style={{ color: '#4b5563' }}> — {award.issuer}, {award.date}</span>
                          {award.description && <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5', marginTop: '4px' }}>{award.description}</p>}
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
  );
}
