// argentinaData.ts — Provincias y ciudades de Argentina con códigos postales
// Nota: En CABA/AMBA el CP varía por barrio/calle (CPA). Para evitar errores, se deja `codigoPostal: ""`.
// En el interior del país se cargan CP clásicos (4 dígitos) para capitales y ciudades grandes.

export interface Ciudad {
  id: number;
  nombre: string;
  provinciaId: number;
  codigoPostal: string;
}

export interface Provincia {
  id: number;
  nombre: string;
  ciudades: Ciudad[];
}

export const provinciasConCiudades: Provincia[] = [
  {
    id: 1,
    nombre: "Buenos Aires",
    ciudades: [
      { id: 1, nombre: "La Plata", provinciaId: 1, codigoPostal: "1900" },
      { id: 2, nombre: "Mar del Plata", provinciaId: 1, codigoPostal: "7600" },
      { id: 3, nombre: "Bahía Blanca", provinciaId: 1, codigoPostal: "8000" },
      { id: 4, nombre: "Tandil", provinciaId: 1, codigoPostal: "7000" },
      { id: 5, nombre: "Olavarría", provinciaId: 1, codigoPostal: "7400" },
      { id: 6, nombre: "Pergamino", provinciaId: 1, codigoPostal: "2700" },
      { id: 7, nombre: "San Nicolás de los Arroyos", provinciaId: 1, codigoPostal: "2900" },
      { id: 8, nombre: "Junín", provinciaId: 1, codigoPostal: "6000" },
      { id: 9, nombre: "Azul", provinciaId: 1, codigoPostal: "7300" },
      { id: 10, nombre: "Necochea", provinciaId: 1, codigoPostal: "7630" },
      { id: 11, nombre: "Luján", provinciaId: 1, codigoPostal: "6700" },
      { id: 12, nombre: "Campana", provinciaId: 1, codigoPostal: "2804" },
      { id: 13, nombre: "Zárate", provinciaId: 1, codigoPostal: "2800" },

      // AMBA (sin CP por variación por barrio)
      { id: 14, nombre: "Tigre", provinciaId: 1, codigoPostal: "" },
      { id: 15, nombre: "San Fernando", provinciaId: 1, codigoPostal: "" },
      { id: 16, nombre: "Vicente López", provinciaId: 1, codigoPostal: "" },
      { id: 17, nombre: "San Isidro", provinciaId: 1, codigoPostal: "" },
      { id: 18, nombre: "Quilmes", provinciaId: 1, codigoPostal: "" },
      { id: 19, nombre: "Lanús", provinciaId: 1, codigoPostal: "" },
      { id: 20, nombre: "Avellaneda", provinciaId: 1, codigoPostal: "" },
      { id: 21, nombre: "Lomas de Zamora", provinciaId: 1, codigoPostal: "" },
      { id: 22, nombre: "Banfield", provinciaId: 1, codigoPostal: "" },
      { id: 23, nombre: "Berazategui", provinciaId: 1, codigoPostal: "" },
      { id: 24, nombre: "Florencio Varela", provinciaId: 1, codigoPostal: "" },
      { id: 25, nombre: "Esteban Echeverría (Monte Grande)", provinciaId: 1, codigoPostal: "" },
      { id: 26, nombre: "Morón", provinciaId: 1, codigoPostal: "" },
      { id: 27, nombre: "Tres de Febrero (Caseros)", provinciaId: 1, codigoPostal: "" },
      { id: 28, nombre: "San Martín (GBA)", provinciaId: 1, codigoPostal: "" },
      { id: 29, nombre: "Malvinas Argentinas (Grand Bourg)", provinciaId: 1, codigoPostal: "" },
      { id: 30, nombre: "José C. Paz", provinciaId: 1, codigoPostal: "" },
      { id: 31, nombre: "Moreno", provinciaId: 1, codigoPostal: "" },
      { id: 32, nombre: "Merlo", provinciaId: 1, codigoPostal: "" },
      { id: 33, nombre: "Hurlingham", provinciaId: 1, codigoPostal: "" },
      { id: 34, nombre: "Ituzaingó", provinciaId: 1, codigoPostal: "" },
      { id: 35, nombre: "La Matanza (San Justo)", provinciaId: 1, codigoPostal: "" },
      { id: 36, nombre: "Ezeiza", provinciaId: 1, codigoPostal: "" },
      { id: 37, nombre: "Almirante Brown (Adrogué)", provinciaId: 1, codigoPostal: "" },
      { id: 38, nombre: "Presidente Perón (Guernica)", provinciaId: 1, codigoPostal: "" },

      // Interior bonaerense agregado
      { id: 226, nombre: "Pinamar", provinciaId: 1, codigoPostal: "7167" },
      { id: 227, nombre: "Villa Gesell", provinciaId: 1, codigoPostal: "7165" },
      { id: 228, nombre: "Chivilcoy", provinciaId: 1, codigoPostal: "6620" },
      { id: 229, nombre: "Trenque Lauquen", provinciaId: 1, codigoPostal: "6400" },
      { id: 230, nombre: "Chacabuco", provinciaId: 1, codigoPostal: "6740" },
      { id: 231, nombre: "Lincoln", provinciaId: 1, codigoPostal: "6070" },
      { id: 232, nombre: "Balcarce", provinciaId: 1, codigoPostal: "7620" },
      { id: 233, nombre: "Dolores", provinciaId: 1, codigoPostal: "7100" },
      { id: 234, nombre: "Coronel Suárez", provinciaId: 1, codigoPostal: "7540" }
    ]
  },
  {
    id: 2,
    nombre: "CABA",
    ciudades: [
      // CP varía por barrio/calle: usar CPA (Cxxxxxxx). Se deja vacío.
      { id: 39, nombre: "Comuna 1 (Retiro, San Nicolás, Puerto Madero, San Telmo, Montserrat, Constitución)", provinciaId: 2, codigoPostal: "" },
      { id: 40, nombre: "Comuna 2 (Recoleta)", provinciaId: 2, codigoPostal: "" },
      { id: 41, nombre: "Comuna 3 (Balvanera, San Cristóbal)", provinciaId: 2, codigoPostal: "" },
      { id: 42, nombre: "Comuna 4 (La Boca, Barracas, Parque Patricios, Nueva Pompeya)", provinciaId: 2, codigoPostal: "" },
      { id: 43, nombre: "Comuna 5 (Almagro, Boedo)", provinciaId: 2, codigoPostal: "" },
      { id: 44, nombre: "Comuna 6 (Caballito)", provinciaId: 2, codigoPostal: "" },
      { id: 45, nombre: "Comuna 7 (Flores, Parque Chacabuco)", provinciaId: 2, codigoPostal: "" },
      { id: 46, nombre: "Comuna 8 (Villa Soldati, Villa Riachuelo, Villa Lugano)", provinciaId: 2, codigoPostal: "" },
      { id: 47, nombre: "Comuna 9 (Liniers, Mataderos, Parque Avellaneda)", provinciaId: 2, codigoPostal: "" },
      { id: 48, nombre: "Comuna 10 (Villa Real, Monte Castro, Versalles, Floresta, Vélez Sársfield, Villa Luro)", provinciaId: 2, codigoPostal: "" },
      { id: 49, nombre: "Comuna 11 (Villa General Mitre, Villa Devoto, Villa del Pino, Villa Santa Rita)", provinciaId: 2, codigoPostal: "" },
      { id: 50, nombre: "Comuna 12 (Coghlan, Saavedra, Villa Urquiza, Villa Pueyrredón)", provinciaId: 2, codigoPostal: "" },
      { id: 51, nombre: "Comuna 13 (Núñez, Belgrano, Colegiales)", provinciaId: 2, codigoPostal: "" },
      { id: 52, nombre: "Comuna 14 (Palermo)", provinciaId: 2, codigoPostal: "" },
      { id: 53, nombre: "Comuna 15 (Chacarita, Villa Crespo, Villa Ortúzar, Agronomía, Paternal)", provinciaId: 2, codigoPostal: "" }
    ]
  },
  {
    id: 3,
    nombre: "Córdoba",
    ciudades: [
      { id: 54, nombre: "Córdoba Capital", provinciaId: 3, codigoPostal: "5000" },
      { id: 55, nombre: "Villa Carlos Paz", provinciaId: 3, codigoPostal: "5152" },
      { id: 56, nombre: "Río Cuarto", provinciaId: 3, codigoPostal: "5800" },
      { id: 57, nombre: "San Francisco", provinciaId: 3, codigoPostal: "2400" },
      { id: 58, nombre: "Villa María", provinciaId: 3, codigoPostal: "5900" },
      { id: 59, nombre: "Jesús María", provinciaId: 3, codigoPostal: "5220" },
      { id: 60, nombre: "Alta Gracia", provinciaId: 3, codigoPostal: "5186" },
      { id: 61, nombre: "Bell Ville", provinciaId: 3, codigoPostal: "2550" },
      { id: 62, nombre: "Marcos Juárez", provinciaId: 3, codigoPostal: "2580" },
      { id: 63, nombre: "Villa Dolores", provinciaId: 3, codigoPostal: "5870" },
      { id: 64, nombre: "La Falda", provinciaId: 3, codigoPostal: "5172" },
      { id: 65, nombre: "Cosquín", provinciaId: 3, codigoPostal: "5166" },
      { id: 66, nombre: "Cruz del Eje", provinciaId: 3, codigoPostal: "5280" },
      { id: 67, nombre: "Deán Funes", provinciaId: 3, codigoPostal: "5200" },
      { id: 68, nombre: "Laboulaye", provinciaId: 3, codigoPostal: "6120" },

      { id: 235, nombre: "Río Tercero", provinciaId: 3, codigoPostal: "5850" },
      { id: 236, nombre: "Villa General Belgrano", provinciaId: 3, codigoPostal: "5194" }
    ]
  },
  {
    id: 4,
    nombre: "Santa Fe",
    ciudades: [
      { id: 69, nombre: "Santa Fe Capital", provinciaId: 4, codigoPostal: "3000" },
      { id: 70, nombre: "Rosario", provinciaId: 4, codigoPostal: "2000" },
      { id: 71, nombre: "Rafaela", provinciaId: 4, codigoPostal: "2300" },
      { id: 72, nombre: "Reconquista", provinciaId: 4, codigoPostal: "3560" },
      { id: 73, nombre: "Venado Tuerto", provinciaId: 4, codigoPostal: "2600" },
      { id: 74, nombre: "Esperanza", provinciaId: 4, codigoPostal: "3080" },
      { id: 75, nombre: "San Lorenzo", provinciaId: 4, codigoPostal: "2200" },
      { id: 76, nombre: "Villa Constitución", provinciaId: 4, codigoPostal: "" },
      { id: 77, nombre: "Casilda", provinciaId: 4, codigoPostal: "" },
      { id: 78, nombre: "Funes", provinciaId: 4, codigoPostal: "" },
      { id: 79, nombre: "Villa Gobernador Gálvez", provinciaId: 4, codigoPostal: "" },
      { id: 80, nombre: "Capitán Bermúdez", provinciaId: 4, codigoPostal: "" },

      { id: 237, nombre: "Sunchales", provinciaId: 4, codigoPostal: "2322" },
      { id: 238, nombre: "Cañada de Gómez", provinciaId: 4, codigoPostal: "2500" },
      { id: 239, nombre: "San Justo", provinciaId: 4, codigoPostal: "3040" }
    ]
  },
  {
    id: 5,
    nombre: "Mendoza",
    ciudades: [
      { id: 81, nombre: "Mendoza Capital", provinciaId: 5, codigoPostal: "5500" },
      { id: 82, nombre: "San Rafael", provinciaId: 5, codigoPostal: "5600" },
      { id: 83, nombre: "Godoy Cruz", provinciaId: 5, codigoPostal: "" },
      { id: 84, nombre: "Guaymallén", provinciaId: 5, codigoPostal: "" },
      { id: 85, nombre: "Las Heras", provinciaId: 5, codigoPostal: "" },
      { id: 86, nombre: "Luján de Cuyo", provinciaId: 5, codigoPostal: "" },
      { id: 87, nombre: "Maipú", provinciaId: 5, codigoPostal: "" },
      { id: 88, nombre: "San Martín", provinciaId: 5, codigoPostal: "" },
      { id: 89, nombre: "Rivadavia", provinciaId: 5, codigoPostal: "" },
      { id: 90, nombre: "Junín", provinciaId: 5, codigoPostal: "" },
      { id: 91, nombre: "Tupungato", provinciaId: 5, codigoPostal: "" },
      { id: 92, nombre: "Malargüe", provinciaId: 5, codigoPostal: "" },

      { id: 240, nombre: "Tunuyán", provinciaId: 5, codigoPostal: "" },
      { id: 241, nombre: "General Alvear", provinciaId: 5, codigoPostal: "" }
    ]
  },
  {
    id: 6,
    nombre: "Tucumán",
    ciudades: [
      { id: 93, nombre: "San Miguel de Tucumán", provinciaId: 6, codigoPostal: "4000" },
      { id: 94, nombre: "Banda del Río Salí", provinciaId: 6, codigoPostal: "" },
      { id: 95, nombre: "Concepción", provinciaId: 6, codigoPostal: "" },
      { id: 96, nombre: "Tafí Viejo", provinciaId: 6, codigoPostal: "" },
      { id: 97, nombre: "Yerba Buena", provinciaId: 6, codigoPostal: "" },
      { id: 98, nombre: "Famaillá", provinciaId: 6, codigoPostal: "" },
      { id: 99, nombre: "Monteros", provinciaId: 6, codigoPostal: "" },
      { id: 100, nombre: "Aguilares", provinciaId: 6, codigoPostal: "" },
      { id: 101, nombre: "Bella Vista", provinciaId: 6, codigoPostal: "" },
      { id: 102, nombre: "Simoca", provinciaId: 6, codigoPostal: "" },

      { id: 242, nombre: "Trancas", provinciaId: 6, codigoPostal: "" },
      { id: 243, nombre: "Tafí del Valle", provinciaId: 6, codigoPostal: "" }
    ]
  },
  {
    id: 7,
    nombre: "Entre Ríos",
    ciudades: [
      { id: 103, nombre: "Paraná", provinciaId: 7, codigoPostal: "3100" },
      { id: 104, nombre: "Concordia", provinciaId: 7, codigoPostal: "3200" },
      { id: 105, nombre: "Gualeguaychú", provinciaId: 7, codigoPostal: "2820" },
      { id: 106, nombre: "Concepción del Uruguay", provinciaId: 7, codigoPostal: "3260" },
      { id: 107, nombre: "Villaguay", provinciaId: 7, codigoPostal: "" },
      { id: 108, nombre: "Victoria", provinciaId: 7, codigoPostal: "" },
      { id: 109, nombre: "Crespo", provinciaId: 7, codigoPostal: "" },
      { id: 110, nombre: "Chajarí", provinciaId: 7, codigoPostal: "" },
      { id: 111, nombre: "Federal", provinciaId: 7, codigoPostal: "" },
      { id: 112, nombre: "Colón", provinciaId: 7, codigoPostal: "" },

      { id: 244, nombre: "Gualeguay", provinciaId: 7, codigoPostal: "" },
      { id: 245, nombre: "La Paz", provinciaId: 7, codigoPostal: "" }
    ]
  },
  {
    id: 8,
    nombre: "Corrientes",
    ciudades: [
      { id: 113, nombre: "Corrientes Capital", provinciaId: 8, codigoPostal: "3400" },
      { id: 114, nombre: "Goya", provinciaId: 8, codigoPostal: "" },
      { id: 115, nombre: "Paso de los Libres", provinciaId: 8, codigoPostal: "" },
      { id: 116, nombre: "Mercedes", provinciaId: 8, codigoPostal: "" },
      { id: 117, nombre: "Curuzú Cuatiá", provinciaId: 8, codigoPostal: "" },
      { id: 118, nombre: "Esquina", provinciaId: 8, codigoPostal: "" },
      { id: 119, nombre: "Monte Caseros", provinciaId: 8, codigoPostal: "" },
      { id: 120, nombre: "Santo Tomé", provinciaId: 8, codigoPostal: "" },

      { id: 246, nombre: "Ituzaingó", provinciaId: 8, codigoPostal: "" },
      { id: 247, nombre: "Gobernador Virasoro", provinciaId: 8, codigoPostal: "" }
    ]
  },
  {
    id: 9,
    nombre: "Misiones",
    ciudades: [
      { id: 121, nombre: "Posadas", provinciaId: 9, codigoPostal: "3300" },
      { id: 122, nombre: "Oberá", provinciaId: 9, codigoPostal: "" },
      { id: 123, nombre: "Eldorado", provinciaId: 9, codigoPostal: "" },
      { id: 124, nombre: "Puerto Iguazú", provinciaId: 9, codigoPostal: "" },
      { id: 125, nombre: "Apóstoles", provinciaId: 9, codigoPostal: "" },
      { id: 126, nombre: "Leandro N. Alem", provinciaId: 9, codigoPostal: "" },
      { id: 127, nombre: "Puerto Rico", provinciaId: 9, codigoPostal: "" },
      { id: 128, nombre: "Montecarlo", provinciaId: 9, codigoPostal: "" },

      { id: 248, nombre: "San Vicente", provinciaId: 9, codigoPostal: "" },
      { id: 249, nombre: "Aristóbulo del Valle", provinciaId: 9, codigoPostal: "" }
    ]
  },
  {
    id: 10,
    nombre: "Salta",
    ciudades: [
      { id: 129, nombre: "Salta Capital", provinciaId: 10, codigoPostal: "4400" },
      { id: 130, nombre: "San Ramón de la Nueva Orán", provinciaId: 10, codigoPostal: "" },
      { id: 131, nombre: "Tartagal", provinciaId: 10, codigoPostal: "" },
      { id: 132, nombre: "Metán", provinciaId: 10, codigoPostal: "" },
      { id: 133, nombre: "Cafayate", provinciaId: 10, codigoPostal: "" },
      { id: 134, nombre: "Güemes", provinciaId: 10, codigoPostal: "" },
      { id: 135, nombre: "Rosario de Lerma", provinciaId: 10, codigoPostal: "" },

      { id: 250, nombre: "Rosario de la Frontera", provinciaId: 10, codigoPostal: "" },
      { id: 251, nombre: "Cerrillos", provinciaId: 10, codigoPostal: "" }
    ]
  },
  {
    id: 11,
    nombre: "Jujuy",
    ciudades: [
      { id: 136, nombre: "San Salvador de Jujuy", provinciaId: 11, codigoPostal: "4600" },
      { id: 137, nombre: "San Pedro", provinciaId: 11, codigoPostal: "" },
      { id: 138, nombre: "Libertador General San Martín", provinciaId: 11, codigoPostal: "" },
      { id: 139, nombre: "Palpalá", provinciaId: 11, codigoPostal: "" },
      { id: 140, nombre: "La Quiaca", provinciaId: 11, codigoPostal: "" },
      { id: 141, nombre: "Tilcara", provinciaId: 11, codigoPostal: "" },
      { id: 142, nombre: "Humahuaca", provinciaId: 11, codigoPostal: "" },
      // agregado
      { id: 252, nombre: "Perico", provinciaId: 11, codigoPostal: "" }
    ]
  },
  {
    id: 12,
    nombre: "Santiago del Estero",
    ciudades: [
      { id: 143, nombre: "Santiago del Estero Capital", provinciaId: 12, codigoPostal: "4200" },
      { id: 144, nombre: "La Banda", provinciaId: 12, codigoPostal: "" },
      { id: 145, nombre: "Termas de Río Hondo", provinciaId: 12, codigoPostal: "" },
      { id: 146, nombre: "Añatuya", provinciaId: 12, codigoPostal: "" },
      { id: 147, nombre: "Fernández", provinciaId: 12, codigoPostal: "" },
      { id: 148, nombre: "Clodomira", provinciaId: 12, codigoPostal: "" },
      { id: 149, nombre: "Frías", provinciaId: 12, codigoPostal: "" }
    ]
  },
  {
    id: 13,
    nombre: "Formosa",
    ciudades: [
      { id: 150, nombre: "Formosa Capital", provinciaId: 13, codigoPostal: "3600" },
      { id: 151, nombre: "Clorinda", provinciaId: 13, codigoPostal: "" },
      { id: 152, nombre: "Pirané", provinciaId: 13, codigoPostal: "" },
      { id: 153, nombre: "Las Lomitas", provinciaId: 13, codigoPostal: "" },
      { id: 154, nombre: "Ingeniero Juárez", provinciaId: 13, codigoPostal: "" }
    ]
  },
  {
    id: 14,
    nombre: "Chaco",
    ciudades: [
      { id: 155, nombre: "Resistencia", provinciaId: 14, codigoPostal: "3500" },
      { id: 156, nombre: "Barranqueras", provinciaId: 14, codigoPostal: "" },
      { id: 157, nombre: "Sáenz Peña", provinciaId: 14, codigoPostal: "" },
      { id: 158, nombre: "Villa Ángela", provinciaId: 14, codigoPostal: "" },
      { id: 159, nombre: "Charata", provinciaId: 14, codigoPostal: "" },
      { id: 160, nombre: "Quitilipi", provinciaId: 14, codigoPostal: "" },
      { id: 161, nombre: "General José de San Martín", provinciaId: 14, codigoPostal: "" }
    ]
  },
  {
    id: 15,
    nombre: "Catamarca",
    ciudades: [
      { id: 162, nombre: "San Fernando del Valle de Catamarca", provinciaId: 15, codigoPostal: "4700" },
      { id: 163, nombre: "Belén", provinciaId: 15, codigoPostal: "" },
      { id: 164, nombre: "Tinogasta", provinciaId: 15, codigoPostal: "" },
      { id: 165, nombre: "Santa María", provinciaId: 15, codigoPostal: "" },
      { id: 166, nombre: "Andalgalá", provinciaId: 15, codigoPostal: "" },
      { id: 167, nombre: "Recreo", provinciaId: 15, codigoPostal: "" }
    ]
  },
  {
    id: 16,
    nombre: "La Rioja",
    ciudades: [
      { id: 168, nombre: "La Rioja Capital", provinciaId: 16, codigoPostal: "5300" },
      { id: 169, nombre: "Chilecito", provinciaId: 16, codigoPostal: "" },
      { id: 170, nombre: "Aimogasta", provinciaId: 16, codigoPostal: "" },
      { id: 171, nombre: "Chepes", provinciaId: 16, codigoPostal: "" },
      { id: 172, nombre: "Villa Unión", provinciaId: 16, codigoPostal: "" }
    ]
  },
  {
    id: 17,
    nombre: "San Juan",
    ciudades: [
      { id: 173, nombre: "San Juan Capital", provinciaId: 17, codigoPostal: "5400" },
      { id: 174, nombre: "Chimbas", provinciaId: 17, codigoPostal: "" },
      { id: 175, nombre: "Rivadavia", provinciaId: 17, codigoPostal: "" },
      { id: 176, nombre: "Santa Lucía", provinciaId: 17, codigoPostal: "" },
      { id: 177, nombre: "Pocito", provinciaId: 17, codigoPostal: "" },
      { id: 178, nombre: "Rawson", provinciaId: 17, codigoPostal: "" },
      { id: 179, nombre: "San Martín", provinciaId: 17, codigoPostal: "" },
      { id: 180, nombre: "Caucete", provinciaId: 17, codigoPostal: "" }
    ]
  },
  {
    id: 18,
    nombre: "San Luis",
    ciudades: [
      { id: 181, nombre: "San Luis Capital", provinciaId: 18, codigoPostal: "5700" },
      { id: 182, nombre: "Villa Mercedes", provinciaId: 18, codigoPostal: "" },
      { id: 183, nombre: "Merlo", provinciaId: 18, codigoPostal: "" },
      { id: 184, nombre: "Tilisarao", provinciaId: 18, codigoPostal: "" },
      { id: 185, nombre: "Justo Daract", provinciaId: 18, codigoPostal: "" },
      { id: 186, nombre: "La Toma", provinciaId: 18, codigoPostal: "" }
    ]
  },
  {
    id: 19,
    nombre: "La Pampa",
    ciudades: [
      { id: 187, nombre: "Santa Rosa", provinciaId: 19, codigoPostal: "6300" },
      { id: 188, nombre: "General Pico", provinciaId: 19, codigoPostal: "6360" },
      { id: 189, nombre: "Toay", provinciaId: 19, codigoPostal: "" },
      { id: 190, nombre: "Eduardo Castex", provinciaId: 19, codigoPostal: "6380" },
      { id: 191, nombre: "Realicó", provinciaId: 19, codigoPostal: "6200" },
      { id: 192, nombre: "Intendente Alvear", provinciaId: 19, codigoPostal: "" },
      { id: 253, nombre: "General Acha", provinciaId: 19, codigoPostal: "" },
      { id: 254, nombre: "Victorica", provinciaId: 19, codigoPostal: "" }
    ]
  },
  {
    id: 20,
    nombre: "Neuquén",
    ciudades: [
      { id: 193, nombre: "Neuquén Capital", provinciaId: 20, codigoPostal: "8300" },
      { id: 194, nombre: "San Martín de los Andes", provinciaId: 20, codigoPostal: "" },
      { id: 195, nombre: "Villa La Angostura", provinciaId: 20, codigoPostal: "" },
      { id: 196, nombre: "Zapala", provinciaId: 20, codigoPostal: "" },
      { id: 197, nombre: "Cutral Có", provinciaId: 20, codigoPostal: "" },
      { id: 198, nombre: "Plaza Huincul", provinciaId: 20, codigoPostal: "" },
      { id: 199, nombre: "Centenario", provinciaId: 20, codigoPostal: "" },
      { id: 200, nombre: "Plottier", provinciaId: 20, codigoPostal: "" }
    ]
  },
  {
    id: 21,
    nombre: "Río Negro",
    ciudades: [
      { id: 201, nombre: "Viedma", provinciaId: 21, codigoPostal: "8500" },
      { id: 202, nombre: "San Carlos de Bariloche", provinciaId: 21, codigoPostal: "" },
      { id: 203, nombre: "General Roca", provinciaId: 21, codigoPostal: "" },
      { id: 204, nombre: "Cipolletti", provinciaId: 21, codigoPostal: "" },
      { id: 205, nombre: "Villa Regina", provinciaId: 21, codigoPostal: "" },
      { id: 206, nombre: "Río Colorado", provinciaId: 21, codigoPostal: "" },
      { id: 207, nombre: "Catriel", provinciaId: 21, codigoPostal: "" },
      { id: 208, nombre: "Allen", provinciaId: 21, codigoPostal: "" },

      { id: 255, nombre: "Choele Choel", provinciaId: 21, codigoPostal: "" },
      { id: 256, nombre: "El Bolsón", provinciaId: 21, codigoPostal: "" }
    ]
  },
  {
    id: 22,
    nombre: "Chubut",
    ciudades: [
      { id: 209, nombre: "Rawson", provinciaId: 22, codigoPostal: "9103" },
      { id: 210, nombre: "Comodoro Rivadavia", provinciaId: 22, codigoPostal: "9000" },
      { id: 211, nombre: "Puerto Madryn", provinciaId: 22, codigoPostal: "9120" },
      { id: 212, nombre: "Trelew", provinciaId: 22, codigoPostal: "9100" },
      { id: 213, nombre: "Esquel", provinciaId: 22, codigoPostal: "9200" },
      { id: 214, nombre: "Trevelin", provinciaId: 22, codigoPostal: "" },
      { id: 215, nombre: "Dolavon", provinciaId: 22, codigoPostal: "" }
    ]
  },
  {
    id: 23,
    nombre: "Santa Cruz",
    ciudades: [
      { id: 216, nombre: "Río Gallegos", provinciaId: 23, codigoPostal: "9400" },
      { id: 217, nombre: "Caleta Olivia", provinciaId: 23, codigoPostal: "" },
      { id: 218, nombre: "El Calafate", provinciaId: 23, codigoPostal: "9405" },
      { id: 219, nombre: "Pico Truncado", provinciaId: 23, codigoPostal: "" },
      { id: 220, nombre: "Puerto Deseado", provinciaId: 23, codigoPostal: "9050" },
      { id: 221, nombre: "Las Heras", provinciaId: 23, codigoPostal: "" },
      { id: 222, nombre: "Comandante Luis Piedra Buena", provinciaId: 23, codigoPostal: "" },
      // agregado
      { id: 257, nombre: "El Chaltén", provinciaId: 23, codigoPostal: "" }
    ]
  },
  {
    id: 24,
    nombre: "Tierra del Fuego",
    ciudades: [
      { id: 223, nombre: "Ushuaia", provinciaId: 24, codigoPostal: "9410" },
      { id: 224, nombre: "Río Grande", provinciaId: 24, codigoPostal: "9420" },
      { id: 225, nombre: "Tolhuin", provinciaId: 24, codigoPostal: "" }
    ]
  }
];

// Helpers
export const getCiudadesByProvincia = (provinciaId: number): Ciudad[] => {
  const provincia = provinciasConCiudades.find(p => p.id === provinciaId);
  return provincia ? provincia.ciudades : [];
};

export const getProvincias = (): { id: number; nombre: string }[] => {
  return provinciasConCiudades.map(p => ({ id: p.id, nombre: p.nombre }));
};

export const buscarCiudades = (termino: string): Ciudad[] => {
  const terminoLower = termino.toLowerCase();
  const ciudades: Ciudad[] = [];
  provinciasConCiudades.forEach(provincia => {
    provincia.ciudades.forEach(ciudad => {
      if (ciudad.nombre.toLowerCase().includes(terminoLower)) {
        ciudades.push(ciudad);
      }
    });
  });
  return ciudades;
};
