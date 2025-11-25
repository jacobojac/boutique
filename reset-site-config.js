const { PrismaClient } = require('./src/lib/generated/prisma');

const prisma = new PrismaClient();

async function resetSiteConfig() {
  try {
    // Supprimer toutes les entrées existantes
    console.log('Suppression de toutes les configurations existantes...');
    await prisma.siteConfig.deleteMany({});

    // Nouvelles données de defaultConfigs
    const defaultConfigs = [
      // Hero Section
      {
        key: "homepage_hero_image",
        value: "/images/banniere.png",
        type: "image",
        section: "homepage",
        description: "Image principale de la page d'accueil",
      },
      {
        key: "homepage_hero_title",
        value: "Ta personnalité mérite le meilleur style",
        type: "text",
        section: "homepage",
        description: "Titre principal de la page d'accueil",
      },
      {
        key: "homepage_hero_subtitle",
        value: "Nouvelle Collection",
        type: "text",
        section: "homepage",
        description: "Sous-titre de la page d'accueil",
      },
      {
        key: "homepage_hero_button_text",
        value: "Découvrir la collection",
        type: "text",
        section: "homepage",
        description: "Texte du bouton",
      },

      // Categories
      {
        key: "category_homme_image",
        value: "/images/category-homme.jpg",
        type: "image",
        section: "categories",
        description: "Image de la catégorie Homme",
      },
      {
        key: "category_femme_image",
        value: "/images/category-femme.jpg",
        type: "image",
        section: "categories",
        description: "Image de la catégorie Femme",
      },

      // Promo Section
      {
        key: "promo_section_image",
        value: "/images/promo-background.jpg",
        type: "image",
        section: "promo",
        description: "Image de fond de la section promotionnelle",
      },
      {
        key: "promo_section_title",
        value: "LIMITED OFFER",
        type: "text",
        section: "promo",
        description: "Titre de la section promotionnelle",
      },
      {
        key: "promo_section_description",
        value: "Des arrivages permanents pour tous les goûts.",
        type: "text",
        section: "promo",
        description: "Description de la section promotionnelle",
      },
    ];

    // Ajouter toutes les nouvelles configurations
    console.log(`Ajout de ${defaultConfigs.length} nouvelles configurations...`);
    
    for (const config of defaultConfigs) {
      await prisma.siteConfig.create({
        data: config
      });
    }

    console.log('✅ Toutes les configurations ont été réinitialisées avec succès');
    
    // Afficher un résumé
    const count = await prisma.siteConfig.count();
    console.log(`📊 Total des configurations : ${count}`);

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetSiteConfig();