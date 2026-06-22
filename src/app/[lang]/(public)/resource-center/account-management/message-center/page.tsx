import { ResourceGuidePage } from '@/components/hub/learning/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Account Management',
    title: 'Message Center',
    description:
      'This guide follows the IBKR Mobile iPhone Message Center page for creating tickets and managing Message Center preferences.',
    back: 'Back to Resource Center',
    sections: [
      {
        title: 'What Message Center is for',
        steps: [
          {
            title: 'Secure communication with Client Services',
            body: 'IBKR says Message Center lets you communicate securely with Interactive Brokers Client Services, create support tickets, view responses, and manage inquiries.',
          },
        ],
      },
      {
        title: 'Create a new ticket',
        steps: [
          {
            title: 'Open Message Center',
            body: 'Tap the Account menu icon with the three horizontal lines in the top-left corner of the app, then tap Message Center.',
          },
          {
            title: 'Start a new ticket',
            body: 'Click Compose and then click New Ticket.',
          },
          {
            title: 'Describe the issue first',
            body: 'IBKR first asks for an issue description so IBot can provide quick automated answers before you continue with the ticket.',
          },
          {
            title: 'Enter the detailed inquiry',
            body: 'In the Body field, enter a specific and complete description of the inquiry, including details such as exact dates, times, or TWS version when relevant.',
          },
          {
            title: 'Attach files if needed',
            body: 'You can attach up to two files with a combined size of 25 MB.',
          },
          {
            title: 'Preview and submit',
            body: 'Click Preview Ticket to review the information and then click Submit Ticket to send it.',
          },
          {
            title: 'Find the ticket in the Tickets tab',
            body: 'The new inquiry appears in the Tickets tab with its reference number and a status of new.',
          },
        ],
      },
      {
        title: 'Message Center preferences',
        steps: [
          {
            title: 'Open preferences',
            body: 'Click the Preferences gear icon on the right side of Message Center.',
          },
          {
            title: 'Set message languages',
            body: 'Choose the preferred and secondary language for messages from the dropdowns.',
          },
          {
            title: 'Save the changes',
            body: 'Click Save to keep the updated preferences.',
          },
        ],
      },
      {
        title: 'Other Message Center uses and features',
        steps: [
          {
            title: 'Supported actions',
            body: 'The page says Message Center can also be used to submit trade cancellation requests, Pattern Day Trader reset requests, view corporate actions, access notifications, and view archived tickets.',
          },
          {
            title: 'Ticket tracking',
            body: 'Every inquiry receives a reference number, called a ticket, so the inquiry can be tracked efficiently.',
          },
          {
            title: 'Real-time status',
            body: 'The main Message Center window shows the real-time status of the inquiry, including whether it has been picked up and which expert or team is handling it.',
          },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Gestión de Cuenta',
    title: 'Message Center',
    description:
      'Esta guía sigue la página de Message Center de IBKR Mobile para iPhone para crear tickets y gestionar las preferencias de Message Center.',
    back: 'Volver al Centro de Recursos',
    sections: [
      {
        title: 'Para qué sirve Message Center',
        steps: [
          {
            title: 'Comunicación segura con Client Services',
            body: 'IBKR indica que Message Center permite comunicarse de forma segura con Interactive Brokers Client Services, crear tickets de soporte, ver respuestas y gestionar consultas.',
          },
        ],
      },
      {
        title: 'Crear un ticket nuevo',
        steps: [
          {
            title: 'Abra Message Center',
            body: 'Toque el ícono del menú Account con las tres líneas horizontales en la esquina superior izquierda de la app y luego toque Message Center.',
          },
          {
            title: 'Inicie un ticket nuevo',
            body: 'Haga clic en Compose y luego en New Ticket.',
          },
          {
            title: 'Describa primero el problema',
            body: 'IBKR primero pide una descripción del problema para que IBot pueda ofrecer respuestas automáticas rápidas antes de continuar con el ticket.',
          },
          {
            title: 'Ingrese la consulta detallada',
            body: 'En el campo Body, ingrese una descripción específica y completa de la consulta, incluyendo detalles como fechas exactas, horas o versión de TWS cuando corresponda.',
          },
          {
            title: 'Adjunte archivos si hace falta',
            body: 'Puede adjuntar hasta dos archivos con un tamaño total combinado de 25 MB.',
          },
          {
            title: 'Revise y envíe',
            body: 'Haga clic en Preview Ticket para revisar la información y luego en Submit Ticket para enviarla.',
          },
          {
            title: 'Encuentre el ticket en la pestaña Tickets',
            body: 'La consulta nueva aparece en la pestaña Tickets con su número de referencia y estado new.',
          },
        ],
      },
      {
        title: 'Preferencias de Message Center',
        steps: [
          {
            title: 'Abra las preferencias',
            body: 'Haga clic en el ícono de engranaje Preferences al lado derecho de Message Center.',
          },
          {
            title: 'Defina los idiomas de los mensajes',
            body: 'Elija el idioma preferido y el secundario para los mensajes usando los menús desplegables.',
          },
          {
            title: 'Guarde los cambios',
            body: 'Haga clic en Save para guardar las preferencias actualizadas.',
          },
        ],
      },
      {
        title: 'Otros usos y funciones de Message Center',
        steps: [
          {
            title: 'Acciones soportadas',
            body: 'La página indica que Message Center también sirve para enviar solicitudes de cancelación de operaciones, solicitudes de reset de Pattern Day Trader, ver corporate actions, acceder a notifications y ver archived tickets.',
          },
          {
            title: 'Seguimiento del ticket',
            body: 'Cada consulta recibe un número de referencia, llamado ticket, para poder darle seguimiento de forma eficiente.',
          },
          {
            title: 'Estado en tiempo real',
            body: 'La ventana principal de Message Center muestra el estado en tiempo real de la consulta, incluyendo si ya fue tomada y qué experto o equipo la está atendiendo.',
          },
        ],
      },
    ],
  },
} as const

const MessageCenterPage = () => {
  return <ResourceGuidePage sectionAnchor="account-management" content={guideContent} />
}

export default MessageCenterPage
