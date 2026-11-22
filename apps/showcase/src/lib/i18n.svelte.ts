import i18next, { type i18n } from "i18next";

export const SHOWCASE_LOCALES = [
  { code: "en", label: "English", shortCode: "EN", dir: "ltr" as const },
  { code: "de", label: "Deutsch", shortCode: "DE", dir: "ltr" as const },
  { code: "fr", label: "Français", shortCode: "FR", dir: "ltr" as const },
  { code: "es", label: "Español", shortCode: "ES", dir: "ltr" as const },
  { code: "ar", label: "العربية", shortCode: "AR", dir: "rtl" as const },
];

const resources = {
  en: {
    translation: {
      "menu-dashboards": "Dashboards",
      "menu-dashboard-default": "Executive Overview",
      "menu-dashboard-analytics": "Analytics",
      "menu-dashboard-commerce": "Commerce",
      "menu-dashboard-finance": "Finance",
      "menu-dashboard-operations": "Operations",
      "menu-dashboard-saas": "SaaS Metrics",
      "menu-dashboard-learning": "Learning",
      "menu-components": "UI Components",
      "menu-foundation": "Foundation & Layout",
      "menu-surfaces": "Surfaces",
      "menu-inputs": "Inputs & Controls",
      "menu-data-display": "Data Display",
      "menu-navigation": "Navigation",
      "menu-feedback": "Feedback & Overlays",
      "menu-icons": "Icon Library",
      "menu-data-grid": "Data Grid",
      "menu-charts": "Charts",
      "menu-date-pickers": "Date & Time Pickers",
      "menu-plugins": "Plugins",
      "menu-forms": "Forms & Validation",
      "menu-apps": "Applications",
      "menu-apps-kanban": "Kanban Board",
      "menu-apps-calendar": "Schedule Calendar",
      "menu-apps-chat": "Team Chat",
      "menu-apps-invoices": "Invoices",
      "menu-apps-mail": "Inbox",
      "menu-pages": "Pages",
      "menu-pages-profile": "Profile",
      "menu-pages-pricing": "Pricing",
      "menu-pages-faq": "FAQ",
      "menu-pages-signin": "Sign In",
      "menu-pages-signup": "Sign Up",
      "menu-pages-forgot": "Forgot Password",
      "menu-docs": "Documentation",
      "menu-help": "Documentation",
      "menu-documentation": "Architecture & Guides",
    },
  },
  de: {
    translation: {
      "menu-dashboards": "Dashboards",
      "menu-dashboard-default": "Gesamtübersicht",
      "menu-components": "UI-Komponenten",
      "menu-data-grid": "Datentabelle",
      "menu-charts": "Diagramme",
      "menu-date-pickers": "Datum & Zeit",
      "menu-plugins": "Erweiterungen",
      "menu-forms": "Formulare",
      "menu-apps": "Anwendungen",
      "menu-pages": "Seiten",
      "menu-docs": "Dokumentation",
      "menu-help": "Hilfe",
      "menu-documentation": "Architektur & Leitfäden",
    },
  },
  fr: {
    translation: {
      "menu-dashboards": "Tableaux de bord",
      "menu-dashboard-default": "Vue générale",
      "menu-components": "Composants UI",
      "menu-data-grid": "Grille de données",
      "menu-charts": "Graphiques",
      "menu-date-pickers": "Dates & heures",
      "menu-plugins": "Modules",
      "menu-forms": "Formulaires",
      "menu-apps": "Applications",
      "menu-pages": "Pages",
      "menu-docs": "Documentation",
      "menu-help": "Aide",
      "menu-documentation": "Architecture",
    },
  },
  es: {
    translation: {
      "menu-dashboards": "Paneles",
      "menu-dashboard-default": "Resumen ejecutivo",
      "menu-components": "Componentes UI",
      "menu-data-grid": "Tabla de datos",
      "menu-charts": "Gráficos",
      "menu-date-pickers": "Fecha y hora",
      "menu-plugins": "Complementos",
      "menu-forms": "Formularios",
      "menu-apps": "Aplicaciones",
      "menu-pages": "Páginas",
      "menu-docs": "Documentación",
      "menu-help": "Ayuda",
      "menu-documentation": "Arquitectura",
    },
  },
  ar: {
    translation: {
      "menu-dashboards": "لوحات التحكم",
      "menu-dashboard-default": "نظرة عامة تنفيذية",
      "menu-dashboard-analytics": "التحليلات",
      "menu-dashboard-commerce": "التجارة الإلكترونية",
      "menu-dashboard-finance": "المالية",
      "menu-components": "مكونات الواجهة",
      "menu-data-grid": "شبكة البيانات",
      "menu-charts": "الرسوم البيانية",
      "menu-date-pickers": "التاريخ والوقت",
      "menu-plugins": "الإضافات",
      "menu-forms": "النماذج والتحقق",
      "menu-apps": "التطبيقات",
      "menu-pages": "الصفحات",
      "menu-docs": "التوثيق",
      "menu-help": "الدعم",
      "menu-documentation": "المعمارية والأدلة",
    },
  },
};

export class ShowcaseI18nState {
  private instance: i18n;
  locale = $state("en");

  constructor() {
    this.instance = i18next.createInstance();
    void this.instance.init({
      lng: "en",
      fallbackLng: "en",
      resources,
      interpolation: { escapeValue: false },
    });
  }

  t = (key: string): string => {
    void this.locale;
    return this.instance.t(key);
  };

  setLocale = (code: string): "ltr" | "rtl" => {
    const valid = SHOWCASE_LOCALES.find((l) => l.code === code) ?? SHOWCASE_LOCALES[0];
    this.locale = valid.code;
    void this.instance.changeLanguage(valid.code);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("coimui-showcase-locale", valid.code);
      } catch {
        // Ignore storage restrictions
      }
    }
    return valid.dir;
  };
}

export const showcaseI18n = new ShowcaseI18nState();
