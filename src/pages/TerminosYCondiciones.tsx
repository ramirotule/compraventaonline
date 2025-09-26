const TerminosYCondiciones = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Términos y Condiciones
        </h1>
        
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Última actualización:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-700 mb-4">
              Al acceder y utilizar CompraVenta Online, usted acepta estar sujeto a estos términos y condiciones. 
              Si no está de acuerdo con algún aspecto de estos términos, no debe utilizar nuestro servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Descripción del Servicio
            </h2>
            <p className="text-gray-700 mb-4">
              CompraVenta Online es una plataforma que permite a los usuarios comprar y vender productos de segunda mano 
              y nuevos. Facilitamos la conexión entre compradores y vendedores, pero no somos parte de las transacciones.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Registro y Cuenta de Usuario
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Debe proporcionar información veraz y actualizada durante el registro</li>
              <li>Es responsable de mantener la confidencialidad de su cuenta y contraseña</li>
              <li>Debe ser mayor de 18 años o tener permiso de sus padres/tutores</li>
              <li>Una persona o entidad solo puede tener una cuenta activa</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Normas para Vendedores
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Debe ser el propietario legítimo de los productos que vende</li>
              <li>Las descripciones de productos deben ser precisas y veraces</li>
              <li>Las fotos deben representar fielmente el estado del producto</li>
              <li>Debe responder a las consultas de compradores en tiempo razonable</li>
              <li>Está prohibida la venta de productos ilegales o peligrosos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Normas para Compradores
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Debe realizar preguntas específicas sobre el producto antes de comprar</li>
              <li>Debe inspeccionar el producto al momento de la entrega</li>
              <li>Debe realizar el pago según lo acordado con el vendedor</li>
              <li>Puede reportar productos que no coincidan con la descripción</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Transacciones y Pagos
            </h2>
            <p className="text-gray-700 mb-4">
              Las transacciones se realizan directamente entre compradores y vendedores. CompraVenta Online no procesa 
              pagos ni garantiza las transacciones. Recomendamos:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Encontrarse en lugares públicos y seguros</li>
              <li>Inspeccionar el producto antes del pago</li>
              <li>Utilizar métodos de pago seguros</li>
              <li>Mantener evidencia de la transacción</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Contenido Prohibido
            </h2>
            <p className="text-gray-700 mb-4">Está prohibido publicar:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Productos ilegales, robados o falsificados</li>
              <li>Armas, drogas o sustancias peligrosas</li>
              <li>Contenido ofensivo, discriminatorio o inapropiado</li>
              <li>Información personal de terceros</li>
              <li>Spam o contenido duplicado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Responsabilidades y Limitaciones
            </h2>
            <p className="text-gray-700 mb-4">
              CompraVenta Online actúa únicamente como intermediario. No nos hacemos responsables por:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>La calidad, seguridad o legalidad de los productos</li>
              <li>Las transacciones entre usuarios</li>
              <li>Pérdidas o daños derivados del uso de la plataforma</li>
              <li>Disputas entre compradores y vendedores</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              9. Privacidad y Datos
            </h2>
            <p className="text-gray-700 mb-4">
              Su privacidad es importante para nosotros. Consulte nuestra Política de Privacidad para obtener 
              información sobre cómo recopilamos, utilizamos y protegemos sus datos personales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              10. Modificaciones de los Términos
            </h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán 
              en esta página y entrarán en vigencia inmediatamente. Su uso continuo de la plataforma constituye 
              la aceptación de los términos modificados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              11. Contacto
            </h2>
            <p className="text-gray-700 mb-4">
              Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Email: soporte@compraventaonline.com</li>
              <li>Teléfono: +54 11 1234-5678</li>
              <li>Dirección: Buenos Aires, Argentina</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2025 CompraVenta Online. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminosYCondiciones;