import Link from "next/link";
import {
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

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-sm leading-relaxed text-ink-300">{children}</p>
);

const Ol = ({ children }: { children: React.ReactNode }) => (
  <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-ink-300">
    {children}
  </ol>
);

const Ul = ({ children }: { children: React.ReactNode }) => (
  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-300">
    {children}
  </ul>
);

const ExtLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent-500 underline-offset-2 hover:underline"
  >
    {children}
  </a>
);

export const PrivacyPolicyTemplate = () => {
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
          Política de privacidad y tratamiento de datos personales
        </h1>
        <p className="mt-2 text-sm font-medium text-ink-200">{legalLabel}</p>
        <P>
          <i>
            Este documento es extenso a propósito: resume cómo {company} maneja
            datos personales. Te recomendamos leerlo completo.
          </i>
        </P>
        <P>
          Aquí explicamos qué información tratamos, para qué, con qué bases
          legales, durante cuánto tiempo y cómo puedes ejercer tus derechos de
          hábeas data. Nos guiamos, entre otras, por el artículo 15 de la
          Constitución Política, la{" "}
          <ExtLink href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981">
            Ley 1581 de 2012
          </ExtLink>
          , el{" "}
          <ExtLink href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646">
            Decreto 1377 de 2013
          </ExtLink>
          , la{" "}
          <ExtLink href="https://www.sic.gov.co/recursos_user/documentos/normatividad/Ley_1273_2009.pdf">
            Ley 1273 de 2009
          </ExtLink>{" "}
          y las normas que las actualicen.
        </P>

        <SectionTitle>1. Alcance y quiénes somos</SectionTitle>
        <P>
          Esta política aplica a quienes visitan nuestro sitio, se registran o
          usan la plataforma {company}, y a los datos personales que tratamos en
          ese contexto.
        </P>
        <P>
          {company} es un software en la nube para consultorios y prestadores de
          salud (pacientes, agenda, historia clínica, procedimientos,
          tratamientos, pagos y funciones relacionadas). Opera desde{" "}
          {COMPANY_DOMICILE}.
        </P>
        <P>
          En esta política, “{company}”, “nosotros” o “nuestro” designa a{" "}
          {legalLabel}
          {hasLegalEntity
            ? "."
            : `, marca bajo la cual se presta el servicio. Cuando exista sociedad registrada, se indicará aquí su razón social y NIT.`}
        </P>
        <P>
          Es importante distinguir dos escenarios:
        </P>
        <Ul>
          <li>
            <b>Datos de la cuenta, contacto comercial y uso del producto</b>{" "}
            (por ejemplo, el administrador del consultorio, Usuarios invitados,
            facturación, soporte): ahí {company} suele actuar como{" "}
            <b>responsable</b> del tratamiento.
          </li>
          <li>
            <b>Datos de pacientes e información clínica</b> que el consultorio
            carga en la Plataforma: el Prestador es el <b>responsable</b>;{" "}
            {company} actúa como <b>encargado</b>, procesándolos para prestar el
            servicio según las instrucciones del Prestador y la ley.
          </li>
        </Ul>

        <SectionTitle>2. Conceptos clave</SectionTitle>
        <Ul>
          <li>
            <b>Titular:</b> persona natural a quien se refieren los datos.
          </li>
          <li>
            <b>Dato personal:</b> cualquier información vinculada o que pueda
            vincularse a una o varias personas naturales.
          </li>
          <li>
            <b>Dato sensible:</b> aquel que afecta la intimidad o cuyo mal uso
            puede generar discriminación (por ejemplo, datos de salud). Su
            tratamiento exige reglas más estrictas.
          </li>
          <li>
            <b>Autorización:</b> consentimiento previo, expreso e informado del
            Titular cuando la ley lo exige.
          </li>
          <li>
            <b>Tratamiento:</b> cualquier operación sobre datos (recolectar,
            guardar, usar, circular, eliminar, etc.).
          </li>
          <li>
            <b>Responsable:</b> quien decide sobre el tratamiento.
          </li>
          <li>
            <b>Encargado:</b> quien trata datos por cuenta del responsable.
          </li>
          <li>
            <b>Base de datos:</b> conjunto organizado de datos personales objeto
            de tratamiento.
          </li>
          <li>
            <b>Transferencia:</b> envío de datos a otro responsable, dentro o
            fuera del país.
          </li>
          <li>
            <b>Aviso de privacidad:</b> comunicación que informa al Titular sobre
            esta política y los aspectos esenciales del tratamiento.
          </li>
        </Ul>
        <P>
          La obtención indebida o el uso no autorizado de datos personales puede
          constituir delito bajo la legislación penal colombiana. {company} no
          tolera esas conductas y cooperará con las autoridades cuando
          corresponda.
        </P>

        <SectionTitle>3. Principios que aplicamos</SectionTitle>
        <P>
          Tratamos los datos personales siguiendo, entre otros, estos principios:
        </P>
        <Ul>
          <li>
            <b>Legalidad:</b> solo tratamos datos conforme al marco normativo
            aplicable.
          </li>
          <li>
            <b>Finalidad:</b> cada tratamiento responde a un propósito legítimo e
            informado.
          </li>
          <li>
            <b>Libertad:</b> cuando se requiere autorización, debe ser previa,
            expresa e informada; no obtenemos ni divulgamos datos sin esa base o
            sin mandato legal o judicial.
          </li>
          <li>
            <b>Veracidad o calidad:</b> buscamos que la información sea completa,
            actualizada y comprensible; no debe inducir a error.
          </li>
          <li>
            <b>Transparencia:</b> el Titular puede conocer si existen datos
            suyos y cómo se usan, con las salvedades de ley.
          </li>
          <li>
            <b>Acceso y circulación restringida:</b> el acceso se limita a
            personas autorizadas o previstas en la ley; no publicamos datos no
            públicos en canales masivos sin controles adecuados.
          </li>
          <li>
            <b>Seguridad:</b> aplicamos medidas técnicas, humanas y
            administrativas razonables para evitar pérdida, adulteración o acceso
            indebido.
          </li>
          <li>
            <b>Confidencialidad:</b> quienes intervienen en el tratamiento deben
            guardar reserva, incluso después de terminar su vínculo con la
            operación.
          </li>
          <li>
            <b>Temporalidad:</b> conservamos los datos el tiempo necesario para
            la finalidad o el que exija la ley.
          </li>
        </Ul>

        <SectionTitle>4. Derechos de los titulares</SectionTitle>
        <P>
          Conforme al artículo 8 de la Ley 1581 de 2012 y normas
          complementarias, puedes, entre otros:
        </P>
        <Ul>
          <li>Conocer, actualizar y rectificar tus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada, cuando aplique.</li>
          <li>
            Pedir información sobre el uso que se ha dado a tus datos.
          </li>
          <li>
            Presentar quejas ante la Superintendencia de Industria y Comercio
            (SIC) por infracciones al régimen de datos.
          </li>
          <li>
            Revocar la autorización y/o pedir la eliminación de los datos cuando
            sea procedente según la ley (por ejemplo, si el tratamiento no
            respeta principios o garantías).
          </li>
          <li>
            Acceder de forma gratuita a los datos personales que hayan sido
            objeto de tratamiento, en los términos legales.
          </li>
        </Ul>
        <P>
          Para ejercer estos derechos frente a {company} cuando actuemos como
          responsables, escríbenos a{" "}
          <a
            href={`mailto:${COMPANY_SUPPORT_EMAIL}`}
            className="text-accent-500 underline-offset-2 hover:underline"
          >
            {COMPANY_SUPPORT_EMAIL}
          </a>
          . Si tus datos están tratados por un consultorio dentro de la
          Plataforma (por ejemplo, como paciente), en muchos casos debes dirigir
          la solicitud primero al Prestador, que es el responsable; podemos
          apoyar al Prestador en la gestión técnica cuando corresponda.
        </P>

        <SectionTitle>5. Compromisos de {company}</SectionTitle>
        <P>
          Cuando actuamos como responsables, y en lo aplicable como encargados,
          nos comprometemos a:
        </P>
        <Ul>
          <li>
            Respetar el hábeas data y facilitar el ejercicio de tus derechos.
          </li>
          <li>
            Conservar constancia de las autorizaciones cuando la ley las exija.
          </li>
          <li>
            Informar las finalidades del tratamiento y los derechos asociados.
          </li>
          <li>
            Proteger la información con medidas de seguridad razonables.
          </li>
          <li>
            Procurar que los datos que tratemos como responsables sean veraces y
            estén actualizados en la medida de lo que nos suministren.
          </li>
          <li>
            Atender consultas y reclamos por los canales aquí indicados.
          </li>
          <li>
            Informar a la SIC cuando existan incidentes de seguridad que pongan
            en riesgo la administración de datos personales, según la normativa.
          </li>
          <li>
            Cumplir instrucciones y requerimientos de la autoridad de
            protección de datos.
          </li>
        </Ul>

        <SectionTitle>6. Autorización y consentimiento</SectionTitle>
        <Ol>
          <li>
            Cuando la ley exige autorización, esta debe ser previa, expresa e
            informada. Conservaremos evidencia idónea de esa autorización y
            mecanismos razonables para verificarla.
          </li>
          <li>
            Esta política cubre el tratamiento que realiza {company}. No regula
            sitios, apps o servicios de terceros, aunque estén enlazados desde
            nuestra web o producto. Esos terceros tienen sus propias políticas.
          </li>
          <li>
            Los datos de menores de edad solo se tratan con autorización de
            padres, madres o representantes legales, o cuando otra base legal lo
            permita.
          </li>
          <li>
            Respecto de pacientes, el Prestador debe asegurar la autorización o
            base legal correspondientes antes de cargar información en{" "}
            {company}.
          </li>
        </Ol>

        <SectionTitle>7. Qué datos tratamos y para qué</SectionTitle>
        <P>
          Según el caso, podemos tratar o alojar categorías como:
        </P>
        <Ul>
          <li>
            Identificación y contacto (nombre, documento, correo, teléfono,
            dirección).
          </li>
          <li>
            Datos de cuenta y uso (usuario, roles, registros de acceso,
            preferencias, tickets de soporte).
          </li>
          <li>
            Datos de facturación y pago de la suscripción (medios de pago
            tokenizados vía pasarela, historial de cobros).
          </li>
          <li>
            Contenido que el Prestador registra sobre su operación (agenda,
            procedimientos, pagos del consultorio, notas).
          </li>
          <li>
            Datos de salud y demás información clínica o sensible que el
            Prestador introduzca en módulos de historia clínica u otros
            equivalentes.
          </li>
        </Ul>
        <P>
          <b>Finalidades cuando {company} es responsable</b> (cuenta, sitio,
          relación comercial), entre otras:
        </P>
        <Ul>
          <li>Crear y administrar cuentas, autenticación y seguridad.</li>
          <li>Prestar, mantener y mejorar el servicio contratado.</li>
          <li>Facturar, cobrar y gestionar la relación contractual.</li>
          <li>
            Atender soporte, notificaciones operativas y comunicaciones sobre el
            producto.
          </li>
          <li>
            Enviar información comercial o novedades del producto cuando exista
            autorización o otra base legal válida; puedes oponerte o revocar
            según la ley.
          </li>
          <li>
            Prevenir fraude, abuso y riesgos de seguridad; conservar logs
            necesarios.
          </li>
          <li>
            Cumplir obligaciones legales y atender requerimientos de autoridad.
          </li>
          <li>
            Elaborar estadísticas o análisis con datos agregados o anonimizados,
            sin identificar personas.
          </li>
        </Ul>
        <P>
          <b>Finalidades cuando {company} es encargado</b> (datos de pacientes y
          operación clínica del Prestador): alojar, procesar y mostrar la
          información solo para que el Prestador use la Plataforma, con copias
          de seguridad, soporte técnico autorizado y mejoras técnicas que no
          alteren el carácter de encargado, salvo acuerdo distinto.
        </P>

        <SectionTitle>8. Cómo obtenemos la información</SectionTitle>
        <Ul>
          <li>Registro y uso de la Plataforma o del sitio web.</li>
          <li>Formularios, correo, chat u otros canales de soporte.</li>
          <li>
            Información que el Prestador o sus Usuarios cargan sobre pacientes y
            la operación del consultorio.
          </li>
          <li>
            Encuestas o formularios que nosotros o un tercero en nuestro nombre
            realicen, cuando aplique.
          </li>
          <li>
            Fuentes públicas o terceros, solo si hay base legal o autorización.
          </li>
          <li>
            Datos técnicos de navegación o dispositivo necesarios para operar y
            asegurar el servicio (por ejemplo, dirección IP, tipo de navegador,
            eventos de seguridad), según la configuración del producto.
          </li>
        </Ul>

        <SectionTitle>9. Con quién compartimos datos</SectionTitle>
        <P>
          No vendemos datos personales. Podemos compartirlos solo en estos
          supuestos, entre otros:
        </P>
        <Ul>
          <li>
            <b>Proveedores</b> que nos ayudan a operar (hosting, correo,
            analítica, pasarelas de pago, soporte). Actúan como encargados o
            bajo contrato con obligaciones de confidencialidad y seguridad.
          </li>
          <li>
            <b>Autoridades</b> cuando una ley, orden judicial o requerimiento
            válido lo exija.
          </li>
          <li>
            <b>Protección de derechos</b> de {company}, de Usuarios o de
            terceros, frente a fraude, abuso o riesgos de seguridad.
          </li>
          <li>
            <b>Operaciones societarias</b> (fusión, adquisición u
            reorganización), caso en el cual los datos relevantes podrían
            transferirse al nuevo operador bajo protecciones equivalentes y, si
            aplica, aviso a los titulares.
          </li>
          <li>
            Con tu <b>consentimiento</b> o instrucción expresa, cuando
            corresponda.
          </li>
        </Ul>
        <P>
          Podemos usar infraestructura en la nube ubicada dentro o fuera del
          país. Si hay transferencia internacional, buscaremos que el receptor
          ofrezca niveles adecuados de protección o mecanismos
          contractuales/legales válidos bajo la normativa aplicable.
        </P>

        <SectionTitle>10. Datos sensibles</SectionTitle>
        <P>
          {company} no busca recolectar datos sensibles por cuenta propia fuera
          de lo necesario para el producto. Cuando el Prestador registra datos
          de salud u otros sensibles en la Plataforma, ese tratamiento responde
          a la relación Prestador–paciente y a las autorizaciones o bases
          legales que el Prestador debe gestionar. El acceso interno nuestro a
          ese contenido se limita a lo estrictamente necesario (soporte,
          seguridad, cumplimiento) y no se usa para finalidades ajenas a las
          autorizadas.
        </P>

        <SectionTitle>11. Niños, niñas y adolescentes</SectionTitle>
        <P>
          El servicio está dirigido a consultorios y profesionales. Si se
          registran datos de menores (por ejemplo, como pacientes del
          Prestador), el Prestador debe contar con la autorización del
          representante legal y respetar el interés superior del menor. No
          prestamos el servicio a menores que pretendan contratar por sí mismos
          sin esa autorización.
        </P>

        <SectionTitle>12. Conservación</SectionTitle>
        <Ul>
          <li>
            Conservamos los datos mientras sean necesarios para las finalidades
            informadas o mientras exista una relación contractual activa.
          </li>
          <li>
            Tras el cierre de la cuenta, podemos retener cierta información el
            tiempo que exijan obligaciones legales, contables, de seguridad o de
            defensa de reclamos (plazos de prescripción).
          </li>
          <li>
            Las solicitudes de información, quejas o ejercicio de derechos se
            conservan el tiempo necesario para tramitarlas y el que establezca
            la ley.
          </li>
          <li>
            Los datos usados para comunicaciones comerciales se mantienen hasta
            que revoques el consentimiento u opongas el tratamiento, cuando esa
            sea la base.
          </li>
        </Ul>

        <SectionTitle>13. Cómo presentar consultas y reclamos</SectionTitle>
        <P>
          Canal principal: correo{" "}
          <a
            href={`mailto:${COMPANY_SUPPORT_EMAIL}`}
            className="text-accent-500 underline-offset-2 hover:underline"
          >
            {COMPANY_SUPPORT_EMAIL}
          </a>
          . También puedes usar los canales de soporte disponibles dentro de la
          Plataforma cuando estés autenticado.
        </P>
        <P>
          Incluye en tu mensaje: nombre completo, medio de contacto,
          descripción clara de la solicitud (consulta, corrección, eliminación,
          revocatoria, etc.) y documentos que acrediten tu identidad o
          representación, si aplica.
        </P>
        <Ul>
          <li>
            <b>Consultas:</b> responderemos en un máximo de diez (10) días
            hábiles contados desde el día hábil siguiente a la recepción,
            prorrogables según la ley con explicación de la demora.
          </li>
          <li>
            <b>Reclamos</b> (corrección, actualización, eliminación o
            incumplimiento): atenderemos en un máximo de quince (15) días
            hábiles contados desde el día hábil siguiente a la recepción,
            también prorrogables conforme a la normativa.
          </li>
        </Ul>
        <P>
          Si no obtienes respuesta oportuna o no estás de acuerdo con ella,
          puedes acudir a la Superintendencia de Industria y Comercio.
        </P>

        <SectionTitle>14. Seguridad</SectionTitle>
        <P>
          Implementamos controles razonables de acceso, cifrado en tránsito
          cuando aplica, separación de entornos y prácticas de desarrollo
          orientadas a reducir riesgos. Ningún sistema es 100 % invulnerable: si
          detectas un incidente, notifícalo de inmediato al correo de contacto.
          Ante violaciones de seguridad relevantes, actuaremos conforme a la ley
          y a nuestros protocolos internos.
        </P>

        <SectionTitle>15. Vigencia y cambios</SectionTitle>
        <P>
          Esta política rige desde la fecha de última actualización indicada
          arriba. Podemos modificarla para reflejar cambios legales, del
          producto o de nuestras prácticas. Publicaremos la versión vigente en
          el sitio y, si el cambio es material, avisaremos por un medio
          razonable (correo, aviso en la Plataforma u otro canal). El uso
          continuado después de la fecha efectiva puede implicar aceptación de
          los cambios, sin perjuicio de que solicitemos una nueva autorización
          cuando la ley lo exija.
        </P>

        <SectionTitle>16. Contacto</SectionTitle>
        <P>
          Responsable / contacto de privacidad (marca {company}): {legalLabel}.
        </P>
        <P>
          Domicilio de referencia: {COMPANY_DOMICILE}.
        </P>
        <P>
          Correo:{" "}
          <a
            href={`mailto:${COMPANY_SUPPORT_EMAIL}`}
            className="text-accent-500 underline-offset-2 hover:underline"
          >
            {COMPANY_SUPPORT_EMAIL}
          </a>
        </P>

        <p className="mt-14 border-t border-ink-800 pt-6 text-xs text-ink-400">
          © {new Date().getFullYear()} {company}. Todos los derechos reservados.
        </p>
      </main>
    </div>
  );
};
