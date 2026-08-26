import Link from "next/link";
import {
  COMPANY_COUNTRY,
  COMPANY_DOMICILE,
  COMPANY_LEGAL_NAME,
  COMPANY_NAME,
  COMPANY_SUPPORT_EMAIL,
  getCompanyLegalLabel,
} from "@/consts";
import { Logo } from "@/components";

const LAST_UPDATED = "26 de agosto de 2026";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-12 scroll-mt-24 text-xl font-semibold tracking-tight text-ink-50 sm:text-2xl">
    {children}
  </h2>
);

const ClauseTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-8 scroll-mt-24 border-b border-ink-800 pb-2 text-sm font-semibold uppercase tracking-wider text-ink-200">
    {children}
  </h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-sm leading-relaxed text-ink-300">{children}</p>
);

const Ol = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type?: "1" | "a";
}) => (
  <ol
    className={
      type === "a"
        ? "mt-3 list-[lower-alpha] space-y-2 pl-5 text-sm leading-relaxed text-ink-300"
        : "mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-ink-300"
    }
  >
    {children}
  </ol>
);

const Ul = ({ children }: { children: React.ReactNode }) => (
  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-300">
    {children}
  </ul>
);

export const TermsOfServiceTemplate = () => {
  const company = COMPANY_NAME;
  const legalLabel = getCompanyLegalLabel();
  const hasLegalEntity = Boolean(COMPANY_LEGAL_NAME.trim());

  return (
    <div className="min-h-dvh bg-ink-950 text-ink-100">
      <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/90 backdrop-blur-md">
        <div className="container-px mx-auto flex h-14 max-w-3xl items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Logo size={24} />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-ink-400 transition-colors hover:text-ink-50"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="container-px mx-auto max-w-3xl py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-400">
          Última actualización: {LAST_UPDATED}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
          Términos y condiciones de {company}
        </h1>
        <P>
          Este documento establece las reglas de uso de la plataforma {company} en{" "}
          {COMPANY_COUNTRY}. Si creas una cuenta, inicias sesión o usas cualquiera de
          nuestras funcionalidades, aceptas estas condiciones. Si no estás de acuerdo,
          no uses el servicio.
        </P>

        <SectionTitle>1. Quiénes somos y qué es este acuerdo</SectionTitle>
        <P>
          {company} es un software en la nube orientado a consultorios y prestadores
          de salud. Permite administrar, entre otras cosas, pacientes, agenda,
          procedimientos, planes de tratamiento, historia clínica y pagos del
          consultorio.
        </P>
        <P>
          En este texto, “nosotros”, “nuestro” o “{company}” se refiere a{" "}
          {legalLabel}
          {hasLegalEntity
            ? " y, cuando corresponda, a las personas o entidades que operen la marca."
            : `. Mientras no exista una sociedad formalmente constituida, ${company} opera como marca comercial del prestador del servicio. Cuando se registre la sociedad titular, su razón social y NIT se actualizarán en la constante de empresa del producto y en estos términos, sin que ese solo cambio de identificación exija aceptar un contrato nuevo, salvo que la ley disponga lo contrario.`}
        </P>
        <P>
          “Tú”, “Cliente” o “Prestador” es quien contrata o administra la cuenta del
          consultorio. “Usuario” es cualquier persona natural a la que el Cliente dé
          acceso (por ejemplo, profesionales, recepción o administradores).
        </P>

        <SectionTitle>2. Definiciones útiles</SectionTitle>
        <Ul>
          <li>
            <b>Plataforma:</b> el conjunto de aplicaciones, sitios y APIs de {company}{" "}
            ofrecidos bajo modelo SaaS.
          </li>
          <li>
            <b>Servicios:</b> el acceso remoto a la Plataforma y las funciones
            habilitadas según el plan contratado.
          </li>
          <li>
            <b>Contenido del Cliente:</b> toda información que tú o tus Usuarios
            carguen o generen en la Plataforma (datos de pacientes, notas clínicas,
            archivos, precios, pagos, etc.).
          </li>
          <li>
            <b>Paciente:</b> persona atendida por el Prestador cuyos datos se
            registran en la Plataforma.
          </li>
          <li>
            <b>Tarifa:</b> el valor que debes pagar por los Servicios, según el plan
            vigente y lo publicado o acordado al contratar.
          </li>
        </Ul>

        <SectionTitle>3. Capacidad legal y aceptación</SectionTitle>
        <Ol>
          <li>
            Solo pueden usar {company} personas con capacidad legal para contratar
            bajo la ley colombiana, o representantes debidamente facultados de una
            persona jurídica.
          </li>
          <li>
            Al marcar la casilla de aceptación, completar el registro o seguir
            usando la Plataforma tras un cambio de términos (cuando te lo
            notifiquemos), confirmas que leíste y aceptas este acuerdo.
          </li>
          <li>
            Si actúas en nombre de un consultorio o sociedad, garantizas que tienes
            poderes suficientes para obligarla.
          </li>
        </Ol>

        <SectionTitle>4. Licencia de uso</SectionTitle>
        <Ol>
          <li>
            Te concedemos una licencia personal, limitada, no exclusiva, no
            transferible y revocable para acceder a la Plataforma solo para la
            operación legítima de tu consultorio, mientras la suscripción esté
            activa y cumplas estas condiciones.
          </li>
          <li>
            No adquieres propiedad sobre el software, el código, la marca, el diseño
            ni la documentación de {company}. Solo obtienes el derecho de uso
            descrito aquí.
          </li>
          <li>
            Podemos apoyarnos en proveedores de infraestructura, pasarelas de pago u
            otros terceros para operar partes del servicio. Eso no cambia tu
            relación contractual principal con {company}, salvo que indiquemos lo
            contrario para un módulo concreto.
          </li>
        </Ol>

        <SectionTitle>5. Cuentas, credenciales y seguridad</SectionTitle>
        <Ol>
          <li>
            Para usar la Plataforma debes crear una cuenta o recibir una invitación
            del administrador del consultorio. Debes proporcionar datos veraces y
            mantenerlos actualizados.
          </li>
          <li>
            Las credenciales son personales. Eres responsable de custodiarlas y de
            lo que ocurra bajo tu usuario. No compartas contraseñas ni dejes
            sesiones abiertas en equipos compartidos.
          </li>
          <li>
            Las acciones hechas con un usuario válido se consideran realizadas por
            ese Usuario o, frente a {company}, por el Cliente que administra la
            cuenta.
          </li>
          <li>
            Si detectas un acceso no autorizado, avísanos de inmediato por los
            canales de soporte. Podemos suspender o cerrar cuentas ante uso indebido,
            riesgo de seguridad o incumplimiento de estas reglas.
          </li>
          <li>
            Los registros técnicos de la Plataforma (accesos, cambios relevantes,
            logs) pueden usarse como evidencia de lo ocurrido en el sistema.
          </li>
        </Ol>

        <SectionTitle>6. Usos prohibidos</SectionTitle>
        <P>Queda prohibido, entre otras conductas:</P>
        <Ol type="a">
          <li>Usar la Plataforma para actividades ilegales o fraudulentas.</li>
          <li>
            Tratar datos personales o sensibles sin base legal o sin el
            consentimiento requerido, incluyendo datos de menores sin la
            autorización de sus representantes.
          </li>
          <li>
            Difundir contenido que promueva abuso infantil, violencia, discriminación,
            acoso, calumnias o amenazas.
          </li>
          <li>
            Introducir malware, intentar vulnerar la seguridad, hacer ingeniería
            inversa no autorizada, sobrecargar el servicio o suplantar la identidad
            de nuestro equipo.
          </li>
          <li>
            Revender, sublicenciar, alquilar o ceder el acceso a la Plataforma sin
            autorización escrita nuestra.
          </li>
          <li>
            Violar derechos de propiedad intelectual de {company} o de terceros.
          </li>
        </Ol>
        <P>
          Ante estas conductas podemos suspender el acceso, cancelar la cuenta sin
          reembolso de períodos ya causados, y reportar a autoridades cuando la ley
          lo exija o lo consideremos necesario. El Cliente sigue obligado a pagar lo
          adeudado hasta la suspensión o terminación.
        </P>

        <SectionTitle>7. Tarifas, facturación e impuestos</SectionTitle>
        <Ol>
          <li>
            El valor del servicio es el del plan que contrates (y los módulos
            adicionales que actives), según precios publicados o cotizados al momento
            de la contratación.
          </li>
          <li>
            Salvo pacto distinto, el cobro es periódico mientras la cuenta esté
            activa, aunque no uses todas las funciones. Un período de prueba gratuito
            termina en las condiciones anunciadas; después aplica la tarifa
            correspondiente si no cancelas a tiempo.
          </li>
          <li>
            Podemos actualizar precios. Te avisaremos con al menos diez (10) días
            calendario de anticipación. Si no cancelas antes de la entrada en vigor,
            el nuevo precio aplica a los cobros siguientes.
          </li>
          <li>
            El pago se hace por los medios electrónicos que habilitemos en{" "}
            {COMPANY_COUNTRY}. No se admite reducir unilateralmente el monto
            facturado, salvo descuentos o créditos que nosotros reconozcamos.
          </li>
          <li>
            Los impuestos aplicables (incluido el IVA cuando corresponda) son de cargo
            del Cliente, salvo que la ley disponga otra cosa. Las facturas o
            documentos electrónicos se enviarán al correo de contacto administrativo
            que registres.
          </li>
          <li>
            La mora genera el derecho a suspender el servicio y a cobrar intereses
            moratorios en los límites legales. Mientras la cuenta esté suspendida por
            falta de pago, pueden seguir causándose cargos hasta que se cancele el
            contrato conforme a estas condiciones.
          </li>
          <li>
            No recibir una factura no te libera de pagar. Que aceptemos un pago tarde
            sin cobrar intereses no implica renuncia a hacerlo en el futuro.
          </li>
        </Ol>

        <SectionTitle>8. Qué hacemos nosotros</SectionTitle>
        <Ol>
          <li>
            Nos esforzamos por mantener la Plataforma disponible y segura con
            medidas razonables según el estado de la técnica y nuestros recursos. Como
            meta operativa buscamos una disponibilidad anual cercana al 99,5%, sin
            que ello constituya una garantía absoluta.
          </li>
          <li>
            El software puede presentar fallas. Corregiremos, en la medida de lo
            razonable, errores que afecten de forma material el uso previsto.
          </li>
          <li>
            No respondemos por la calidad de tu conexión a internet, por equipos del
            Cliente ni por interrupciones ajenas a nuestro control (fuerza mayor,
            fallas de proveedores de red o energía, actos de autoridad, etc.).
          </li>
          <li>
            Podemos hacer mantenimientos o mejoras que impliquen una pausa temporal.
            Cuando sea posible, avisaremos con anticipación.
          </li>
          <li>
            No garantizamos resultados clínicos, diagnósticos ni la idoneidad
            profesional de quienes usan la cuenta. {company} es una herramienta de
            gestión; la atención en salud es responsabilidad exclusiva del Prestador
            y de sus profesionales.
          </li>
        </Ol>

        <SectionTitle>9. Qué debes hacer tú</SectionTitle>
        <Ol>
          <li>
            Entregar la información y colaboración necesarias para activar y operar
            la cuenta. En las primeras semanas tras el alta, conviene completar la
            configuración que te indiquemos para que el consultorio quede operativo.
          </li>
          <li>
            Eres el responsable del tratamiento de los datos de pacientes y Usuarios
            que cargues. Debes contar con autorización o con otra base legal válida
            bajo la normativa colombiana de protección de datos y de historia
            clínica.
          </li>
          <li>
            Usar la Plataforma de buena fe, solo para fines lícitos y actualizar tus
            datos de contacto.
          </li>
          <li>
            No subir contenido ilícito, ofensivo o que contenga código malicioso.
          </li>
          <li>
            Mantener tu propia infraestructura (internet, dispositivos, respaldos
            locales que consideres necesarios). La imposibilidad de acceso por
            causas de tu lado no genera responsabilidad para {company}.
          </li>
          <li>
            Cumplir las normas aplicables a tu actividad (salud, historia clínica,
            facturación, ética profesional, etc.). {company} no supervisa el
            contenido clínico que registres.
          </li>
          <li>
            Mantener indemne a {company} frente a reclamos de pacientes, Usuarios o
            terceros derivados de: (i) tu incumplimiento; (ii) el tratamiento de
            datos que realices como responsable; (iii) la calidad o resultado de la
            atención en salud; o (iv) disputas comerciales con pacientes. Los costos
            razonables de defensa serán a tu cargo cuando el reclamo te sea
            imputable.
          </li>
          <li>
            Autorizas auditorías acotadas de cuentas involucradas si hay un incidente
            de seguridad, con aviso previo de alcance y fecha cuando sea viable.
          </li>
        </Ol>

        <SectionTitle>10. Propiedad intelectual</SectionTitle>
        <Ol>
          <li>
            La marca {company}, el software, interfaces, textos, gráficos y demás
            elementos de la Plataforma nos pertenecen o los usamos con licencia. No
            puedes copiarlos, modificarlos, distribuirlos ni registrar signos
            confundibles sin permiso escrito.
          </li>
          <li>
            El Contenido del Cliente sigue siendo tuyo. Nos otorgas una licencia
            limitada y no exclusiva para alojarlo, procesarlo y mostrarlo solo en la
            medida necesaria para prestar el servicio y cumplir la ley.
          </li>
          <li>
            Podemos mencionar tu consultorio (nombre o logo) como referencia de
            cliente en materiales comerciales, salvo que nos indiques por escrito que
            no lo deseas.
          </li>
          <li>
            Enlaces a sitios de terceros se ofrecen solo como facilitación; sus
            condiciones y contenidos no son responsabilidad nuestra.
          </li>
        </Ol>

        <SectionTitle>11. Protección de datos personales (Colombia)</SectionTitle>
        <Ol>
          <li>
            El tratamiento de datos personales en el marco de {company} se rige por
            la ley colombiana, en especial la Ley 1581 de 2012, el Decreto 1377 de
            2013, la Ley 1273 de 2009 en lo pertinente, y las normas que las
            modifiquen o complementen.
          </li>
          <li>
            Respecto de los datos de pacientes y demás información que registres, tú
            actúas como <b>responsable</b> del tratamiento. {company} actúa como{" "}
            <b>encargado</b>, procesando esos datos solo para operar la Plataforma y
            según tus instrucciones lícitas e este acuerdo.
          </li>
          <li>
            Debes conservar la prueba de las autorizaciones cuando sean necesarias y
            facilitar a los titulares los mecanismos para ejercer sus derechos. Si
            usamos datos agregados o anonimizados para estadísticas, mejora del
            producto o análisis internos, lo haremos sin identificar personas.
          </li>
          <li>
            Nos mantendrás indemnes por reclamos de titulares cuando el incumplimiento
            sea tuyo (por ejemplo, tratar datos sensibles sin cumplir los requisitos
            legales). La{" "}
            <Link
              href="/privacy-policy"
              className="text-accent-500 underline-offset-2 hover:underline"
            >
              Política de privacidad
            </Link>{" "}
            y, si aplica, un acuerdo de
            tratamiento de datos (DPA) podrán complementar este apartado.
          </li>
        </Ol>

        <SectionTitle>12. Confidencialidad y salida de datos</SectionTitle>
        <Ol>
          <li>
            Cada parte guardará reserva sobre la información no pública de la otra a
            la que acceda por este acuerdo, y solo la usará para ejecutarlo. Esta
            obligación dura tres (3) años después de terminado el contrato, o el
            plazo mayor que exija la ley.
          </li>
          <li>
            Podemos compartir información cuando sea necesario para prevenir fraude,
            atender requerimientos legales o proteger la seguridad de la Plataforma y
            de nuestros clientes.
          </li>
          <li>
            Antes de terminar el servicio, debes exportar o descargar el Contenido
            del Cliente que necesites conservar. Tras la terminación, eliminaremos o
            anonimizaremos los datos en un plazo razonable (orientativamente hasta
            doce semanas), salvo retención legal obligatoria. No respondemos por
            pérdida de información si no exportaste a tiempo.
          </li>
          <li>
            La entrega de respaldos o exportaciones, cuando proceda, se hará al
            administrador de la cuenta o al representante legal acreditado del
            Cliente.
          </li>
        </Ol>

        <SectionTitle>13. Registros de actividad</SectionTitle>
        <P>
          Podemos conservar logs de acceso y actividad por hasta doce (12) meses (o
          el tiempo que exija la ley o la seguridad del servicio) para auditoría,
          soporte y mejora del producto. También podemos publicar métricas agregadas
          que no identifiquen personas ni consultorios concretos.
        </P>

        <SectionTitle>14. Limitación de responsabilidad</SectionTitle>
        <Ol>
          <li>
            En la máxima medida permitida por la ley colombiana, {company} no
            responde por lucro cesante, pérdida de oportunidades, daños indirectos o
            consequential, ni por pérdida de datos derivada de causas no imputables a
            dolo o culpa grave nuestra.
          </li>
          <li>
            Si llegáramos a responder por daños directos imputables a nosotros, el
            monto total máximo se limita a lo efectivamente pagado por el Cliente a{" "}
            {company} en el mes inmediatamente anterior al hecho generador.
          </li>
          <li>
            No respondemos por consejos, contenidos o servicios de terceros ajenos a{" "}
            {company}, ni por decisiones clínicas o administrativas que tomes con
            base en la información registrada en la Plataforma.
          </li>
        </Ol>

        <SectionTitle>15. Vigencia y terminación</SectionTitle>
        <Ol>
          <li>
            El acuerdo rige de forma indefinida desde que aceptas estos términos o
            activas la cuenta, hasta que se termine conforme a este apartado.
          </li>
          <li>
            Tú puedes cancelar con aviso escrito (incluido correo a soporte) con al
            menos treinta (30) días de anticipación. Los montos ya pagados por
            períodos no disfrutados no se reembolsan, salvo obligación legal.
          </li>
          <li>
            Nosotros podemos terminar con al menos sesenta (60) días de aviso, o de
            inmediato ante incumplimiento grave (fraude, ataque a la seguridad,
            violación de datos personales, uso delictivo de la Plataforma, entre
            otros).
          </li>
          <li>
            Si llevas más de siete (7) días en mora, podemos dar por terminado el
            servicio y exigir lo adeudado.
          </li>
          <li>
            También podemos modificar, suspender o discontinuar funciones. Si
            retiramos un módulo de forma permanente, te avisaremos y podrás liquidar
            saldos pendientes relacionados.
          </li>
          <li>
            Al terminar, cesa tu derecho de acceso. Siguen vigentes las cláusulas
            que por su naturaleza deban sobrevivir (propiedad intelectual, datos,
            confidencialidad, limitación de responsabilidad, ley aplicable).
          </li>
        </Ol>

        <SectionTitle>16. Integridad y prevención de ilícitos</SectionTitle>
        <P>
          Debes cumplir la normativa anticorrupción y de prevención de lavado de
          activos y financiación del terrorismo aplicable en {COMPANY_COUNTRY},
          incluyendo lo pertinente de la Ley 1474 de 2011 y normas relacionadas.
          Debes informarnos de inmediato si conoces hechos sospechosos vinculados al
          uso de la Plataforma. El incumplimiento puede llevar a suspensión o
          terminación del servicio y a las acciones legales correspondientes.
        </P>

        <SectionTitle>17. Módulo de pagos y recaudo (cuando esté habilitado)</SectionTitle>
        <P>
          Algunas cuentas pueden usar funciones de registro de pagos del consultorio
          y, en el futuro, cobros en línea o recaudo a través de pasarelas o aliados.
          Mientras esas funciones no estén activas para tu plan, este apartado no te
          genera obligaciones adicionales.
        </P>
        <Ol>
          <li>
            Cuando habilitemos cobros a pacientes u otros terceros a través de la
            Plataforma, el Prestador permanece responsable de la relación comercial y
            clínica con el paciente, de la exactitud de montos y conceptos, y de
            gestionar devoluciones, anulaciones o contracargos ante el banco o la
            pasarela cuando corresponda.
          </li>
          <li>
            Las comisiones, plazos de consignación y reglas operativas se publicarán
            en la Plataforma o se te notificarán por correo antes de usar el módulo.
            Podemos ajustarlas con al menos treinta (30) días de aviso; si no estás
            de acuerdo, puedes dejar de usar esa función o cancelar el servicio según
            la sección de terminación.
          </li>
          <li>
            Autorizas a {company} o al proveedor de pagos designado a compensar
            saldos a tu cargo (comisiones, contracargos, pagos indebidos) contra
            montos pendientes de girarte, cuando la ley y el contrato con la pasarela
            lo permitan.
          </li>
          <li>
            No respondemos por errores en datos bancarios que tú registres, por
            demoras de entidades financieras ajenas a nuestro control, ni por
            disputas entre Prestador y paciente sobre la calidad o el precio de la
            atención.
          </li>
          <li>
            Si el recaudo implica un mandato para recibir y girar fondos por cuenta
            del Prestador, ese mandato nace con la aceptación de este apartado y del
            módulo correspondiente, es oneroso en la medida de la comisión publicada,
            puede delegarse a terceros operadores previos aviso, y se puede revocar
            con al menos quince (15) días hábiles de anticipación, sin perjuicio de
            liquidar operaciones ya iniciadas.
          </li>
        </Ol>

        <SectionTitle>18. Servicios o complementos adicionales</SectionTitle>
        <P>
          Podemos ofrecer módulos o servicios extra con precio propio. Al activarlos
          aceptas su tarifa y condiciones específicas mostradas en ese momento. El
          no uso de un complemento ya cobrado no genera devolución automática.
          Podemos apoyarnos en subcontratistas para prestarlos.
        </P>

        <SectionTitle>19. Fuerza mayor y otras reglas generales</SectionTitle>
        <Ol>
          <li>
            Ninguna parte responde por incumplimientos causados por fuerza mayor o
            caso fortuito, siempre que avise en un plazo razonable. La falta de
            dinero no es fuerza mayor.
          </li>
          <li>
            Si un tribunal declara inválida alguna cláusula, el resto del acuerdo
            sigue vigente.
          </li>
          <li>
            No ejercer un derecho no implica renunciar a él.
          </li>
          <li>
            Cada parte asume sus propios costos e impuestos derivados de sus
            obligaciones.
          </li>
          <li>
            La aceptación electrónica (casilla, clic o medio equivalente) tiene
            plena validez entre las partes como expresión de consentimiento.
          </li>
        </Ol>

        <SectionTitle>20. Ley aplicable y controversias</SectionTitle>
        <Ol>
          <li>
            Este acuerdo se interpreta conforme a las leyes de la República de{" "}
            {COMPANY_COUNTRY}.
          </li>
          <li>
            Para notificaciones y efectos legales, el domicilio especial es{" "}
            {COMPANY_DOMICILE}.
          </li>
          <li>
            Primero intentaremos resolver cualquier diferencia de buena fe. Si no es
            posible, conocerán del asunto los jueces competentes de{" "}
            {COMPANY_DOMICILE}.
          </li>
        </Ol>

        <SectionTitle>21. Cambios a estos términos</SectionTitle>
        <P>
          Podemos actualizar este documento. Publicaremos la nueva versión en la
          Plataforma o en el sitio web e indicaremos la fecha de actualización. Si el
          cambio es material, te avisaremos por un medio razonable (por ejemplo,
          correo o aviso en el producto). El uso continuado después de la fecha
          efectiva implica aceptación, salvo que la ley exija un consentimiento
          explícito.
        </P>

        <SectionTitle>22. Contacto</SectionTitle>
        <P>
          Para dudas sobre estos términos o soporte de la Plataforma, escríbenos a{" "}
          <a
            href={`mailto:${COMPANY_SUPPORT_EMAIL}`}
            className="text-accent-500 underline-offset-2 hover:underline"
          >
            {COMPANY_SUPPORT_EMAIL}
          </a>{" "}
          o usa los canales publicados en el sitio de {company}.
        </P>

        <p className="mt-14 border-t border-ink-800 pt-6 text-xs text-ink-400">
          © {new Date().getFullYear()} {company}. Todos los derechos reservados.
        </p>
      </main>
    </div>
  );
};
