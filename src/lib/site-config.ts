import { nodePrisma as prisma } from "@/lib/prisma/node-client";

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  section: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Cache pour éviter trop de requêtes à la base de données
const configCache = new Map<
  string,
  { value: string | null; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSiteConfig(key: string): Promise<string | null> {
  // Vérifier le cache
  const cached = configCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.value;
  }

  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key },
    });

    const value = config?.value || null;

    // Mettre en cache
    configCache.set(key, {
      value,
      timestamp: Date.now(),
    });

    return value;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key}:`, error);
    return null;
  }
}

export async function getSiteConfigs(section?: string): Promise<SiteConfig[]> {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: section ? { section } : undefined,
      orderBy: {
        key: "asc",
      },
    });

    return configs;
  } catch (error) {
    console.error("Erreur lors de la récupération des configurations:", error);
    return [];
  }
}

export async function setSiteConfig(
  key: string,
  value: string,
  type: string = "text",
  section: string = "general",
  description: string | null = null
): Promise<SiteConfig | null> {
  try {
    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: {
        value,
        type,
        section,
        description,
      },
      create: {
        key,
        value,
        type,
        section,
        description,
      },
    });

    // Vider le cache pour cette clé
    configCache.delete(key);

    return config;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    return null;
  }
}

// Fonction utilitaire pour obtenir plusieurs configurations en une fois
export async function getHomepageConfig() {
  try {
    const configs = await getSiteConfigs("homepage");

    // Transformer en objet pour un accès plus facile
    const configMap: Record<string, string> = {};
    configs.forEach((config) => {
      configMap[config.key] = config.value;
    });

    return {
      heroTitle:
        configMap["homepage_hero_title"] || "Bienvenue dans notre boutique",
      heroSubtitle:
        configMap["homepage_hero_subtitle"] ||
        "Découvrez nos collections exclusives",
      heroImage: configMap["homepage_hero_image"] || "/images/hero-default.jpg",
      featuredTitle:
        configMap["homepage_featured_title"] || "Nos dernières nouveautés",
      featuredDescription:
        configMap["homepage_featured_description"] ||
        "Découvrez notre sélection exclusive des dernières tendances",
    };
  } catch (error) {
    console.error(
      "Erreur lors du chargement de la configuration homepage:",
      error
    );
    return {
      heroTitle: "Bienvenue dans notre boutique",
      heroSubtitle: "Découvrez nos collections exclusives",
      heroImage: "/images/hero-default.jpg",
      featuredTitle: "Nos dernières nouveautés",
      featuredDescription:
        "Découvrez notre sélection exclusive des dernières tendances",
    };
  }
}

// Interface pour les items du menu de navigation
export interface NavMenuItem {
  id: string;
  collectionSlug: string;
}

export interface NavMenuItemWithCollection {
  id: string;
  collectionSlug: string;
  collectionNom: string;
}

// Fonction pour récupérer les menus de navigation avec les noms des collections
export async function getNavigationMenus(): Promise<{
  menuHomme: NavMenuItemWithCollection[];
  menuFemme: NavMenuItemWithCollection[];
}> {
  try {
    // Récupérer les configurations des menus
    const [menuHommeConfig, menuFemmeConfig] = await Promise.all([
      getSiteConfig("menu_homme"),
      getSiteConfig("menu_femme"),
    ]);

    // Parser les JSON
    const menuHommeItems: NavMenuItem[] = menuHommeConfig
      ? JSON.parse(menuHommeConfig)
      : [];
    const menuFemmeItems: NavMenuItem[] = menuFemmeConfig
      ? JSON.parse(menuFemmeConfig)
      : [];

    // Récupérer tous les slugs uniques
    const allSlugs = [
      ...new Set([
        ...menuHommeItems.map((item) => item.collectionSlug),
        ...menuFemmeItems.map((item) => item.collectionSlug),
      ]),
    ];

    // Récupérer les collections correspondantes
    const collections = await prisma.collection.findMany({
      where: {
        slug: {
          in: allSlugs,
        },
      },
      select: {
        slug: true,
        nom: true,
      },
    });

    // Créer un map slug -> nom
    const collectionMap = new Map(collections.map((c) => [c.slug, c.nom]));

    // Construire les menus avec les noms des collections
    const menuHomme: NavMenuItemWithCollection[] = menuHommeItems.map(
      (item) => ({
        id: item.id,
        collectionSlug: item.collectionSlug,
        collectionNom:
          collectionMap.get(item.collectionSlug) || item.collectionSlug,
      })
    );

    const menuFemme: NavMenuItemWithCollection[] = menuFemmeItems.map(
      (item) => ({
        id: item.id,
        collectionSlug: item.collectionSlug,
        collectionNom:
          collectionMap.get(item.collectionSlug) || item.collectionSlug,
      })
    );

    return { menuHomme, menuFemme };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des menus de navigation:",
      error
    );
    return { menuHomme: [], menuFemme: [] };
  }
}

// Vider le cache (utile pour les tests ou l'administration)
export function clearConfigCache() {
  configCache.clear();
}
