import i18next, { type i18n } from "i18next";

export const SUPPORTED_LOCALES = [
  { code: "en", label: "English", shortCode: "EN", dir: "ltr" as const },
  { code: "de", label: "Deutsch", shortCode: "DE", dir: "ltr" as const },
  { code: "fr", label: "Français", shortCode: "FR", dir: "ltr" as const },
  { code: "es", label: "Español", shortCode: "ES", dir: "ltr" as const },
  { code: "ar", label: "العربية", shortCode: "AR", dir: "rtl" as const },
];

const resources = {
  en: {
    translation: {
      "nav-overview": "Overview",
      "nav-dashboard": "Starter Dashboard",
      "nav-projects": "Projects",
      "nav-forms": "Validated Forms",
      "nav-settings": "Settings",
      "nav-auth": "Authentication",
      "nav-sign-in": "Sign In",
      "nav-sign-up": "Sign Up",
      "nav-forgot-password": "Forgot Password",
      "hero-title": "CoimUI Starter Workspace",
      "hero-subtitle": "Production-ready Svelte 5 & SvelteKit 3 administrative foundation with lean core bundle isolation.",
      "kpi-revenue": "Monthly Recurring Revenue",
      "kpi-customers": "Active Accounts",
      "kpi-conversion": "Conversion Rate",
      "kpi-uptime": "Platform Availability",
      "quick-create": "New Project",
      "recent-activity": "Recent Workspace Activity",
      "menu-help": "Documentation",
      "menu-documentation": "Starter Guide",
    },
  },
  de: {
    translation: {
      "nav-overview": "Übersicht",
      "nav-dashboard": "Starter-Dashboard",
      "nav-projects": "Projekte",
      "nav-forms": "Formulare",
      "nav-settings": "Einstellungen",
      "nav-auth": "Authentifizierung",
      "nav-sign-in": "Anmelden",
      "nav-sign-up": "Registrieren",
      "nav-forgot-password": "Passwort vergessen",
      "hero-title": "CoimUI Starter-Arbeitsbereich",
      "hero-subtitle": "Produktionsreife Svelte 5 & SvelteKit 3 Verwaltungsgrundlage mit schlankem Kernpaket.",
      "kpi-revenue": "Monatlicher Umsatz",
      "kpi-customers": "Aktive Konten",
      "kpi-conversion": "Konversionsrate",
      "kpi-uptime": "Verfügbarkeit",
      "quick-create": "Neues Projekt",
      "recent-activity": "Aktuelle Aktivitäten",
      "menu-help": "Dokumentation",
      "menu-documentation": "Leitfaden",
    },
  },
  fr: {
    translation: {
      "nav-overview": "Aperçu",
      "nav-dashboard": "Tableau de bord",
      "nav-projects": "Projets",
      "nav-forms": "Formulaires",
      "nav-settings": "Paramètres",
      "nav-auth": "Authentification",
      "nav-sign-in": "Connexion",
      "nav-sign-up": "Inscription",
      "nav-forgot-password": "Mot de passe oublié",
      "hero-title": "Espace de démarrage CoimUI",
      "hero-subtitle": "Base d'administration Svelte 5 et SvelteKit 3 prête pour la production.",
      "kpi-revenue": "Revenu mensuel",
      "kpi-customers": "Comptes actifs",
      "kpi-conversion": "Taux de conversion",
      "kpi-uptime": "Disponibilité",
      "quick-create": "Nouveau projet",
      "recent-activity": "Activité récente",
      "menu-help": "Documentation",
      "menu-documentation": "Guide",
    },
  },
  es: {
    translation: {
      "nav-overview": "Resumen",
      "nav-dashboard": "Panel inicial",
      "nav-projects": "Proyectos",
      "nav-forms": "Formularios",
      "nav-settings": "Configuración",
      "nav-auth": "Autenticación",
      "nav-sign-in": "Iniciar sesión",
      "nav-sign-up": "Registrarse",
      "nav-forgot-password": "Olvidé mi contraseña",
      "hero-title": "Espacio inicial CoimUI",
      "hero-subtitle": "Base administrativa Svelte 5 y SvelteKit 3 lista para producción.",
      "kpi-revenue": "Ingresos mensuales",
      "kpi-customers": "Cuentas activas",
      "kpi-conversion": "Tasa de conversión",
      "kpi-uptime": "Disponibilidad",
      "quick-create": "Nuevo proyecto",
      "recent-activity": "Actividad reciente",
      "menu-help": "Documentación",
      "menu-documentation": "Guía inicial",
    },
  },
  ar: {
    translation: {
      "nav-overview": "نظرة عامة",
      "nav-dashboard": "لوحة البداية",
      "nav-projects": "المشاريع",
      "nav-forms": "النماذج المعتمدة",
      "nav-settings": "الإعدادات",
      "nav-auth": "المصادقة",
      "nav-sign-in": "تسجيل الدخول",
      "nav-sign-up": "إنشاء حساب",
      "nav-forgot-password": "استعادة كلمة المرور",
      "hero-title": "بيئة العمل الأساسية CoimUI",
      "hero-subtitle": "أساس إداري جاهز للإنتاج مبني بتقنية Svelte 5 و SvelteKit 3.",
      "kpi-revenue": "الإيراد الشهري المتكرر",
      "kpi-customers": "الحسابات النشطة",
      "kpi-conversion": "معدل التحويل",
      "kpi-uptime": "توافر المنصة",
      "quick-create": "مشروع جديد",
      "recent-activity": "أحدث الأنشطة",
      "menu-help": "التوثيق",
      "menu-documentation": "دليل البداية",
    },
  },
};

export class I18nState {
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
    const valid = SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0];
    this.locale = valid.code;
    void this.instance.changeLanguage(valid.code);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("coimui-starter-locale", valid.code);
      } catch {
        // Ignore storage restrictions
      }
    }
    return valid.dir;
  };
}

export const starterI18n = new I18nState();
