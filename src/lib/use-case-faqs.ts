export interface UseCaseFaq {
  question: string
  answer: string
}

export const useCaseFaqs: Record<string, UseCaseFaq[]> = {
  "Aerolíneas": [
    {
      question: "¿Tengo derecho a compensación si cancelan mi vuelo?",
      answer:
        "Sí, si el vuelo sale o llega en la UE y la cancelación se comunica con menos de 14 días de antelación, el Reglamento (CE) 261/2004 reconoce compensaciones de 250€ a 600€ según la distancia, salvo circunstancias extraordinarias.",
    },
    {
      question: "¿Qué pasa si mi vuelo se retrasa más de 3 horas?",
      answer:
        "Un retraso de 3 horas o más a la llegada suele equipararse a una cancelación a efectos de compensación económica, además del derecho a comida, bebida y alojamiento si es necesario pernoctar.",
    },
    {
      question: "Perdieron mi maleta, ¿puedo reclamar?",
      answer:
        "Sí. Tienes hasta 21 días desde la entrega (o desde que debió entregarse) para reclamar por daños o retraso del equipaje, y hasta 7 días si el equipaje llega dañado, según el Convenio de Montreal.",
    },
    {
      question: "¿La aerolínea puede negarme el embarque por overbooking?",
      answer:
        "Si te deniegan el embarque de forma involuntaria por overbooking, tienes derecho a compensación, reembolso o transporte alternativo, además de atención (comida, bebida, comunicaciones).",
    },
    {
      question: "¿Qué son las 'circunstancias extraordinarias'?",
      answer:
        "Son eventos fuera del control de la aerolínea (meteorología severa, huelgas de control aéreo, riesgos de seguridad) que pueden eximir de la compensación económica, aunque no de la asistencia básica.",
    },
    {
      question: "Cambié de opinión y quiero cancelar mi vuelo, ¿me devuelven el dinero?",
      answer:
        "Depende de la tarifa contratada. Las tarifas básicas suelen ser no reembolsables; revisa las condiciones, aunque siempre puedes reclamar la devolución de tasas aeroportuarias no utilizadas.",
    },
    {
      question: "¿Cuánto tiempo tengo para reclamar a una aerolínea?",
      answer:
        "En España el plazo general es de 5 años desde el incidente, aunque es recomendable reclamar cuanto antes para agilizar la respuesta y conservar mejor la documentación.",
    },
    {
      question: "¿Debo reclamar primero a la aerolínea o puedo ir directo a AESA?",
      answer:
        "Lo habitual es reclamar primero directamente a la aerolínea; si no responde en el plazo o la respuesta no es satisfactoria, puedes acudir a la Agencia Estatal de Seguridad Aérea (AESA).",
    },
    {
      question: "¿Qué documentos necesito para reclamar por un vuelo?",
      answer:
        "Localizador de reserva, tarjeta de embarque, comunicaciones de la aerolínea sobre el incidente y, si aplica, facturas de gastos adicionales (hotel, comida, billetes alternativos).",
    },
    {
      question: "¿Puedo reclamar si compré el billete a través de una agencia?",
      answer:
        "Sí, la responsabilidad de la compensación por cancelación o retraso recae en la aerolínea operadora, independientemente de dónde compraste el billete.",
    },
  ],
  "Bancos": [
    {
      question: "¿Puedo reclamar una comisión que no me habían informado?",
      answer:
        "Sí. Las entidades deben informar de forma clara y previa de todas las comisiones aplicables; si no lo hicieron o no estaba en el contrato, puedes solicitar su devolución.",
    },
    {
      question: "¿Qué hago si detecto un cargo no autorizado en mi cuenta?",
      answer:
        "Notifícalo al banco sin demora indebida (máximo 13 meses) y solicita la devolución inmediata del importe; la entidad debe reembolsarlo salvo que demuestre negligencia grave por tu parte.",
    },
    {
      question: "¿Tengo derecho a la devolución de gastos de una hipoteca?",
      answer:
        "Depende de la cláusula concreta y la fecha de firma; cláusulas como gastos de constitución o IAJD han sido objeto de numerosas sentencias favorables al consumidor en los últimos años.",
    },
    {
      question: "¿Puedo reclamar si me suben la comisión de mantenimiento sin avisar?",
      answer:
        "El banco debe comunicarte cualquier cambio de condiciones con al menos 2 meses de antelación y darte la opción de cancelar el producto sin coste si no estás de acuerdo.",
    },
    {
      question: "Me han denegado un préstamo sin justificación, ¿puedo reclamar?",
      answer:
        "El banco no está obligado a conceder financiación, pero si consideras que hubo discriminación o mala praxis en el proceso, puedes presentar una reclamación formal para que se revise.",
    },
    {
      question: "¿Qué es el Servicio de Reclamaciones del Banco de España?",
      answer:
        "Es el organismo al que puedes acudir si, tras reclamar al Servicio de Atención al Cliente del banco, no obtienes respuesta en 2 meses o no estás conforme con la solución.",
    },
    {
      question: "¿Puedo reclamar gastos por una tarjeta que no usé?",
      answer:
        "Sí, si no autorizaste la contratación o no se te informó del coste de mantenimiento de una tarjeta inactiva, puedes solicitar la devolución de las cuotas cobradas indebidamente.",
    },
    {
      question: "Cancelaron mi seguro vinculado a la hipoteca sin avisarme, ¿qué hago?",
      answer:
        "El banco debe informarte de cualquier modificación de productos vinculados. Puedes reclamar la reposición de la cobertura o los daños derivados de la falta de aviso.",
    },
    {
      question: "¿Cuánto tarda un banco en responder a una reclamación?",
      answer:
        "El plazo legal máximo es de 2 meses desde la presentación de la reclamación formal ante el Servicio de Atención al Cliente de la entidad.",
    },
    {
      question: "¿Necesito abogado para reclamar a mi banco?",
      answer:
        "No es obligatorio para la vía extrajudicial. Una reclamación bien fundamentada suele ser suficiente para iniciar el proceso; el abogado es más relevante si el caso termina en vía judicial.",
    },
  ],
  "Amazon y ecommerce": [
    {
      question: "¿Cuánto tiempo tengo para devolver un producto de Amazon?",
      answer:
        "Con carácter general dispones de 14 días naturales desde la recepción para desistir de la compra sin necesidad de justificar el motivo, conforme a la normativa de consumidores.",
    },
    {
      question: "Me han enviado un producto distinto al que compré, ¿qué hago?",
      answer:
        "Tienes derecho a la sustitución por el producto correcto o al reembolso íntegro, incluidos los gastos de devolución, ya que se trata de un incumplimiento del vendedor.",
    },
    {
      question: "El producto llegó defectuoso, ¿puedo reclamar pasados los 14 días?",
      answer:
        "Sí, la garantía legal de conformidad es de 3 años desde la entrega para productos nuevos; puedes exigir reparación, sustitución, rebaja del precio o resolución del contrato.",
    },
    {
      question: "¿Amazon es responsable si el vendedor es un tercero (marketplace)?",
      answer:
        "Depende del caso, pero como plataforma intermediaria Amazon suele facilitar la gestión de devoluciones y reclamaciones; si el vendedor no responde, puedes solicitar la intervención directa de Amazon.",
    },
    {
      question: "No ha llegado mi pedido, ¿tengo derecho a la devolución?",
      answer:
        "Si el pedido no llega en el plazo comprometido (o en 30 días si no se especificó), puedes solicitar el reembolso completo o un plazo adicional razonable antes de resolver el contrato.",
    },
    {
      question: "¿Puedo reclamar los gastos de envío de una devolución por producto defectuoso?",
      answer:
        "Sí, si el producto es defectuoso o no corresponde al pedido, todos los gastos de devolución corren a cargo del vendedor, no del consumidor.",
    },
    {
      question: "Me cobraron dos veces el mismo pedido, ¿cómo lo reclamo?",
      answer:
        "Solicita la devolución del cargo duplicado aportando el justificante bancario y el número de pedido; si la plataforma no responde, puedes reclamar también ante tu banco.",
    },
    {
      question: "¿Qué hago si una tienda online no responde a mis emails?",
      answer:
        "Documenta todos los intentos de contacto y envía una reclamación formal por escrito con plazo de respuesta; si persiste el silencio, puedes acudir a Consumo o a arbitraje.",
    },
    {
      question: "¿Puedo reclamar por publicidad engañosa en una tienda online?",
      answer:
        "Sí, si el producto no coincide con lo anunciado (características, precio, disponibilidad), puedes reclamar por publicidad engañosa ante la propia tienda y ante consumo.",
    },
    {
      question: "¿Tengo derecho a reclamar si cancelan mi pedido sin avisar?",
      answer:
        "Sí, tienes derecho al reembolso íntegro e inmediato, y si sufriste un perjuicio adicional (por ejemplo, tuviste que comprar más caro en otro sitio), puedes reclamarlo también.",
    },
  ],
  "Hoteles": [
    {
      question: "El hotel no se correspondía con lo anunciado, ¿puedo reclamar?",
      answer:
        "Sí, si las condiciones reales (categoría, servicios, ubicación) difieren sustancialmente de lo contratado, puedes reclamar una compensación o el reembolso parcial de la estancia.",
    },
    {
      question: "¿Puedo cancelar mi reserva de hotel sin coste?",
      answer:
        "Depende de la tarifa contratada; las tarifas 'flexibles' suelen permitir cancelación gratuita hasta cierta fecha, mientras que las 'no reembolsables' no admiten devolución salvo causas de fuerza mayor.",
    },
    {
      question: "Me cobraron extras que no contraté, ¿qué hago?",
      answer:
        "Solicita el desglose detallado de la factura y reclama la devolución de cualquier cargo que no autorizaste expresamente durante el check-in o la estancia.",
    },
    {
      question: "El hotel no tenía la habitación reservada al llegar (overbooking), ¿tengo derechos?",
      answer:
        "Sí, el hotel debe ofrecerte un alojamiento de categoría igual o superior sin coste adicional, además de compensar los gastos de desplazamiento y las molestias ocasionadas.",
    },
    {
      question: "¿Puedo reclamar por condiciones de higiene o seguridad deficientes?",
      answer:
        "Sí, son incumplimientos graves que pueden justificar una compensación económica e incluso el traslado a otro establecimiento sin coste.",
    },
    {
      question: "Reservé a través de Booking y tengo un problema, ¿a quién reclamo?",
      answer:
        "Puedes reclamar tanto al hotel (responsable del servicio) como a la plataforma de reservas, que actúa como intermediaria y suele mediar en la resolución de incidencias.",
    },
    {
      question: "¿Qué pasa si el hotel cancela mi reserva confirmada?",
      answer:
        "Tienes derecho al reembolso íntegro y, si el hotel no te reubica en un alojamiento equivalente, a reclamar los gastos adicionales derivados de buscar alojamiento alternativo.",
    },
    {
      question: "¿Puedo reclamar por ruido excesivo que me impidió descansar?",
      answer:
        "Sí, si el hotel no solucionó el problema pese a haberlo comunicado durante la estancia, puedes reclamar una compensación parcial por la pérdida de disfrute del servicio.",
    },
    {
      question: "¿Tengo derecho a reclamar si me niegan el check-in sin motivo?",
      answer:
        "Sí, salvo causa justificada (por ejemplo, documentación incompleta), la denegación injustificada del check-in con reserva confirmada da derecho a compensación y alojamiento alternativo.",
    },
    {
      question: "¿Cuánto tiempo tengo para reclamar tras una mala estancia?",
      answer:
        "Se recomienda reclamar cuanto antes, idealmente durante la estancia dejando constancia por escrito, aunque el plazo legal general para reclamar es de varios años según la vía elegida.",
    },
  ],
  "Seguros": [
    {
      question: "Mi aseguradora rechazó mi parte, ¿puedo reclamar?",
      answer:
        "Sí, la aseguradora debe motivar por escrito el rechazo del siniestro; si consideras que no se ajusta a la póliza, puedes reclamar formalmente aportando la documentación del caso.",
    },
    {
      question: "¿Cuánto tarda una aseguradora en indemnizar un siniestro?",
      answer:
        "La Ley de Contrato de Seguro obliga a pagar el importe mínimo en 40 días desde la declaración del siniestro y a resolver definitivamente en un plazo razonable, con intereses de demora si se retrasa injustificadamente.",
    },
    {
      question: "¿Puedo reclamar si la indemnización ofrecida es muy baja?",
      answer:
        "Sí, puedes solicitar una segunda tasación pericial y reclamar formalmente si consideras que la valoración no cubre el daño real conforme a la póliza contratada.",
    },
    {
      question: "Mi seguro de hogar no cubre un daño que creo que sí debería cubrir, ¿qué hago?",
      answer:
        "Revisa las condiciones generales y particulares de tu póliza; si la exclusión no está clara o no se te informó adecuadamente, puedes reclamar por falta de transparencia contractual.",
    },
    {
      question: "¿Puedo cancelar mi seguro antes de la renovación?",
      answer:
        "Sí, tienes derecho a no renovar comunicándolo con al menos un mes de antelación al vencimiento; si la aseguradora te cobra la renovación pese a tu aviso, puedes reclamar la devolución.",
    },
    {
      question: "¿Qué hago si la aseguradora tarda demasiado en responder?",
      answer:
        "Puedes presentar una reclamación formal por escrito con acuse de recibo; si no obtienes respuesta en el plazo legal, puedes acudir a la Dirección General de Seguros y Fondos de Pensiones.",
    },
    {
      question: "¿Puedo reclamar los gastos médicos que pagué de mi bolsillo?",
      answer:
        "Sí, si el seguro de salud debía cubrir esa asistencia y tuviste que adelantar el pago, puedes reclamar el reembolso aportando facturas e informes médicos.",
    },
    {
      question: "Mi seguro de coche no quiere pagar tras un accidente, ¿es normal?",
      answer:
        "No necesariamente; si el siniestro está cubierto por la póliza y no concurre ninguna exclusión, la aseguradora está obligada a indemnizar conforme a lo pactado.",
    },
    {
      question: "¿Qué es el arbitraje de consumo en materia de seguros?",
      answer:
        "Es una vía gratuita y voluntaria para resolver conflictos con aseguradoras sin necesidad de acudir a los tribunales, siempre que la entidad esté adherida al sistema arbitral.",
    },
    {
      question: "¿Puedo reclamar si me suben la prima sin justificación?",
      answer:
        "La aseguradora debe justificar cualquier incremento en la renovación; si no lo hace o el aumento no se corresponde con el riesgo real, puedes reclamar o cambiar de compañía.",
    },
  ],
  "Transporte": [
    {
      question: "Mi autobús se retrasó varias horas, ¿tengo derecho a compensación?",
      answer:
        "Sí, el Reglamento (UE) 181/2011 reconoce derechos de información, asistencia e incluso compensación económica en trayectos de larga distancia ante retrasos significativos.",
    },
    {
      question: "¿Puedo reclamar por un tren cancelado?",
      answer:
        "Sí, tienes derecho a elegir entre el reembolso del billete o el transporte alternativo, además de compensación económica si el retraso final supera ciertos umbrales.",
    },
    {
      question: "Perdí mi conexión por el retraso del primer trayecto, ¿qué hago?",
      answer:
        "Si compraste un billete combinado con el mismo operador, tienes derecho a que te reubiquen en el siguiente transporte disponible sin coste adicional.",
    },
    {
      question: "¿Tengo derecho a compensación si el retraso es inferior a 1 hora?",
      answer:
        "Depende del modo de transporte y la normativa aplicable; en tren, algunos operadores compensan a partir de 15-30 minutos de retraso según sus condiciones comerciales.",
    },
    {
      question: "¿Puedo reclamar por la pérdida de mi equipaje en tren o autobús?",
      answer:
        "Sí, el operador es responsable de la custodia del equipaje facturado y debe indemnizar por pérdida o daño conforme a la normativa aplicable y sus condiciones de transporte.",
    },
    {
      question: "¿Qué hago si me niegan el acceso al transporte por movilidad reducida?",
      answer:
        "Es una discriminación prohibida por ley; los operadores deben garantizar accesibilidad y asistencia, y puedes reclamar formalmente ante la denegación injustificada.",
    },
    {
      question: "¿Puedo reclamar si el vehículo estaba en mal estado (suciedad, avería)?",
      answer:
        "Sí, si las condiciones del servicio no eran las contratadas y afectaron a tu viaje, puedes solicitar una compensación parcial del billete.",
    },
    {
      question: "¿Cuánto tiempo tengo para reclamar a una empresa de transporte?",
      answer:
        "El plazo general para reclamaciones de transporte terrestre suele ser de 1 año, aunque conviene revisar las condiciones específicas del operador y presentar la reclamación cuanto antes.",
    },
    {
      question: "¿Puedo reclamar los gastos de un taxi alternativo tras perder mi tren?",
      answer:
        "Si la pérdida de la conexión fue responsabilidad del operador (retraso, cancelación), puedes reclamar los gastos razonables en los que incurriste para continuar tu viaje.",
    },
    {
      question: "¿Dónde reclamo si el operador de transporte no responde?",
      answer:
        "Puedes acudir a las juntas arbitrales de transporte o a las oficinas de consumo de tu comunidad autónoma si, tras reclamar directamente, no obtienes respuesta satisfactoria.",
    },
  ],
  "Operadoras": [
    {
      question: "Me facturan servicios que no he contratado, ¿qué hago?",
      answer:
        "Solicita el desglose de factura y reclama la anulación de cualquier cargo no autorizado; la operadora debe acreditar que contrataste expresamente ese servicio.",
    },
    {
      question: "¿Puedo darme de baja sin penalización?",
      answer:
        "Si no tienes permanencia contratada, sí. Si la tienes, revisa las condiciones: solo aplica penalización si se corresponde con descuentos o equipos subvencionados pendientes de amortizar.",
    },
    {
      question: "Mi conexión de internet no alcanza la velocidad contratada, ¿puedo reclamar?",
      answer:
        "Sí, tienes derecho a que la velocidad real se ajuste a lo contratado; si no es así de forma persistente, puedes exigir una compensación o la resolución del contrato sin penalización.",
    },
    {
      question: "¿Cuánto tarda una portabilidad y qué hago si falla?",
      answer:
        "El plazo máximo es de 1 día laborable. Si sufres una interrupción del servicio más allá de ese plazo, tienes derecho a compensación económica automática por cada día de retraso.",
    },
    {
      question: "Me han dado de alta un servicio por teléfono sin mi consentimiento claro, ¿qué hago?",
      answer:
        "Las contrataciones telefónicas requieren confirmación expresa y grabación como prueba; si no puedes acreditar tu consentimiento, puedes reclamar la anulación y devolución de lo cobrado.",
    },
    {
      question: "¿Tengo derecho a compensación por corte de suministro prolongado?",
      answer:
        "Sí, la Carta de Derechos del Usuario de telecomunicaciones reconoce compensaciones automáticas por interrupciones del servicio superiores a las horas establecidas.",
    },
    {
      question: "¿Puedo reclamar si suben mi tarifa sin avisarme?",
      answer:
        "La operadora debe notificarte cualquier modificación contractual con al menos un mes de antelación, informándote de tu derecho a resolver el contrato sin penalización si no aceptas el cambio.",
    },
    {
      question: "¿Qué hago si el servicio técnico no soluciona mi avería?",
      answer:
        "Si tras varias visitas la avería persiste, puedes exigir una compensación por los días sin servicio o solicitar la baja sin penalización por incumplimiento contractual.",
    },
    {
      question: "¿Puedo reclamar la devolución de un móvil financiado si doy de baja la línea?",
      answer:
        "Depende del contrato; si el terminal estaba subvencionado a cambio de permanencia, es habitual que debas abonar la parte pendiente de amortizar, pero puedes reclamar si no se te informó claramente de este punto.",
    },
    {
      question: "¿Dónde reclamo si la operadora no resuelve mi caso?",
      answer:
        "Tras agotar la vía de atención al cliente, puedes acudir a la Oficina de Atención al Usuario de Telecomunicaciones (OAUT) del Ministerio, que es gratuita.",
    },
  ],
  "Tiendas online": [
    {
      question: "¿Puedo devolver un producto si simplemente no me gusta?",
      answer:
        "Sí, el derecho de desistimiento te permite devolver casi cualquier producto en 14 días sin justificar el motivo, salvo excepciones como productos personalizados o precintados de higiene.",
    },
    {
      question: "¿Quién paga los gastos de devolución si me arrepiento de la compra?",
      answer:
        "Salvo que la tienda asuma voluntariamente el coste, los gastos de devolución por desistimiento corren a cargo del consumidor, y deben estar claramente informados antes de comprar.",
    },
    {
      question: "La tienda no me da el número de seguimiento de mi pedido, ¿qué hago?",
      answer:
        "Tienes derecho a recibir información clara sobre el estado de tu envío; si la tienda no responde, puedes reclamar formalmente y, si procede, solicitar el reembolso por incumplimiento.",
    },
    {
      question: "¿Puedo reclamar si el precio final difiere del anunciado?",
      answer:
        "Sí, el precio mostrado antes de finalizar la compra debe respetarse; si te cobran de más sin tu consentimiento explícito, puedes reclamar la diferencia.",
    },
    {
      question: "Compré con descuento y no me lo aplicaron, ¿tengo derecho a reclamar?",
      answer:
        "Sí, si el descuento era válido en el momento de la compra y no se aplicó por un error de la tienda, puedes exigir la devolución de la diferencia.",
    },
    {
      question: "¿Qué hago si la tienda online desaparece tras mi compra?",
      answer:
        "Reclama primero a tu banco la devolución del cargo (chargeback) si pagaste con tarjeta, y conserva toda la documentación por si necesitas denunciar ante Consumo.",
    },
    {
      question: "¿Puedo reclamar por un producto de segunda mano comprado online?",
      answer:
        "Depende de si el vendedor es un profesional o un particular; frente a vendedores profesionales sigues teniendo derechos de garantía, aunque con plazos reducidos si se informó expresamente.",
    },
    {
      question: "¿Tengo que pagar por probarme ropa que luego devuelvo?",
      answer:
        "No, siempre que el producto se devuelva en las mismas condiciones en que se recibió, sin señales de uso más allá de lo necesario para comprobar su naturaleza.",
    },
    {
      question: "¿Puedo reclamar si el vendedor tarda semanas en reembolsarme?",
      answer:
        "El reembolso debe realizarse en un máximo de 14 días desde que ejerces el desistimiento o desde que el vendedor recibe la devolución; superado ese plazo, puedes reclamar formalmente.",
    },
    {
      question: "¿Qué garantías tengo al comprar en una tienda online extranjera de la UE?",
      answer:
        "Los mismos derechos básicos de consumo se aplican dentro de la Unión Europea, aunque la reclamación puede gestionarse a través de la Red de Centros Europeos del Consumidor.",
    },
  ],
  "Plataformas digitales": [
    {
      question: "Me han bloqueado la cuenta sin explicación, ¿puedo reclamar?",
      answer:
        "Sí, la plataforma debe informarte de los motivos del bloqueo y ofrecerte un cauce para recurrir la decisión; la falta de motivación puede fundamentar una reclamación.",
    },
    {
      question: "¿Puedo recuperar el dinero de una suscripción que no usé?",
      answer:
        "Si no cancelaste a tiempo por falta de información clara sobre la renovación automática, puedes reclamar la devolución alegando falta de transparencia contractual.",
    },
    {
      question: "La plataforma cambió las condiciones del servicio sin avisarme, ¿qué hago?",
      answer:
        "Debes ser informado de cambios sustanciales con antelación razonable y tener la opción de cancelar sin penalización si no estás de acuerdo con los nuevos términos.",
    },
    {
      question: "¿Puedo reclamar si me cobran una suscripción tras cancelarla?",
      answer:
        "Sí, si tienes prueba de la cancelación (email, captura de pantalla), puedes exigir la devolución de cualquier cargo posterior a esa fecha.",
    },
    {
      question: "Un vendedor de una plataforma de anuncios me estafó, ¿la plataforma responde?",
      answer:
        "Depende de sus términos de uso; algunas plataformas ofrecen protección al comprador. En cualquier caso, puedes denunciar el perfil y reclamar a tu banco si pagaste con tarjeta.",
    },
    {
      question: "¿Tengo derecho a que borren mis datos de una plataforma?",
      answer:
        "Sí, el derecho de supresión (RGPD) te permite solicitar que una plataforma elimine tus datos personales, salvo que exista una obligación legal de conservarlos.",
    },
    {
      question: "¿Puedo reclamar por contenido que la plataforma no retira pese a denunciarlo?",
      answer:
        "Sí, si el contenido vulnera tus derechos y la plataforma no actúa tras una notificación formal, puede incurrir en responsabilidad y puedes reclamar su retirada.",
    },
    {
      question: "Me cobraron en una moneda o importe distinto al mostrado, ¿qué hago?",
      answer:
        "Reclama la diferencia aportando capturas del precio mostrado antes del pago; las plataformas deben mostrar el precio final de forma clara antes de confirmar la compra.",
    },
    {
      question: "¿Puedo reclamar si el servicio de atención al cliente es solo un bot que no ayuda?",
      answer:
        "Sí, tienes derecho a poder contactar por un medio efectivo con la empresa; si el canal automatizado no resuelve tu caso, puedes exigir atención humana o reclamar formalmente por escrito.",
    },
    {
      question: "¿Qué hago si la plataforma tiene sede fuera de España?",
      answer:
        "Si opera en la UE, sigue estando sujeta a la normativa europea de consumo; puedes apoyarte en la Red de Centros Europeos del Consumidor para gestionar la reclamación transfronteriza.",
    },
  ],
  "Administraciones públicas": [
    {
      question: "¿Cuánto tiempo tiene la Administración para responder a mi solicitud?",
      answer:
        "Con carácter general, 3 meses desde la presentación, salvo que una norma específica establezca otro plazo; transcurrido ese tiempo sin respuesta, opera el silencio administrativo.",
    },
    {
      question: "¿Qué es el silencio administrativo y qué efectos tiene?",
      answer:
        "Es la falta de resolución expresa en plazo. Según el procedimiento, puede considerarse estimatorio (a tu favor) o desestimatorio, lo que determina las vías de recurso disponibles.",
    },
    {
      question: "¿Puedo reclamar por daños causados por un mal funcionamiento de un servicio público?",
      answer:
        "Sí, existe la responsabilidad patrimonial de la Administración, que te permite reclamar una indemnización por los daños sufridos como consecuencia del funcionamiento de un servicio público.",
    },
    {
      question: "Me han denegado una ayuda o subvención, ¿puedo recurrir?",
      answer:
        "Sí, puedes presentar un recurso de alzada o reposición según el órgano que dictó la resolución, dentro de los plazos establecidos (habitualmente 1 mes desde la notificación).",
    },
    {
      question: "¿Qué diferencia hay entre recurso de alzada y de reposición?",
      answer:
        "El de alzada se presenta ante el órgano superior jerárquico cuando la resolución no agota la vía administrativa; el de reposición se presenta ante el mismo órgano que dictó el acto.",
    },
    {
      question: "¿Puedo reclamar una multa que considero injusta?",
      answer:
        "Sí, puedes presentar alegaciones en el plazo indicado en la notificación y, si se desestiman, recurrir la sanción aportando las pruebas que respalden tu versión de los hechos.",
    },
    {
      question: "¿Qué es una reclamación previa a la vía judicial?",
      answer:
        "En determinados procedimientos es un requisito obligatorio agotar la vía administrativa (recursos) antes de poder acudir a los tribunales contencioso-administrativos.",
    },
    {
      question: "¿Puedo reclamar por retrasos excesivos en un trámite administrativo?",
      answer:
        "Sí, puedes solicitar formalmente que se resuelva tu expediente e incluso reclamar los daños derivados de una demora injustificada más allá del plazo legal.",
    },
    {
      question: "¿Qué plazo tengo para recurrir una resolución administrativa?",
      answer:
        "Generalmente 1 mes para el recurso de reposición o alzada, y 2 meses para acudir a la vía contencioso-administrativa desde la notificación o desde que opera el silencio.",
    },
    {
      question: "¿Necesito abogado para reclamar ante la Administración?",
      answer:
        "No es obligatorio en vía administrativa (recursos, alegaciones); solo suele ser necesario si el procedimiento avanza a la vía judicial contencioso-administrativa.",
    },
  ],
}
