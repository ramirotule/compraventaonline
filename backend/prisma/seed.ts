import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de categorías...');

  // Limpiar categorías existentes
  await prisma.category.deleteMany({});

  const categoriesData = [
    {
      name: 'Tecnología',
      slug: 'tecnologia',
      attributesSchema: {},
      subcategories: [
        {
          name: 'Celulares',
          slug: 'celulares',
          attributesSchema: {
            required: ['brand', 'ram', 'storage'],
            properties: {
              brand: { type: 'string', enum: ['Apple', 'Samsung', 'Motorola', 'Xiaomi', 'Otro'] },
              ram: { type: 'string', enum: ['2GB', '4GB', '6GB', '8GB', '12GB', 'Otro'] },
              storage: { type: 'string', enum: ['32GB', '64GB', '128GB', '256GB', '512GB', 'Otro'] },
            },
          },
        },
        {
          name: 'Computadoras',
          slug: 'computadoras',
          attributesSchema: {
            required: ['processor', 'ram', 'storage_type'],
            properties: {
              processor: { type: 'string', enum: ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1/M2/M3', 'Otro'] },
              ram: { type: 'string', enum: ['4GB', '8GB', '16GB', '32GB', 'Otro'] },
              storage_type: { type: 'string', enum: ['SSD', 'HDD', 'Híbrido'] },
            },
          },
        },
        { name: 'Consolas', slug: 'consolas', attributesSchema: {} },
        { name: 'Accesorios', slug: 'accesorios-tecnologia', attributesSchema: {} },
      ],
    },
    {
      name: 'Hogar',
      slug: 'hogar',
      attributesSchema: {},
      subcategories: [
        { name: 'Muebles', slug: 'muebles', attributesSchema: {} },
        { name: 'Electrodomésticos', slug: 'electrodomesticos', attributesSchema: {} },
        { name: 'Decoración', slug: 'decoracion', attributesSchema: {} },
      ],
    },
    {
      name: 'Vehículos',
      slug: 'vehiculos',
      attributesSchema: {},
      subcategories: [
        {
          name: 'Autos',
          slug: 'autos',
          attributesSchema: {
            required: ['year', 'kilometers', 'transmission'],
            properties: {
              year: { type: 'number', minimum: 1900, maximum: 2027 },
              kilometers: { type: 'number', minimum: 0 },
              transmission: { type: 'string', enum: ['Manual', 'Automática'] },
            },
          },
        },
        {
          name: 'Motos',
          slug: 'motos',
          attributesSchema: {
            required: ['year', 'engine_displacement'],
            properties: {
              year: { type: 'number', minimum: 1900, maximum: 2027 },
              engine_displacement: { type: 'string' }, // Ej: "150cc"
            },
          },
        },
        { name: 'Camiones', slug: 'camiones', attributesSchema: {} },
        { name: 'Repuestos', slug: 'repuestos', attributesSchema: {} },
      ],
    },
    {
      name: 'Campo / Agro',
      slug: 'campo-agro',
      attributesSchema: {},
      subcategories: [
        { name: 'Maquinaria', slug: 'maquinaria', attributesSchema: {} },
        { name: 'Herramientas', slug: 'herramientas-campo', attributesSchema: {} },
        { name: 'Animales', slug: 'animales', attributesSchema: {} },
        { name: 'Insumos', slug: 'insumos-campo', attributesSchema: {} },
      ],
    },
    {
      name: 'Construcción',
      slug: 'construccion',
      attributesSchema: {},
      subcategories: [
        { name: 'Materiales', slug: 'materiales-construccion', attributesSchema: {} },
        { name: 'Herramientas', slug: 'herramientas-construccion', attributesSchema: {} },
      ],
    },
    {
      name: 'Moda',
      slug: 'moda',
      attributesSchema: {},
      subcategories: [
        { name: 'Ropa', slug: 'ropa', attributesSchema: {} },
        { name: 'Calzado', slug: 'calzado', attributesSchema: {} },
        { name: 'Accesorios', slug: 'accesorios-moda', attributesSchema: {} },
      ],
    },
    {
      name: 'Servicios',
      slug: 'servicios',
      attributesSchema: {},
      subcategories: [
        { name: 'Profesionales', slug: 'profesionales', attributesSchema: {} },
        { name: 'Técnicos', slug: 'tecnicos', attributesSchema: {} },
        { name: 'Transporte', slug: 'transporte', attributesSchema: {} },
      ],
    },
    {
      name: 'Coleccionables',
      slug: 'coleccionables',
      attributesSchema: {},
      subcategories: [
        { name: 'Antigüedades', slug: 'antiguedades', attributesSchema: {} },
        { name: 'Hobby', slug: 'hobby', attributesSchema: {} },
      ],
    },
  ];

  for (const rootCat of categoriesData) {
    const parent = await prisma.category.create({
      data: {
        name: rootCat.name,
        slug: rootCat.slug,
        attributesSchema: rootCat.attributesSchema,
      },
    });

    console.log(`Creada categoría raíz: ${parent.name}`);

    for (const subCat of rootCat.subcategories) {
      await prisma.category.create({
        data: {
          name: subCat.name,
          slug: subCat.slug,
          parentId: parent.id,
          attributesSchema: subCat.attributesSchema,
        },
      });
      console.log(`  -> Creada subcategoría: ${subCat.name}`);
    }
  }

  console.log('Seed de categorías completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
