import { ResourceGuidePage } from '@/components/hub/resource-center/ResourceGuidePage'

const guideContent = {
  en: {
    eyebrow: 'Trading',
    title: 'Options Trading - Client Portal',
    description:
      'This guide follows the IBKR Campus Client Portal options trading lesson and covers the main tools shown there: Option Chain, combo orders, Options Wizard, and Exercise/Lapse Options.',
    back: 'Back to Resource Center',
    sections: [
      {
        title: 'Option Chain',
        intro:
          'IBKR states that Client Portal includes option chains from the Trade menu for searching contracts and viewing data for the selected underlying.',
        steps: [
          {
            title: 'Open Option Chains from Trade',
            body: 'From the Trade menu, select Option Chains and search for a contract or underlying symbol in the search bar.',
          },
          {
            title: 'Review the data at the top of the page',
            body: 'IBKR shows option volume, implied volatility, and historical volatility for the selected underlying.',
          },
          {
            title: 'Pick an expiration',
            body: 'Use the blue arrow icon to scroll through expirations and click the expiration you want to view.',
          },
          {
            title: 'Adjust the chain view',
            body: 'Use View to switch between Calls & Puts, Calendar Spread, Vertical Spread, or Diagonal Spread.',
          },
          {
            title: 'Adjust chain settings',
            body: 'Use the Settings icon to change Strike Display, Time Period, and Columns, and toggle Weekly contracts and Options Market Data on if needed.',
          },
        ],
      },
      {
        title: 'Combo Orders',
        intro:
          'The IBKR lesson shows combo order entry directly from the option chain after selecting multiple legs.',
        steps: [
          {
            title: 'Select the first option leg',
            body: 'Click the Ask price to buy an option or the Bid price to sell an option.',
          },
          {
            title: 'Add more legs if needed',
            body: 'Select additional Bid or Ask prices for the other option positions you want in the strategy.',
          },
          {
            title: 'Review the order ticket',
            body: 'The legs populate in the Order Ticket, where quantities can be adjusted before sending the order.',
          },
          {
            title: 'Use Build Combo',
            body: 'If more than one option leg was selected, click the Build Combo button to build the combo order ticket.',
          },
          {
            title: 'Add the underlying stock if required',
            body: 'Use Add Stock Leg when the strategy also requires the underlying stock position.',
          },
        ],
      },
      {
        title: 'Options Wizard',
        intro:
          'IBKR describes Options Wizard as a guided tool that suggests standard strategies based on the investor’s price or volatility view.',
        steps: [
          {
            title: 'Open Options Wizard',
            body: 'From Option Chains, click the Options Wizard button to the left of the expirations.',
          },
          {
            title: 'Choose the market view',
            body: 'The lesson shows these inputs: price will go up, price will go down, price will stay within a range, price will go up and/or down by a certain amount or percent, volatility will go up, or volatility will go down.',
          },
          {
            title: 'Choose the time horizon',
            body: 'Click Find Strategies and then scroll through the option expiration dates to choose the expected timing.',
          },
          {
            title: 'Enter the expected move',
            body: 'On the next screen, enter the dollar amount or percentage move you expect.',
          },
          {
            title: 'Review suggested strategies',
            body: 'Use the dropdown to filter or sort the displayed strategies, then open one to review its Performance Profile.',
          },
          {
            title: 'Send the strategy to the order ticket',
            body: 'When ready, click the blue Order button to populate the Order Ticket.',
          },
        ],
      },
      {
        title: 'Exercise/Lapse Options',
        steps: [
          {
            title: 'Open Exercise/Lapse Options from Trade',
            body: 'IBKR says investors with open American-style option positions can use the Exercise/Lapse Options page from the Trade menu.',
          },
          {
            title: 'Review the listed long option positions',
            body: 'The page lists long positions and marks each one as Out-of-the-money or In-the-money.',
          },
          {
            title: 'Select the option to exercise',
            body: 'Choose the position from the list and enter the number of contracts to exercise.',
          },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'Trading',
    title: 'Options Trading - Client Portal',
    description:
      'Esta guía sigue la lección de IBKR Campus sobre opciones en Client Portal y cubre las herramientas principales que muestra ahí: Option Chain, órdenes combo, Options Wizard y Exercise/Lapse Options.',
    back: 'Volver al Centro de Recursos',
    sections: [
      {
        title: 'Option Chain',
        intro:
          'IBKR indica que Client Portal incluye option chains desde el menú Trade para buscar contratos y ver datos del subyacente seleccionado.',
        steps: [
          {
            title: 'Abra Option Chains desde Trade',
            body: 'Desde el menú Trade, seleccione Option Chains y busque un contrato o símbolo subyacente en la barra de búsqueda.',
          },
          {
            title: 'Revise los datos en la parte superior',
            body: 'IBKR muestra option volume, implied volatility e historical volatility del subyacente seleccionado.',
          },
          {
            title: 'Elija un vencimiento',
            body: 'Use el ícono de flecha azul para desplazarse por los vencimientos y haga clic en el que quiere ver.',
          },
          {
            title: 'Ajuste la vista de la cadena',
            body: 'Use View para cambiar entre Calls & Puts, Calendar Spread, Vertical Spread o Diagonal Spread.',
          },
          {
            title: 'Ajuste la configuración de la cadena',
            body: 'Use el ícono Settings para cambiar Strike Display, Time Period y Columns, y active Weekly contracts y Options Market Data si hace falta.',
          },
        ],
      },
      {
        title: 'Órdenes Combo',
        intro:
          'La lección de IBKR muestra el ingreso de órdenes combo directamente desde la option chain después de seleccionar varias piernas.',
        steps: [
          {
            title: 'Seleccione la primera pierna de opción',
            body: 'Haga clic en el precio Ask para comprar una opción o en el precio Bid para vender una opción.',
          },
          {
            title: 'Agregue más piernas si hace falta',
            body: 'Seleccione precios Bid o Ask adicionales para las otras posiciones de opciones que quiera en la estrategia.',
          },
          {
            title: 'Revise el order ticket',
            body: 'Las piernas se cargan en el Order Ticket, donde se pueden ajustar las cantidades antes de enviar la orden.',
          },
          {
            title: 'Use Build Combo',
            body: 'Si se seleccionó más de una pierna de opción, haga clic en Build Combo para construir el combo order ticket.',
          },
          {
            title: 'Agregue la acción subyacente si corresponde',
            body: 'Use Add Stock Leg cuando la estrategia también requiera la posición en la acción subyacente.',
          },
        ],
      },
      {
        title: 'Options Wizard',
        intro:
          'IBKR describe Options Wizard como una herramienta guiada que sugiere estrategias estándar según la visión del inversionista sobre precio o volatilidad.',
        steps: [
          {
            title: 'Abra Options Wizard',
            body: 'Desde Option Chains, haga clic en el botón Options Wizard a la izquierda de los vencimientos.',
          },
          {
            title: 'Elija la visión de mercado',
            body: 'La lección muestra estas opciones: el precio subirá, bajará, se mantendrá en un rango, subirá y/o bajará por cierta cantidad o porcentaje, la volatilidad subirá o la volatilidad bajará.',
          },
          {
            title: 'Elija el horizonte de tiempo',
            body: 'Haga clic en Find Strategies y luego recorra las fechas de vencimiento para escoger el plazo esperado.',
          },
          {
            title: 'Ingrese el movimiento esperado',
            body: 'En la siguiente pantalla, ingrese el monto en dólares o el porcentaje de movimiento que espera.',
          },
          {
            title: 'Revise las estrategias sugeridas',
            body: 'Use el menú desplegable para filtrar u ordenar las estrategias mostradas y abra una para revisar su Performance Profile.',
          },
          {
            title: 'Envíe la estrategia al order ticket',
            body: 'Cuando esté listo, haga clic en el botón azul Order para llenar el Order Ticket.',
          },
        ],
      },
      {
        title: 'Exercise/Lapse Options',
        steps: [
          {
            title: 'Abra Exercise/Lapse Options desde Trade',
            body: 'IBKR indica que los inversionistas con posiciones abiertas en opciones americanas pueden usar la página Exercise/Lapse Options desde el menú Trade.',
          },
          {
            title: 'Revise las posiciones largas listadas',
            body: 'La página lista las posiciones largas y marca cada una como Out-of-the-money o In-the-money.',
          },
          {
            title: 'Seleccione la opción a ejercer',
            body: 'Elija la posición en la lista e ingrese la cantidad de contratos a ejercer.',
          },
        ],
      },
    ],
  },
} as const

const OptionsTradingClientPortalPage = () => {
  return <ResourceGuidePage sectionAnchor="trading" content={guideContent} />
}

export default OptionsTradingClientPortalPage
