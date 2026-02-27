'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import DashboardPage from '@/components/misc/DashboardPage'

type Section = {
  title: string
  level?: 2 | 3
  paragraphs?: string[]
  bullets?: string[]
}

type PolicyCopy = {
  pageTitle: string
  pageSubtitle: string
  tabs: {
    terms: string
    cyber: string
    privacy: string
  }
  terms: Section[]
  cyber: Section[]
  privacy: Section[]
}

const content: Record<'en' | 'es', PolicyCopy> = {
  en: {
    pageTitle: 'Terms of Use, Policies & Disclosures',
    pageSubtitle: 'Explore all regulations we follow',
    tabs: {
      terms: 'Terms & Disclosures',
      cyber: 'Cyber Security Policy',
      privacy: 'Data Privacy Policy'
    },
    terms: [
      {
        title: 'Introduction',
        paragraphs: [
          'AGM Technology (BVI) Inc., known as AGM Trader Broker & Advisor, is a company registered in the British Virgin Islands (BVI) under number 2045201 and is regulated by the BVI Financial Services Commission (BVIFSC). Its legal address is Commerce House, Wickhams Cay 1, Road Town, Tortola, British Virgin Islands, VG1110.',
          'Customer accounts are held and securities are cleared through Interactive Brokers LLC (IBKR). Interactive Brokers LLC is a registered broker-dealer, member of the Commodity Futures Trading Commission (CFTC) and forex dealer, regulated by the U.S. Securities and Exchange Commission (SEC), the Commodity Futures Trading Commission (CFTC), and the National Futures Association (NFA), and is a member of the Financial Industry Regulatory Authority (FINRA) and various other self-regulatory organizations.'
        ]
      },
      {
        title: 'Terms of Use Agreement',
        paragraphs: [
          'By browsing and/or using this website (www.agmtechnology.com) and/or any material, software, code, or service obtained on or from this website ("Site"), you agree to comply with the terms of these Terms of Use Agreement. If you do not agree with these terms, you must stop using the Site immediately.',
          'YOU MAY NOT COPY, REPRODUCE, RECOMPILE, DECOMPILE, DISASSEMBLE, REVERSE ENGINEER, DISTRIBUTE, PUBLISH, DISPLAY, PERFORM, MODIFY, UPLOAD, CREATE DERIVATIVE WORKS FROM, TRANSMIT, OR EXPLOIT IN ANY WAY ALL OR ANY PART OF THE SITE.'
        ]
      },
      {
        title: 'Copyright',
        paragraphs: [
          "Copyright © 1995-2021 General Shareholders' Meeting. All rights reserved. All text, images, graphics, animations, videos, music, sounds, software, code, and other materials on the Site are subject to the copyright and other intellectual property rights of AGM, its affiliated companies, and its licensors. AGM owns the copyright in the selection, coordination, and arrangement of the materials on this Site."
        ]
      },
      {
        title: 'No Advice',
        paragraphs: [
          'The content is intended solely for professionals in the financial markets and is not, nor should it be construed as, financial, legal, or other advice of any kind, nor should it be considered an offer or solicitation of an offer to buy, sell, or otherwise trade in any investment.'
        ]
      },
      {
        title: 'Access',
        paragraphs: [
          'You acknowledge that the login access codes and passwords provided to you are for your exclusive use and may not be shared. You must ensure that your login access code and password are kept confidential.'
        ]
      },
      {
        title: 'Indemnification',
        paragraphs: [
          'You will indemnify, defend, and hold harmless AGM and its affiliates, directors, officers, agents, employees, successors, assigns, and all data providers from any claims, judgments, or proceedings brought by third parties against AGM arising from your use of this website and/or content.'
        ]
      },
      {
        title: 'Third-Party Websites',
        paragraphs: [
          'This Site may provide links to certain websites sponsored and maintained by AGM, as well as those sponsored or maintained by third parties. Such third-party websites are publicly available, and AGM provides access to such websites through this site solely for your convenience.'
        ]
      },
      {
        title: 'No Warranties',
        paragraphs: [
          'THIS SITE AND THE INFORMATION AND MATERIAL IT CONTAINS ARE SUBJECT TO CHANGE AT ANY TIME BY AGM WITHOUT NOTICE. THIS SITE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.'
        ]
      },
      {
        title: 'No Liability',
        paragraphs: [
          'AGM and its directors, officers, employees, and agents shall have no liability for the accuracy, timeliness, completeness, reliability, performance, or continued availability of this Site.'
        ]
      },
      {
        title: 'Governing Law',
        paragraphs: [
          'Your access and use of this website are governed by and will be construed in accordance with the laws of the British Virgin Islands, without regard to the conflict of laws principles of other jurisdictions.'
        ]
      }
    ],
    cyber: [
      {
        title: 'Policy Brief & Purpose',
        paragraphs: [
          "This Cyber Security Policy outlines AGM Technology (BVI) Inc.'s guidelines and provisions for preserving the security of our data and technology infrastructure. As an introducing firm that facilitates brokerage accounts through Interactive Brokers LLC (IBKR), we collect, store, and manage sensitive client financial and identification information. This makes us particularly vulnerable to security breaches, which can result from human errors, malicious attacks, or system malfunctions.",
          "For these reasons, AGM Technology (BVI) Inc. has implemented a comprehensive set of security measures and prepared clear instructions to mitigate cyber security risks. This policy details both our proactive provisions and the protective measures in place."
        ]
      },
      {
        title: 'Scope',
        paragraphs: [
          'This policy applies to all AGM Technology (BVI) Inc. employees, contractors, volunteers, and anyone who has permanent or temporary access to our systems, networks, and hardware, whether on-site at our offices in Escazu Village, Costa Rica, or remotely. It covers all company-owned devices, as well as personal devices used for business purposes.'
        ]
      },
      {
        title: 'Policy Elements',
        level: 2
      },
      {
        title: 'Confidential Data',
        level: 3,
        paragraphs: [
          'Confidential data at AGM Technology (BVI) Inc. is secret and valuable, and its protection is paramount. Common examples include:'
        ],
        bullets: [
          'Unpublished financial information: Internal financial reports, investment strategies, and proprietary trading data.',
          'Client data: All personally identifiable information (PII), financial records, tax residency details, account numbers, and transaction histories.',
          'Partner/vendor data: Confidential information pertaining to our clearing firm (IBKR) and other service providers.',
          'Proprietary information: Any patents, unique methodologies, new technologies, or business development plans.',
          'Customer lists: Existing and prospective client lists.'
        ]
      },
      {
        title: 'Protect Personal and Company Devices',
        level: 3,
        paragraphs: [
          "When employees use their digital devices to access AGM Technology (BVI) Inc.'s accounts and systems, whether company-issued or personal, strict security protocols apply:"
        ],
        bullets: [
          'Device security: Devices must be password-protected with strong, unique passwords or biometric authentication, with automatic screen lock enabled.',
          'Software updates: Operating systems, antivirus software, and applications must be kept up to date with current security patches.',
          'Antivirus software: Devices must have approved antivirus/anti-malware software actively running with scheduled scans.',
          'Physical security: Devices should never be left unattended in public places and must be secured in private environments.',
          'No unauthorized software: Employees may not install unauthorized software on company devices or access company networks from unapproved devices.',
          "VPN usage: A secure VPN connection must be used when accessing AGM's systems from outside the corporate network."
        ]
      },
      {
        title: 'Email and Internet Use',
        level: 3,
        paragraphs: [
          'Email and internet are essential communication tools, but they also represent significant security vulnerabilities:'
        ],
        bullets: [
          'Email security: Employees must be cautious with unknown senders or unexpected attachments and report phishing attempts immediately.',
          'Strong passwords: Company email accounts and online services must use strong, unique passwords and multi-factor authentication where possible.',
          'Internet browsing: Access to malicious or unauthorized websites is prohibited.',
          'Sensitive information by email: Avoid sending highly confidential data by unencrypted email; use secure transfer methods.',
          'Cloud services: Unauthorized cloud storage or collaboration services for company data are prohibited.'
        ]
      },
      {
        title: 'Networks and Servers',
        level: 3,
        paragraphs: [
          "The security of AGM Technology (BVI) Inc.'s networks and servers is critical:"
        ],
        bullets: [
          'Access control: Network and server access is restricted to authorized personnel based on least privilege.',
          'Network security: Firewalls and detection/prevention controls are deployed and monitored.',
          'Regular audits: Security configurations are regularly audited and tested for vulnerabilities.',
          'Data backup: Critical data is backed up regularly to secure off-site locations.'
        ]
      },
      {
        title: 'Incident Response',
        level: 3,
        paragraphs: [
          "Despite preventative measures, security incidents may occur. AGM Technology (BVI) Inc. has an incident response plan to address these events:"
        ],
        bullets: [
          'Reporting incidents: Suspected or actual incidents must be reported immediately to the Compliance Officer and CEO.',
          'Investigation: Reported incidents are promptly investigated to determine scope, cause, and impact.',
          'Containment and recovery: Steps are taken to contain incidents, remove threats, and restore affected systems.',
          'Notification: Affected individuals and regulators are notified as required by law.',
          'Post-incident review: Reviews are conducted to implement improvements and prevent recurrence.'
        ]
      },
      {
        title: 'Software Restrictions',
        level: 3,
        paragraphs: [
          'To maintain security and operational integrity, AGM Technology (BVI) Inc. enforces software restrictions:'
        ],
        bullets: [
          'Approved software only: Only authorized, licensed software may be used.',
          'No pirated software: Use or installation of unlicensed or illegally obtained software is prohibited.',
          'Regular audits: Installed software is audited periodically for policy compliance.'
        ]
      },
      {
        title: 'Remote Employees',
        level: 3,
        paragraphs: [
          "Remote employees are integral to AGM Technology (BVI) Inc.'s operations and must adhere to this policy with particular diligence:"
        ],
        bullets: [
          'Remote employees must follow all policy instructions.',
          'They must comply with encryption and data protection standards and secure their private networks.',
          'They must secure home Wi-Fi, use VPNs for company access, and keep devices protected and updated.',
          'They should seek guidance from the Compliance Officer for security concerns.'
        ]
      },
      {
        title: 'Disciplinary Action',
        level: 3,
        paragraphs: [
          'AGM Technology (BVI) Inc. expects all employees to follow this policy at all times. Security breaches or disregard for security instructions may result in disciplinary action:'
        ],
        bullets: [
          'Minor first-time unintentional breaches may result in a verbal warning and additional training.',
          'Intentional, repeated, or large-scale breaches may result in severe disciplinary action, including termination.',
          'Progressive discipline may apply even when non-compliant behavior has not yet caused a breach.'
        ]
      },
      {
        title: 'Take Security Seriously',
        level: 3,
        paragraphs: [
          'Everyone, from clients and partners to employees and contractors, should feel that their data is safe with AGM Technology (BVI) Inc. Maintaining this trust requires vigilance, continuous education, and strong daily security practices.'
        ]
      }
    ],
    privacy: [
      {
        title: 'Introduction and Purpose',
        paragraphs: [
          "At AGM, we recognize that the confidentiality and security of the personal information that you share with us is of paramount importance. Our commitment is to protect the privacy of all personal information, including that of our clients, employees, agents, job applicants, and other third parties. By using our products, services, and applications, you consent to the collection, use, and disclosure of your personal information in accordance with this policy."
        ]
      },
      {
        title: 'Scope',
        paragraphs: [
          'This manual applies to all AGM employees, contractors, volunteers, and any other individual who has permanent or temporary access to our systems and data. It provides the framework for our procedures and protocols related to the handling of personal information.'
        ]
      },
      {
        title: 'Who is Responsible for Your Personal Information?',
        paragraphs: [
          'AGM Technology (BVI) Inc. is the entity responsible for the personal information that it collects, processes, and stores. The Compliance Officer is the designated privacy officer responsible for overseeing the implementation and enforcement of this policy.'
        ]
      },
      {
        title: 'Collection and Use of Personal Information',
        paragraphs: [
          'We collect personal information to provide our services, meet regulatory requirements, and operate our business effectively. The types of information we may collect include, but are not limited to:'
        ],
        bullets: [
          'Personally identifiable information (PII): Name, address, date of birth, nationality, and tax identification number (TIN).',
          'Contact information: Email address, phone number, and physical address.',
          'Financial data: Bank account details, transaction history, and investment portfolio information.',
          'Due diligence information: Documents related to identity verification and source of wealth.',
          'This information is used to establish identity, process transactions, fulfill regulatory reporting obligations, and communicate with clients regarding their accounts and services.'
        ]
      },
      {
        title: 'Disclosure of Personal Information',
        paragraphs: [
          'We do not sell or rent personal information to third parties. Information may be disclosed to regulatory and governmental bodies as required by law, third-party service providers supporting operations, and legal/professional advisors when needed.',
          'Any third-party provider we use must adhere to strict data protection standards and may only use the information for authorized purposes.'
        ]
      },
      {
        title: 'Data Security and Protection',
        paragraphs: [
          'AGM is committed to protecting all personal information from unauthorized access, loss, misuse, or alteration. We implement technical, physical, and administrative safeguards.',
        ],
        bullets: [
          'Technical safeguards: Encryption for data in transit and at rest, with strict access controls.',
          'Physical safeguards: Physical records are stored in secure, restricted locations.',
          'Administrative safeguards: Employees are trained on privacy protocols and must comply with our cyber security policy and code of ethics.'
        ]
      },
      {
        title: 'Your Rights and Choices',
        paragraphs: [
          'You may request access to your personal information, ask for corrections, or inquire about its use. Requests are handled in accordance with applicable laws, and identity verification may be required before disclosure.'
        ]
      },
      {
        title: 'Updates to this Privacy Policy',
        paragraphs: [
          'This policy may be updated from time to time to reflect changes in legal requirements or business practices. Updates take effect once posted on our website or otherwise published.'
        ]
      },
      {
        title: 'How to Contact Us',
        paragraphs: [
          'If you have questions about our privacy policy, contact us at info@agmtechnology.com.'
        ]
      }
    ]
  },
  es: {
    pageTitle: 'Términos de Uso, Políticas y Divulgaciones',
    pageSubtitle: 'Explora todas las regulaciones que seguimos',
    tabs: {
      terms: 'Términos y Divulgaciones',
      cyber: 'Política de Ciberseguridad',
      privacy: 'Política de Privacidad de Datos'
    },
    terms: [
      {
        title: 'Introducción',
        paragraphs: [
          'AGM Technology (BVI) Inc., conocida como AGM Trader Broker & Advisor, es una compañía registrada en las Islas Vírgenes Británicas (BVI) bajo el número 2045201 y regulada por la BVI Financial Services Commission (BVIFSC). Su dirección legal es Commerce House, Wickhams Cay 1, Road Town, Tortola, Islas Vírgenes Británicas, VG1110.',
          'Las cuentas de clientes y la compensación de valores se gestionan a través de Interactive Brokers LLC (IBKR). Interactive Brokers LLC es un broker-dealer registrado, miembro de la Commodity Futures Trading Commission (CFTC) y dealer de forex, regulado por la U.S. Securities and Exchange Commission (SEC), la CFTC y la National Futures Association (NFA), además de ser miembro de FINRA y otras organizaciones autorreguladas.'
        ]
      },
      {
        title: 'Acuerdo de Términos de Uso',
        paragraphs: [
          'Al navegar y/o usar este sitio web (www.agmtechnology.com) y/o cualquier material, software, código o servicio obtenido en o desde este sitio ("Sitio"), aceptas cumplir con los términos de este Acuerdo de Términos de Uso. Si no estás de acuerdo con estos términos, debes dejar de usar el Sitio inmediatamente.',
          'NO PUEDES COPIAR, REPRODUCIR, RECOMPILAR, DESCOMPILAR, DESENSAMBLAR, REALIZAR INGENIERÍA INVERSA, DISTRIBUIR, PUBLICAR, MOSTRAR, EJECUTAR, MODIFICAR, CARGAR, CREAR OBRAS DERIVADAS, TRANSMITIR O EXPLOTAR DE CUALQUIER FORMA TODO O PARTE DEL SITIO.'
        ]
      },
      {
        title: 'Derechos de Autor',
        paragraphs: [
          'Copyright © 1995-2021 General Shareholders\' Meeting. Todos los derechos reservados. Todo texto, imágenes, gráficos, animaciones, videos, música, sonidos, software, código y demás materiales del Sitio están sujetos a derechos de autor y otros derechos de propiedad intelectual de AGM, sus afiliadas y sus licenciatarios. AGM posee los derechos sobre la selección, coordinación y disposición de los materiales de este Sitio.'
        ]
      },
      {
        title: 'Sin Asesoría',
        paragraphs: [
          'El contenido está destinado únicamente a profesionales de los mercados financieros y no constituye, ni debe interpretarse como, asesoría financiera, legal u otra de cualquier tipo. Tampoco debe considerarse una oferta o solicitud para comprar, vender u operar cualquier inversión.'
        ]
      },
      {
        title: 'Acceso',
        paragraphs: [
          'Reconoces que los códigos de acceso y contraseñas proporcionados son para tu uso exclusivo y no pueden compartirse. Debes asegurar que dichos credenciales se mantengan confidenciales.'
        ]
      },
      {
        title: 'Indemnización',
        paragraphs: [
          'Indemnizarás, defenderás y mantendrás indemne a AGM y sus afiliadas, directores, funcionarios, agentes, empleados, sucesores, cesionarios y proveedores de datos frente a cualquier reclamación, sentencia o procedimiento de terceros derivado de tu uso de este sitio web y/o su contenido.'
        ]
      },
      {
        title: 'Sitios Web de Terceros',
        paragraphs: [
          'Este Sitio puede incluir enlaces a sitios patrocinados y mantenidos por AGM, así como por terceros. Dichos sitios de terceros son públicos, y AGM facilita el acceso a ellos únicamente para tu conveniencia.'
        ]
      },
      {
        title: 'Sin Garantías',
        paragraphs: [
          'ESTE SITIO Y LA INFORMACIÓN Y MATERIALES QUE CONTIENE PUEDEN CAMBIAR EN CUALQUIER MOMENTO POR AGM SIN PREVIO AVISO. ESTE SITIO SE PROPORCIONA "TAL CUAL", SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS.'
        ]
      },
      {
        title: 'Sin Responsabilidad',
        paragraphs: [
          'AGM y sus directores, funcionarios, empleados y agentes no serán responsables por la exactitud, oportunidad, integridad, confiabilidad, desempeño o disponibilidad continua de este Sitio.'
        ]
      },
      {
        title: 'Ley Aplicable',
        paragraphs: [
          'Tu acceso y uso de este sitio web se rigen e interpretan conforme a las leyes de las Islas Vírgenes Británicas, sin considerar principios de conflicto de leyes de otras jurisdicciones.'
        ]
      }
    ],
    cyber: [
      {
        title: 'Resumen y Propósito de la Política',
        paragraphs: [
          'Esta Política de Ciberseguridad describe las directrices y disposiciones de AGM Technology (BVI) Inc. para preservar la seguridad de nuestros datos e infraestructura tecnológica. Como firma introductora que facilita cuentas de corretaje a través de Interactive Brokers LLC (IBKR), recopilamos, almacenamos y gestionamos información financiera y de identificación sensible de clientes.',
          'Por estas razones, AGM Technology (BVI) Inc. ha implementado un conjunto integral de medidas de seguridad e instrucciones claras para mitigar riesgos de ciberseguridad. Esta política detalla nuestras medidas preventivas y de protección.'
        ]
      },
      {
        title: 'Alcance',
        paragraphs: [
          'Esta política aplica a todos los empleados, contratistas, voluntarios y cualquier persona con acceso permanente o temporal a nuestros sistemas, redes y hardware, tanto en sitio como de forma remota. Cubre dispositivos de la empresa y dispositivos personales utilizados para fines laborales.'
        ]
      },
      {
        title: 'Elementos de la Política',
        level: 2
      },
      {
        title: 'Datos Confidenciales',
        level: 3,
        paragraphs: [
          'Los datos confidenciales en AGM Technology (BVI) Inc. son secretos y valiosos, y su protección es prioritaria. Ejemplos comunes incluyen:'
        ],
        bullets: [
          'Información financiera no publicada: reportes internos, estrategias de inversión y datos propietarios de trading.',
          'Datos de clientes: información personal identificable (PII), registros financieros, residencia fiscal, números de cuenta e historiales de transacciones.',
          'Datos de socios/proveedores: información confidencial de nuestra firma de clearing (IBKR) y otros proveedores.',
          'Información propietaria: patentes, metodologías únicas, nuevas tecnologías o planes de negocio.',
          'Listas de clientes: listas de clientes actuales y potenciales.'
        ]
      },
      {
        title: 'Protección de Dispositivos Personales y Corporativos',
        level: 3,
        paragraphs: [
          'Cuando los empleados usan dispositivos para acceder a cuentas y sistemas de AGM Technology (BVI) Inc., aplican protocolos estrictos de seguridad:'
        ],
        bullets: [
          'Seguridad de dispositivos: protección con contraseñas fuertes o biometría y bloqueo automático de pantalla.',
          'Actualizaciones: sistemas operativos, antivirus y aplicaciones deben mantenerse actualizados con parches de seguridad.',
          'Antivirus: dispositivos con software antivirus/antimalware aprobado y escaneos programados.',
          'Seguridad física: no dejar dispositivos desatendidos en lugares públicos y protegerlos en entornos privados.',
          'Sin software no autorizado: no instalar software no autorizado ni acceder con dispositivos no aprobados.',
          'Uso de VPN: usar conexión VPN segura fuera de la red corporativa.'
        ]
      },
      {
        title: 'Uso de Correo e Internet',
        level: 3,
        paragraphs: [
          'El correo electrónico e internet son herramientas esenciales, pero también representan vulnerabilidades de seguridad:'
        ],
        bullets: [
          'Seguridad de correo: cautela con remitentes desconocidos o adjuntos inesperados y reporte inmediato de phishing.',
          'Contraseñas fuertes: cuentas y servicios con contraseñas robustas y autenticación multifactor cuando sea posible.',
          'Navegación: acceso prohibido a sitios maliciosos o no autorizados.',
          'Información sensible por correo: evitar enviar datos altamente confidenciales sin cifrado.',
          'Servicios en la nube: prohibido usar almacenamiento o colaboración no autorizados para datos de la empresa.'
        ]
      },
      {
        title: 'Redes y Servidores',
        level: 3,
        paragraphs: [
          'La seguridad de redes y servidores de AGM Technology (BVI) Inc. es crítica:'
        ],
        bullets: [
          'Control de acceso: acceso restringido a personal autorizado bajo principio de mínimo privilegio.',
          'Seguridad de red: firewalls y controles de detección/previsión desplegados y monitoreados.',
          'Auditorías: configuraciones auditadas y evaluadas periódicamente para detectar vulnerabilidades.',
          'Respaldo de datos: respaldo regular de datos críticos en ubicaciones seguras externas.'
        ]
      },
      {
        title: 'Respuesta a Incidentes',
        level: 3,
        paragraphs: [
          'Aunque existan medidas preventivas, pueden ocurrir incidentes. AGM Technology (BVI) Inc. cuenta con un plan de respuesta:'
        ],
        bullets: [
          'Reporte de incidentes: incidentes reales o sospechosos deben reportarse de inmediato al Oficial de Cumplimiento y al CEO.',
          'Investigación: incidentes reportados se investigan prontamente para determinar alcance, causa e impacto.',
          'Contención y recuperación: acciones para contener, eliminar amenazas y restaurar sistemas afectados.',
          'Notificación: se notificará a personas afectadas y reguladores cuando la ley lo requiera.',
          'Revisión posterior: evaluación para implementar mejoras y prevenir recurrencias.'
        ]
      },
      {
        title: 'Restricciones de Software',
        level: 3,
        paragraphs: [
          'Para mantener la seguridad e integridad operativa, AGM Technology (BVI) Inc. aplica restricciones de software:'
        ],
        bullets: [
          'Solo software aprobado: uso exclusivo de software autorizado y con licencia.',
          'Sin software pirata: prohibido usar o instalar software ilegal o sin licencia.',
          'Auditorías periódicas: revisión del software instalado para verificar cumplimiento.'
        ]
      },
      {
        title: 'Personal Remoto',
        level: 3,
        paragraphs: [
          'El personal remoto es clave para la operación y debe cumplir esta política con especial diligencia:'
        ],
        bullets: [
          'Seguir todas las instrucciones de la política.',
          'Cumplir estándares de cifrado y protección de datos y asegurar su red privada.',
          'Proteger Wi-Fi doméstico, usar VPN para accesos corporativos y mantener dispositivos actualizados.',
          'Consultar al Oficial de Cumplimiento ante cualquier duda de seguridad.'
        ]
      },
      {
        title: 'Acción Disciplinaria',
        level: 3,
        paragraphs: [
          'AGM Technology (BVI) Inc. espera que todo el personal cumpla esta política en todo momento. Incumplimientos o brechas pueden resultar en medidas disciplinarias:'
        ],
        bullets: [
          'Brechas menores e involuntarias pueden recibir advertencia verbal y capacitación adicional.',
          'Brechas intencionales, repetidas o de gran escala pueden conllevar sanciones severas, incluido despido.',
          'Puede aplicarse disciplina progresiva incluso sin una brecha efectiva.'
        ]
      },
      {
        title: 'Tomar la Seguridad en Serio',
        level: 3,
        paragraphs: [
          'Queremos que clientes, socios, empleados y contratistas sientan que sus datos están seguros con AGM Technology (BVI) Inc. Mantener esa confianza requiere vigilancia, educación continua y buenas prácticas diarias de seguridad.'
        ]
      }
    ],
    privacy: [
      {
        title: 'Introducción y Propósito',
        paragraphs: [
          'En AGM reconocemos que la confidencialidad y seguridad de la información personal que compartes con nosotros es de máxima importancia. Nuestro compromiso es proteger la privacidad de toda información personal, incluyendo la de clientes, empleados, agentes, postulantes y terceros. Al utilizar nuestros productos, servicios y aplicaciones, aceptas la recopilación, uso y divulgación de tu información personal conforme a esta política.'
        ]
      },
      {
        title: 'Alcance',
        paragraphs: [
          'Este manual aplica a todos los empleados, contratistas, voluntarios y cualquier persona con acceso permanente o temporal a nuestros sistemas y datos. Establece el marco de procedimientos y protocolos para el manejo de información personal.'
        ]
      },
      {
        title: '¿Quién es Responsable de tu Información Personal?',
        paragraphs: [
          'AGM Technology (BVI) Inc. es la entidad responsable de la información personal que recopila, procesa y almacena. El Oficial de Cumplimiento es la persona designada para supervisar la implementación y cumplimiento de esta política.'
        ]
      },
      {
        title: 'Recopilación y Uso de Información Personal',
        paragraphs: [
          'Recopilamos información personal para prestar servicios, cumplir requisitos regulatorios y operar nuestro negocio. Los tipos de información pueden incluir:'
        ],
        bullets: [
          'Información personal identificable (PII): nombre, dirección, fecha de nacimiento, nacionalidad y número de identificación fiscal (TIN).',
          'Información de contacto: correo electrónico, número telefónico y dirección física.',
          'Datos financieros: cuentas bancarias, historial de transacciones e información de portafolio.',
          'Información de debida diligencia: documentos de verificación de identidad y fuente de riqueza.',
          'Esta información se usa para validar identidad, procesar transacciones, cumplir reportes regulatorios y comunicarnos con clientes sobre sus cuentas y servicios.'
        ]
      },
      {
        title: 'Divulgación de Información Personal',
        paragraphs: [
          'No vendemos ni alquilamos información personal a terceros. La información puede divulgarse a entidades regulatorias y gubernamentales cuando la ley lo requiera, proveedores externos que apoyan la operación, y asesores legales/profesionales cuando sea necesario.',
          'Todo proveedor externo debe cumplir estándares estrictos de protección de datos y solo puede usar la información para fines autorizados.'
        ]
      },
      {
        title: 'Seguridad y Protección de Datos',
        paragraphs: [
          'AGM está comprometida con proteger la información personal contra accesos no autorizados, pérdida, uso indebido o alteración. Implementamos salvaguardas técnicas, físicas y administrativas.'
        ],
        bullets: [
          'Salvaguardas técnicas: cifrado en tránsito y reposo, con controles estrictos de acceso.',
          'Salvaguardas físicas: registros físicos almacenados en ubicaciones seguras y restringidas.',
          'Salvaguardas administrativas: capacitación periódica y cumplimiento de política de ciberseguridad y código de ética.'
        ]
      },
      {
        title: 'Tus Derechos y Opciones',
        paragraphs: [
          'Puedes solicitar acceso a tu información personal, pedir correcciones o consultar su uso. Las solicitudes se atienden conforme a la ley aplicable y puede requerirse verificación de identidad.'
        ]
      },
      {
        title: 'Actualizaciones de esta Política de Privacidad',
        paragraphs: [
          'Esta política puede actualizarse periódicamente para reflejar cambios legales o de prácticas de negocio. Las actualizaciones entran en vigor al publicarse en nuestro sitio web o por otros medios oficiales.'
        ]
      },
      {
        title: 'Cómo Contactarnos',
        paragraphs: [
          'Si tienes preguntas sobre nuestra política de privacidad, contáctanos en info@agmtechnology.com.'
        ]
      }
    ]
  }
}

