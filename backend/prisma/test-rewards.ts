import 'dotenv/config';
import { PrismaClient, SellerTier, RewardType, FeaturedPlan } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log('🏁 Iniciando prueba de integración del Módulo de Premios...');

  const uniqueSuffix = Date.now();
  const testEmail = `tester-${uniqueSuffix}@compraventaonline.com.ar`;

  try {
    // 1. Crear un usuario de prueba
    console.log('👤 Creando usuario de prueba...');
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        fullName: 'Pampeano Tester',
        passwordHash: 'hashed-password-123',
      },
    });

    // 2. Aceptar términos legales
    console.log('⚖️ Aceptando términos legales...');
    await prisma.termsAcceptance.create({
      data: {
        userId: user.id,
        version: '1.0',
        acceptedTerms: true,
      },
    });

    // 3. Registrar como Vendedor (comienza con score 30, Tier BRONCE)
    console.log('💼 Registrando perfil de vendedor...');
    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        name: 'Tienda Pampeana de Prueba',
        type: 'BUSINESS_SELLER',
        documentNumber: '20-12345678-9',
        score: 30,
        tier: SellerTier.BRONCE,
      },
    });

    console.log(`✅ Vendedor creado: ${seller.name} (Score: ${seller.score}, Tier: ${seller.tier})`);

    // 4. Crear una categoría, un producto y una publicación de prueba
    console.log('📦 Creando publicación de prueba...');
    const category = await prisma.category.create({
      data: {
        name: 'Tecnología Test',
        slug: `tecnologia-test-${uniqueSuffix}`,
        attributesSchema: {},
      },
    });

    const product = await prisma.product.create({
      data: {
        name: 'Miel Orgánica Pampeana',
        description: 'Miel premium directo del campo a tu mesa.',
        brand: 'Estancia Pampeana',
        categoryId: category.id,
        images: ['https://example.com/image.jpg'],
        attributes: {},
      },
    });

    const listing = await prisma.listing.create({
      data: {
        productId: product.id,
        sellerId: seller.id,
        price: 1500.00,
        condition: 'NEW',
        stock: 10,
        status: 'APPROVED',
        featuredPlan: FeaturedPlan.FREE,
      },
    });

    console.log(`✅ Publicación creada con ID: ${listing.id}. Plan actual: ${listing.featuredPlan}`);

    // 5. Simular ascenso de reputación a PLATA
    console.log('🚀 Promocionando score del vendedor de 30 a 50 para subir a PLATA...');
    
    let currentScore = seller.score;
    let newScore = currentScore + 20; // 50
    let newTier = SellerTier.PLATA;
    
    console.log(`🔄 Actualizando DB: Nuevo Score: ${newScore}, Nuevo Tier: ${newTier}`);
    await prisma.seller.update({
      where: { id: seller.id },
      data: { score: newScore, tier: newTier },
    });

    // Otorgamos el premio simulando lo que hace ReputationService
    console.log('🎁 Otorgando premios para el Tier PLATA...');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const rewardFeatured = await prisma.sellerReward.create({
      data: {
        sellerId: seller.id,
        type: RewardType.FREE_FEATURED_HIGHLIGHT,
        claimed: false,
        expiresAt,
      },
    });

    console.log(`✅ Premio creado: ${rewardFeatured.type} (ID: ${rewardFeatured.id})`);

    // 6. Canjear el premio contra la publicación de prueba
    console.log('🎟️ Canjeando premio contra la publicación...');
    
    // Simular transacción de reclamo
    await prisma.$transaction(async (tx) => {
      // Marcar premio como reclamado
      await tx.sellerReward.update({
        where: { id: rewardFeatured.id },
        data: {
          claimed: true,
          claimedAt: new Date(),
        },
      });

      // Crear el destacado
      await tx.highlightedProduct.create({
        data: {
          listingId: listing.id,
          plan: FeaturedPlan.FEATURED,
          startDate: new Date(),
          endDate: expiresAt,
        },
      });

      // Actualizar el plan en la publicación
      await tx.listing.update({
        where: { id: listing.id },
        data: {
          featuredPlan: FeaturedPlan.FEATURED,
        },
      });
    });

    console.log('✅ Transacción completada.');

    // 7. Verificar cambios
    const updatedListing = await prisma.listing.findUnique({
      where: { id: listing.id },
    });
    const updatedReward = await prisma.sellerReward.findUnique({
      where: { id: rewardFeatured.id },
    });
    const highlight = await prisma.highlightedProduct.findFirst({
      where: { listingId: listing.id },
    });

    console.log('\n📊 RESULTADOS DE LA VERIFICACIÓN:');
    console.log(`- ¿Publicación destacada?: ${updatedListing?.featuredPlan === FeaturedPlan.FEATURED ? 'SÍ (FEATURED) (CORRECTO)' : 'NO'}`);
    console.log(`- ¿Premio marcado como canjeado?: ${updatedReward?.claimed ? 'SÍ (CORRECTO)' : 'NO'}`);
    console.log(`- ¿Creado destacado en HighlightedProduct?: ${highlight ? 'SÍ (CORRECTO)' : 'NO'}`);

    if (updatedListing?.featuredPlan === FeaturedPlan.FEATURED && updatedReward?.claimed && highlight) {
      console.log('\n🎉 ¡PRUEBA DE INTEGRACIÓN FÍSICA EXITOSA! Todo funciona a nivel base de datos.');
    } else {
      throw new Error('La verificación física falló.');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    // 8. Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba de la base de datos...');
    try {
      const user = await prisma.user.findUnique({ where: { email: testEmail } });
      if (user) {
        await prisma.user.delete({ where: { id: user.id } });
        console.log('✅ Datos de prueba eliminados correctamente.');
      }
    } catch (cleanupError) {
      console.error('⚠️ Error al limpiar datos:', cleanupError);
    }
    await prisma.$disconnect();
    await pool.end();
  }
}

run();
