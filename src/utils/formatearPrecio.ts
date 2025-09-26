/**
 * Formatea un precio numérico al formato $ 950.000 (con separador de miles)
 * @param precio - El precio numérico
 * @returns String formateado con el precio
 */
export const formatearPrecio = (precio: number): string => {
  // Formatear el número con separador de miles usando punto
  const numeroFormateado = precio.toLocaleString('es-AR', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).replace(/,/g, '.');
  
  return `$ ${numeroFormateado}`;
};

/**
 * Versión alternativa para formatear precio específicamente para Argentina
 * @param precio - El precio numérico
 * @returns String formateado con el precio
 */
export const formatearPrecioARS = (precio: number): string => {
  return `$ ${precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};