const renderSections = (sections: Section[]) =>
  sections.map((section) => {
    const Heading = section.level === 3 ? 'h3' : 'h2'

    return (
      <section key={section.title} className="space-y-4">
        <Heading className={section.level === 3 ? 'text-xl font-semibold' : 'text-2xl font-semibold'}>{section.title}</Heading>

        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="list-disc ml-5 space-y-2">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </section>
    )
  })

const Disclosures = () => {
  const { lang } = useTranslationProvider()
  const copy = lang.startsWith('es') ? content.es : content.en

  return (
    <div className='mx-32 my-10'>
      <DashboardPage title={copy.pageTitle} description={copy.pageSubtitle}>
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="terms">{copy.tabs.terms}</TabsTrigger>
            <TabsTrigger value="cyber">{copy.tabs.cyber}</TabsTrigger>
            <TabsTrigger value="privacy">{copy.tabs.privacy}</TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="w-full">
            <Card className="w-full">
              <CardContent className="space-y-6">{renderSections(copy.terms)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cyber" className="w-full">
            <Card className="w-full">
              <CardContent className="space-y-8">{renderSections(copy.cyber)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="w-full">
            <Card className="w-full">
              <CardContent className="space-y-8">{renderSections(copy.privacy)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardPage>
    </div>
  )
}

export default Disclosures
