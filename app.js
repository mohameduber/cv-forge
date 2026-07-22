(function () {
  "use strict";

  const CONFIG = window.CVFORGE_CONFIG || { checkoutUrl: "", price: "$4.90" };
  const STATE_KEY = "cvforge-state-v1";
  const PRO_KEY = "cvforge-pro-v1";

  const TEXT = {
    en: {
      dir: "ltr",
      ui: {
        template: "Template", classic: "Classic", modern: "Modern", minimal: "Minimal",
        newCv: "New CV", pro: "Remove watermark", proActive: "Pro active", download: "Download PDF",
        personal: "Personal details", summary: "Professional summary", experience: "Experience",
        education: "Education", skills: "Skills", languages: "Languages", uploadPhoto: "Upload photo",
        removePhoto: "Remove", addExperience: "+ Add position", addEducation: "+ Add education",
        item: "Item", typeEnter: "Type and press Enter", confirmReset: "Delete this CV and start over?",
        proTitle: "Remove the watermark", proDescription: "Pay once and export clean resumes forever on this device.",
        buy: "Buy a license", purchased: "Already purchased?", activate: "Activate", keyPlaceholder: "Paste your license key",
        enterKey: "Paste your license key first.", checking: "Checking license...", activated: "Activated. The watermark is now removed.",
        invalid: "This license key is not valid or has reached its activation limit.", network: "Could not reach the license server. Try again.",
        storeMissing: "Checkout is not configured yet. The site owner needs to add the product URL in config.js.",
        watermark: "CVForge - Free version"
      },
      ph: {
        name: "Full name", title: "Job title", email: "Email", phone: "Phone", location: "City, Country",
        link: "LinkedIn or portfolio", summary: "Who you are, what you do, and the value you bring...",
        company: "Company", role: "Position", from: "From (e.g. 2022)", to: "To (or Present)",
        description: "Achievements and responsibilities...", school: "University or school", degree: "Degree / field of study",
        skill: "e.g. Project management", language: "e.g. English - Fluent"
      },
      cv: { summary: "Profile", experience: "Experience", education: "Education", skills: "Skills", languages: "Languages", contact: "Contact" }
    },
    ar: {
      dir: "rtl",
      ui: {
        template: "القالب", classic: "كلاسيك", modern: "مودرن", minimal: "بسيط",
        newCv: "سيرة جديدة", pro: "إزالة العلامة", proActive: "النسخة المدفوعة", download: "تحميل PDF",
        personal: "البيانات الشخصية", summary: "نبذة مهنية", experience: "الخبرات",
        education: "التعليم", skills: "المهارات", languages: "اللغات", uploadPhoto: "رفع صورة",
        removePhoto: "حذف", addExperience: "+ إضافة وظيفة", addEducation: "+ إضافة تعليم",
        item: "عنصر", typeEnter: "اكتب واضغط Enter", confirmReset: "تمسح السيرة دي وتبدأ من جديد؟",
        proTitle: "إزالة العلامة المائية", proDescription: "ادفع مرة واحدة وحمّل سير ذاتية نظيفة للأبد على الجهاز ده.",
        buy: "شراء ترخيص", purchased: "اشتريت بالفعل؟", activate: "تفعيل", keyPlaceholder: "الصق مفتاح الترخيص",
        enterKey: "الصق مفتاح الترخيص الأول.", checking: "جاري فحص الترخيص...", activated: "تم التفعيل واتشالت العلامة المائية.",
        invalid: "المفتاح غير صحيح أو وصل للحد الأقصى من الأجهزة.", network: "تعذر الاتصال بسيرفر الترخيص. حاول تاني.",
        storeMissing: "رابط الدفع لسه مش متضاف. صاحب الموقع لازم يضيف رابط المنتج في config.js.",
        watermark: "CVForge - نسخة مجانية"
      },
      ph: {
        name: "الاسم بالكامل", title: "المسمى الوظيفي", email: "البريد الإلكتروني", phone: "رقم الهاتف", location: "المدينة، الدولة",
        link: "لينكدإن أو معرض الأعمال", summary: "خبرتك، تخصصك، والقيمة اللي بتقدمها...",
        company: "الشركة", role: "المنصب", from: "من (مثال: 2022)", to: "إلى (أو: حتى الآن)",
        description: "أهم إنجازاتك ومسؤولياتك...", school: "الجامعة أو المدرسة", degree: "الشهادة / التخصص",
        skill: "مثال: إدارة المشروعات", language: "مثال: الإنجليزية - بطلاقة"
      },
      cv: { summary: "نبذة", experience: "الخبرات", education: "التعليم", skills: "المهارات", languages: "اللغات", contact: "بيانات التواصل" }
    }
  };

  const CV_CSS = `
    .cv-page{--accent:#2563eb;width:210mm;min-height:297mm;padding:15mm;background:#fff;color:#1f2937;box-sizing:border-box;box-shadow:0 5px 25px rgba(15,23,42,.18);font:10.2pt/1.48 Inter,Cairo,Arial,sans-serif;position:relative;overflow:hidden}
    .cv-page[dir=rtl]{font-family:Cairo,Inter,Arial,sans-serif}.cv-page *{box-sizing:border-box}.cv-page h1,.cv-page h2,.cv-page h3,.cv-page h4,.cv-page p{margin-top:0}.cv-page p{margin-bottom:2.5mm}.cv-page section{margin-top:5mm}.cv-page .cv-name{margin:0;color:#101828;font-size:25pt;line-height:1.12;letter-spacing:-.035em}.cv-page[dir=rtl] .cv-name{letter-spacing:0}.cv-page .cv-role{margin-top:1.5mm;color:var(--accent);font-size:12pt;font-weight:700}.cv-page .cv-contact{display:flex;flex-wrap:wrap;gap:1.5mm 4mm;margin-top:3mm;color:#667085;font-size:8.7pt}.cv-page .cv-contact span{overflow-wrap:anywhere}.cv-page .section-title{margin:0 0 2.7mm;padding-bottom:1.5mm;color:var(--accent);border-bottom:1.5px solid var(--accent);font-size:10.5pt;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.cv-page[dir=rtl] .section-title{letter-spacing:0}.cv-page .cv-item{margin-bottom:3.4mm;break-inside:avoid}.cv-page .item-head{display:flex;align-items:baseline;justify-content:space-between;gap:5mm}.cv-page .item-head strong{font-size:10.3pt}.cv-page .dates{flex:none;color:#667085;font-size:8.5pt}.cv-page .item-subtitle{margin-top:.5mm;color:var(--accent);font-size:9.2pt;font-weight:600}.cv-page .item-description{margin:1.3mm 0 0;color:#475467;white-space:pre-line}.cv-page .cv-chips{display:flex;flex-wrap:wrap;gap:2mm}.cv-page .cv-chip{padding:1.2mm 2.5mm;color:#17427c;background:#eaf2ff;border-radius:20mm;font-size:8.7pt;font-weight:600}.cv-page .cv-photo{width:30mm;height:30mm;object-fit:cover;border-radius:50%;flex:none}.cv-page .cv-placeholder{color:#98a2b3}
    .tpl-classic .cv-header{display:flex;align-items:center;justify-content:space-between;gap:8mm;padding-bottom:5mm;border-bottom:1px solid #d0d5dd}.tpl-classic .cv-header-text{flex:1}.tpl-classic .cv-bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:8mm}
    .tpl-modern{padding:0}.tpl-modern .modern-layout{display:grid;grid-template-columns:68mm 1fr;min-height:297mm}.tpl-modern .modern-side{padding:14mm 8mm;color:#fff;background:var(--accent)}.tpl-modern .modern-main{padding:14mm 11mm}.tpl-modern .cv-photo{display:block;width:34mm;height:34mm;margin:0 auto 7mm;border:2.5px solid rgba(255,255,255,.75)}.tpl-modern .cv-name{color:#fff;font-size:20pt}.tpl-modern .cv-role{color:rgba(255,255,255,.86)}.tpl-modern .side-title{margin:8mm 0 3mm;padding-bottom:1.5mm;border-bottom:1px solid rgba(255,255,255,.4);font-size:9.5pt;text-transform:uppercase;letter-spacing:.08em}.tpl-modern[dir=rtl] .side-title{letter-spacing:0}.tpl-modern .side-line{margin-bottom:2mm;overflow-wrap:anywhere;font-size:8.8pt}.tpl-modern .side-tags{display:flex;flex-direction:column;gap:1.8mm}.tpl-modern .side-tag{padding:1.5mm 2mm;background:rgba(255,255,255,.14);border-radius:1.5mm;font-size:8.7pt}.tpl-modern .section-title{color:var(--accent)}
    .tpl-minimal{padding:17mm}.tpl-minimal .cv-header{display:flex;align-items:flex-start;justify-content:space-between;gap:8mm;padding-bottom:7mm}.tpl-minimal .cv-name{font-weight:600}.tpl-minimal .cv-role{color:#667085;font-weight:500}.tpl-minimal .section-title{color:#344054;border-color:#d0d5dd;font-size:9.5pt}.tpl-minimal .item-subtitle{color:#475467}.tpl-minimal .cv-chip{padding:0;color:#344054;background:none}.tpl-minimal .cv-chip:not(:last-child)::after{content:' / ';color:#98a2b3;margin-inline-start:2mm}.tpl-minimal .cv-bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:8mm}
    .cv-watermarks{position:absolute;inset:0;z-index:20;overflow:hidden;pointer-events:none}.cv-watermark{position:absolute;color:#7f8da3;opacity:.105;font-size:17pt;font-weight:800;white-space:nowrap;transform:rotate(-29deg)}.cv-free-footer{position:absolute;z-index:21;inset-inline:0;bottom:3mm;text-align:center;color:#7f8da3;font-size:7.5pt;font-weight:700}
    @media print{@page{size:A4;margin:0}html,body{margin:0!important;padding:0!important;background:#fff!important}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.cv-page{width:210mm!important;min-height:297mm!important;margin:0!important;box-shadow:none!important}}
  `;

  const DEFAULT_STATE = {
    lang: "en",
    template: "classic",
    accent: "#2563eb",
    personal: { name: "", title: "", email: "", phone: "", location: "", link: "", photo: "" },
    summary: "",
    experience: [{ company: "", role: "", from: "", to: "", description: "" }],
    education: [{ school: "", degree: "", from: "", to: "" }],
    skills: [],
    languages: []
  };

  let state = loadState();
  let proState = loadPro();
  let saveTimer = null;

  const $ = (selector) => document.querySelector(selector);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const multiline = (value) => esc(value).replace(/\n/g, "<br>");

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STATE_KEY));
      if (stored && stored.personal) return Object.assign(clone(DEFAULT_STATE), stored);
    } catch (_) { /* Start clean when storage is malformed. */ }
    return clone(DEFAULT_STATE);
  }

  function loadPro() {
    try {
      const stored = JSON.parse(localStorage.getItem(PRO_KEY));
      return stored && stored.active ? stored : { active: false };
    } catch (_) { return { active: false }; }
  }

  function saveState() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => localStorage.setItem(STATE_KEY, JSON.stringify(state)), 180);
  }

  function t() { return TEXT[state.lang]; }

  function setPath(path, value) {
    const keys = path.split(".");
    let target = state;
    for (let i = 0; i < keys.length - 1; i += 1) target = target[keys[i]];
    target[keys[keys.length - 1]] = value;
  }

  function field(path, placeholder, value, type = "text") {
    return `<label class="field"><input type="${type}" data-path="${esc(path)}" value="${esc(value)}" placeholder="${esc(placeholder)}"></label>`;
  }

  function textarea(path, placeholder, value) {
    return `<label class="field"><textarea data-path="${esc(path)}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></label>`;
  }

  function sectionHeading(title) {
    return `<div class="section-heading"><h2>${esc(title)}</h2></div>`;
  }

  function renderForm() {
    const lang = t();
    const p = state.personal;
    const experiences = state.experience.map((item, index) => `
      <div class="repeat-card">
        <div class="repeat-head"><span class="repeat-number">${esc(lang.ui.item)} ${index + 1}</span><button class="icon-button" type="button" data-action="remove-experience" data-index="${index}" aria-label="${esc(lang.ui.removePhoto)}">&times;</button></div>
        <div class="field-grid">${field(`experience.${index}.role`, lang.ph.role, item.role)}${field(`experience.${index}.company`, lang.ph.company, item.company)}</div>
        <div class="field-grid">${field(`experience.${index}.from`, lang.ph.from, item.from)}${field(`experience.${index}.to`, lang.ph.to, item.to)}</div>
        ${textarea(`experience.${index}.description`, lang.ph.description, item.description)}
      </div>`).join("");

    const education = state.education.map((item, index) => `
      <div class="repeat-card">
        <div class="repeat-head"><span class="repeat-number">${esc(lang.ui.item)} ${index + 1}</span><button class="icon-button" type="button" data-action="remove-education" data-index="${index}" aria-label="${esc(lang.ui.removePhoto)}">&times;</button></div>
        <div class="field-grid">${field(`education.${index}.degree`, lang.ph.degree, item.degree)}${field(`education.${index}.school`, lang.ph.school, item.school)}</div>
        <div class="field-grid">${field(`education.${index}.from`, lang.ph.from, item.from)}${field(`education.${index}.to`, lang.ph.to, item.to)}</div>
      </div>`).join("");

    const photo = p.photo ? `<img class="photo-thumb" src="${p.photo}" alt=""><button class="button subtle" type="button" data-action="remove-photo">${esc(lang.ui.removePhoto)}</button>` : "";
    const skills = state.skills.map((item, index) => `<span class="tag">${esc(item)}<button type="button" data-action="remove-skill" data-index="${index}" aria-label="Remove">&times;</button></span>`).join("");
    const languages = state.languages.map((item, index) => `<span class="tag">${esc(item)}<button type="button" data-action="remove-language" data-index="${index}" aria-label="Remove">&times;</button></span>`).join("");

    $("#formPanel").innerHTML = `
      <section class="form-section">
        ${sectionHeading(lang.ui.personal)}
        ${field("personal.name", lang.ph.name, p.name)}
        ${field("personal.title", lang.ph.title, p.title)}
        <div class="field-grid">${field("personal.email", lang.ph.email, p.email, "email")}${field("personal.phone", lang.ph.phone, p.phone, "tel")}</div>
        <div class="field-grid">${field("personal.location", lang.ph.location, p.location)}${field("personal.link", lang.ph.link, p.link, "url")}</div>
        <div class="photo-row"><label class="button photo-upload">${esc(lang.ui.uploadPhoto)}<input id="photoInput" type="file" accept="image/*"></label>${photo}</div>
      </section>
      <section class="form-section">${sectionHeading(lang.ui.summary)}${textarea("summary", lang.ph.summary, state.summary)}</section>
      <section class="form-section">${sectionHeading(lang.ui.experience)}${experiences}<button class="button add-button" type="button" data-action="add-experience">${esc(lang.ui.addExperience)}</button></section>
      <section class="form-section">${sectionHeading(lang.ui.education)}${education}<button class="button add-button" type="button" data-action="add-education">${esc(lang.ui.addEducation)}</button></section>
      <section class="form-section">${sectionHeading(lang.ui.skills)}<input class="tag-entry" data-tag-input="skill" placeholder="${esc(lang.ph.skill)}"><div class="tags">${skills}</div></section>
      <section class="form-section">${sectionHeading(lang.ui.languages)}<input class="tag-entry" data-tag-input="language" placeholder="${esc(lang.ph.language)}"><div class="tags">${languages}</div></section>`;
  }

  function nonEmpty(items, keys) {
    return items.filter((item) => keys.some((key) => String(item[key] || "").trim()));
  }

  function contactHtml(personal) {
    return [personal.email, personal.phone, personal.location, personal.link]
      .filter(Boolean).map((value) => `<span>${esc(value)}</span>`).join("");
  }

  function experienceHtml(lang) {
    const items = nonEmpty(state.experience, ["company", "role", "description"]);
    if (!items.length) return "";
    return `<section><h3 class="section-title">${esc(lang.cv.experience)}</h3>${items.map((item) => `
      <article class="cv-item"><div class="item-head"><strong>${esc(item.role || item.company)}</strong><span class="dates">${esc(item.from)}${item.from && item.to ? " - " : ""}${esc(item.to)}</span></div>
      ${item.role && item.company ? `<div class="item-subtitle">${esc(item.company)}</div>` : ""}${item.description ? `<p class="item-description">${multiline(item.description)}</p>` : ""}</article>`).join("")}</section>`;
  }

  function educationHtml(lang) {
    const items = nonEmpty(state.education, ["school", "degree"]);
    if (!items.length) return "";
    return `<section><h3 class="section-title">${esc(lang.cv.education)}</h3>${items.map((item) => `
      <article class="cv-item"><div class="item-head"><strong>${esc(item.degree || item.school)}</strong><span class="dates">${esc(item.from)}${item.from && item.to ? " - " : ""}${esc(item.to)}</span></div>
      ${item.degree && item.school ? `<div class="item-subtitle">${esc(item.school)}</div>` : ""}</article>`).join("")}</section>`;
  }

  function summaryHtml(lang) {
    return state.summary ? `<section><h3 class="section-title">${esc(lang.cv.summary)}</h3><p class="item-description">${multiline(state.summary)}</p></section>` : "";
  }

  function chipsSection(title, items) {
    if (!items.length) return "";
    return `<section><h3 class="section-title">${esc(title)}</h3><div class="cv-chips">${items.map((item) => `<span class="cv-chip">${esc(item)}</span>`).join("")}</div></section>`;
  }

  function sideSection(title, items) {
    if (!items.length) return "";
    return `<h3 class="side-title">${esc(title)}</h3><div class="side-tags">${items.map((item) => `<div class="side-tag">${esc(item)}</div>`).join("")}</div>`;
  }

  function renderCV() {
    const lang = t();
    const p = state.personal;
    const name = p.name || lang.ph.name;
    const photo = p.photo ? `<img class="cv-photo" src="${p.photo}" alt="">` : "";
    const profile = summaryHtml(lang);
    const experience = experienceHtml(lang);
    const education = educationHtml(lang);
    const skills = chipsSection(lang.cv.skills, state.skills);
    const languages = chipsSection(lang.cv.languages, state.languages);
    const contacts = contactHtml(p);

    if (state.template === "modern") {
      const contactLines = [p.email, p.phone, p.location, p.link].filter(Boolean).map((item) => `<div class="side-line">${esc(item)}</div>`).join("");
      return `<div class="modern-layout"><aside class="modern-side">${photo}<h1 class="cv-name">${esc(name)}</h1>${p.title ? `<div class="cv-role">${esc(p.title)}</div>` : ""}${contactLines ? `<h3 class="side-title">${esc(lang.cv.contact)}</h3>${contactLines}` : ""}${sideSection(lang.cv.skills, state.skills)}${sideSection(lang.cv.languages, state.languages)}</aside><main class="modern-main">${profile}${experience}${education}</main></div>`;
    }

    const bottom = skills || languages ? `<div class="cv-bottom-grid">${skills}${languages}</div>` : "";
    return `<header class="cv-header"><div class="cv-header-text"><h1 class="cv-name">${esc(name)}</h1>${p.title ? `<div class="cv-role">${esc(p.title)}</div>` : ""}${contacts ? `<div class="cv-contact">${contacts}</div>` : ""}</div>${photo}</header>${profile}${experience}${education}${bottom}`;
  }

  function watermarkHtml() {
    if (proState.active) return "";
    const marks = [];
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        marks.push(`<span class="cv-watermark" style="top:${8 + row * 18}%;left:${-8 + col * 42}%">${esc(t().ui.watermark)}</span>`);
      }
    }
    return `<div class="cv-watermarks">${marks.join("")}</div><div class="cv-free-footer">${esc(t().ui.watermark)}</div>`;
  }

  function renderPreview() {
    $("#cvPreview").innerHTML = `<article class="cv-page tpl-${esc(state.template)}" dir="${t().dir}" style="--accent:${esc(state.accent)}">${renderCV()}${watermarkHtml()}</article>`;
    requestAnimationFrame(fitPreview);
  }

  function fitPreview() {
    const viewport = $("#previewViewport");
    const scaler = $("#previewScaler");
    const preview = $("#cvPreview");
    const page = preview.querySelector(".cv-page");
    if (!page) return;
    preview.style.transform = "none";
    const width = page.offsetWidth;
    const height = page.scrollHeight;
    const scale = Math.min(1, Math.max(.2, (viewport.clientWidth - 42) / width));
    preview.style.transformOrigin = "top left";
    preview.style.transform = `scale(${scale})`;
    scaler.style.width = `${width * scale}px`;
    scaler.style.height = `${height * scale}px`;
  }

  function applyLanguage() {
    const lang = t();
    document.documentElement.lang = state.lang;
    document.documentElement.dir = lang.dir;
    $("#templateLabel").textContent = lang.ui.template;
    $("#templateSelect").innerHTML = `<option value="classic">${esc(lang.ui.classic)}</option><option value="modern">${esc(lang.ui.modern)}</option><option value="minimal">${esc(lang.ui.minimal)}</option>`;
    $("#templateSelect").value = state.template;
    $("#langButton").textContent = state.lang === "en" ? "عربي" : "English";
    $("#resetButton").textContent = lang.ui.newCv;
    $("#downloadButton").textContent = lang.ui.download;
    $("#proButton").textContent = proState.active ? lang.ui.proActive : lang.ui.pro;
    $("#proTitle").textContent = lang.ui.proTitle;
    $("#proDescription").textContent = `${lang.ui.proDescription} ${CONFIG.price || ""}`.trim();
    $("#buyButton").textContent = lang.ui.buy;
    $(".divider span").textContent = lang.ui.purchased;
    $("#activateButton").textContent = lang.ui.activate;
    $("#licenseInput").placeholder = lang.ui.keyPlaceholder;
    renderForm();
    renderPreview();
  }

  function handleFormClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const index = Number(button.dataset.index || 0);
    switch (button.dataset.action) {
      case "add-experience": state.experience.push({ company: "", role: "", from: "", to: "", description: "" }); break;
      case "remove-experience": state.experience.splice(index, 1); if (!state.experience.length) state.experience.push({ company: "", role: "", from: "", to: "", description: "" }); break;
      case "add-education": state.education.push({ school: "", degree: "", from: "", to: "" }); break;
      case "remove-education": state.education.splice(index, 1); if (!state.education.length) state.education.push({ school: "", degree: "", from: "", to: "" }); break;
      case "remove-skill": state.skills.splice(index, 1); break;
      case "remove-language": state.languages.splice(index, 1); break;
      case "remove-photo": state.personal.photo = ""; break;
      default: return;
    }
    saveState();
    renderForm();
    renderPreview();
  }

  function handleTagKey(event) {
    const input = event.target.closest("[data-tag-input]");
    if (!input || event.key !== "Enter") return;
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    const list = input.dataset.tagInput === "skill" ? state.skills : state.languages;
    if (!list.includes(value)) list.push(value);
    saveState();
    renderForm();
    renderPreview();
  }

  function processPhoto(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 360;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        state.personal.photo = canvas.toDataURL("image/jpeg", .86);
        saveState();
        renderForm();
        renderPreview();
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function printCV() {
    const popup = window.open("", "_blank");
    if (!popup) return;
    const title = esc(state.personal.name || "CV");
    popup.document.open();
    popup.document.write(`<!doctype html><html lang="${state.lang}" dir="${t().dir}"><head><meta charset="utf-8"><title>${title}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>${CV_CSS}</style></head><body><article class="cv-page tpl-${esc(state.template)}" dir="${t().dir}" style="--accent:${esc(state.accent)}">${renderCV()}${watermarkHtml()}</article><script>window.addEventListener('load',function(){var ready=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();ready.then(function(){setTimeout(function(){window.print()},150)})});<\/script></body></html>`);
    popup.document.close();
  }

  function openProModal() {
    if (proState.active) return;
    $("#licenseStatus").textContent = "";
    const buy = $("#buyButton");
    if (CONFIG.checkoutUrl) {
      buy.href = CONFIG.checkoutUrl;
      buy.style.display = "block";
    } else {
      buy.removeAttribute("href");
      buy.style.display = "none";
      setLicenseStatus(t().ui.storeMissing, true);
    }
    $("#proModal").classList.remove("hidden");
  }

  function closeProModal() { $("#proModal").classList.add("hidden"); }

  function setLicenseStatus(message, error) {
    const status = $("#licenseStatus");
    status.textContent = message;
    status.className = `license-status ${error ? "error" : "success"}`;
  }

  async function activateLicense() {
    const key = $("#licenseInput").value.trim();
    if (!key) { setLicenseStatus(t().ui.enterKey, true); return; }
    const button = $("#activateButton");
    button.disabled = true;
    setLicenseStatus(t().ui.checking, false);
    try {
      const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/activate", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ license_key: key, instance_name: `CVForge-${navigator.platform || "web"}` })
      });
      const result = await response.json();
      if (!response.ok || !result.activated || !result.instance) throw new Error("invalid");
      proState = { active: true, key, instanceId: result.instance.id };
      localStorage.setItem(PRO_KEY, JSON.stringify(proState));
      setLicenseStatus(t().ui.activated, false);
      $("#proButton").textContent = t().ui.proActive;
      renderPreview();
      setTimeout(closeProModal, 900);
    } catch (error) {
      setLicenseStatus(error instanceof TypeError ? t().ui.network : t().ui.invalid, true);
    } finally {
      button.disabled = false;
    }
  }

  async function validateCachedLicense() {
    if (!proState.active || !proState.key || !proState.instanceId) return;
    try {
      const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ license_key: proState.key, instance_id: proState.instanceId })
      });
      const result = await response.json();
      if (!response.ok || !result.valid) {
        proState = { active: false };
        localStorage.removeItem(PRO_KEY);
        applyLanguage();
      }
    } catch (_) { /* Keep a previously validated license usable offline. */ }
  }

  function bindEvents() {
    $("#formPanel").addEventListener("input", (event) => {
      const input = event.target.closest("[data-path]");
      if (!input) return;
      setPath(input.dataset.path, input.value);
      saveState();
      renderPreview();
    });
    $("#formPanel").addEventListener("click", handleFormClick);
    $("#formPanel").addEventListener("keydown", handleTagKey);
    $("#formPanel").addEventListener("change", (event) => {
      if (event.target.id === "photoInput") processPhoto(event.target.files[0]);
    });
    $("#templateSelect").addEventListener("change", (event) => { state.template = event.target.value; saveState(); renderPreview(); });
    $("#accentPicker").addEventListener("input", (event) => { state.accent = event.target.value; saveState(); renderPreview(); });
    $("#langButton").addEventListener("click", () => { state.lang = state.lang === "en" ? "ar" : "en"; saveState(); applyLanguage(); });
    $("#resetButton").addEventListener("click", () => { if (confirm(t().ui.confirmReset)) { state = clone(DEFAULT_STATE); localStorage.removeItem(STATE_KEY); $("#accentPicker").value = state.accent; applyLanguage(); } });
    $("#downloadButton").addEventListener("click", printCV);
    $("#proButton").addEventListener("click", openProModal);
    $("#closeModalButton").addEventListener("click", closeProModal);
    $("#proModal").addEventListener("click", (event) => { if (event.target.id === "proModal") closeProModal(); });
    $("#activateButton").addEventListener("click", activateLicense);
    $("#licenseInput").addEventListener("keydown", (event) => { if (event.key === "Enter") activateLicense(); });
    window.addEventListener("resize", fitPreview);
  }

  function init() {
    const style = document.createElement("style");
    style.textContent = CV_CSS;
    document.head.appendChild(style);
    $("#accentPicker").value = state.accent;
    bindEvents();
    applyLanguage();
    validateCachedLicense();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
