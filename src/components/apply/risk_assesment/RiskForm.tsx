"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"


import { Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

import { getDefaults, risk_assesment_schema } from "@/lib/form"
import { Input } from "@/components/ui/input"
import { formatTimestamp } from "@/utils/dates"
import { addDocument } from "@/utils/api"

const asset_allocation = [
  {
    name: 'Conservative A',
    bonds_aaa_a: 0.3,
    bonds_bbb: 0.7,
    bonds_bb: 0,
    etfs: 0,
    average_yield: .06103
  },
  {
    name: 'Conservative B',
    bonds_aaa_a: 0.18,
    bonds_bbb: 0.54,
    bonds_bb: .18,
    etfs: .1,
    average_yield: .0723
  },
  {
    name: 'Moderate A',
    bonds_aaa_a: 0.16,
    bonds_bbb: 0.48,
    bonds_bb: 0.16,
    etfs: 0.2,
    average_yield: .0764
  },
  {
    name: 'Moderate B',
    bonds_aaa_a: 0.15,
    bonds_bbb: 0.375,
    bonds_bb: 0.15,
    etfs: 0.25,
    average_yield: .0736
  },
  {
    name: 'Moderate C',
    bonds_aaa_a: 0.14,
    bonds_bbb: 0.35,
    bonds_bb: 0.21,
    etfs: 0.3,
    average_yield: .06103
  },
  {
    name: 'Aggressive A',
    bonds_aaa_a: 0.13,
    bonds_bbb: 0.325,
    bonds_bb: .195,
    etfs: .35,
    average_yield: .0845
  },
  {
    name: 'Aggressive B',
    bonds_aaa_a: 0.12,
    bonds_bbb: 0.30,
    bonds_bb: 0.18,
    etfs: 0.4,
    average_yield: .0865
  },
  {
    name: 'Aggressive C',
    bonds_aaa_a: 0.05,
    bonds_bbb: 0.25,
    bonds_bb: 0.20,
    etfs: 0.5,
    average_yield: .0925
  }
]

const weights = [
  {
    name: 'type',
    weight: 0.2
  }, 
  {
    name: 'loss',
    weight: 0.15
  },
  {
    name: 'gain',
    weight: 0.15
  }, 
  {
    name: 'period',
    weight: 0.15
  },
  {
    name: 'diversification',
    weight: 0.15
  },
  {
    name: 'goals',
    weight: 0.2
  }
]

const RiskForm = ({spanish}:{spanish:boolean}) => {

  enum clant{
    bonds_aaa_a = 'Bonds AAA-A',
    bonds_bbb = 'Bonds BBB',
    bonds_bb = 'Bonds BB',
    etfs = 'ETFs',
  }

  const [message, setMessage] = useState<string | null>(null)
  const [portfolio, setPortfolio] = useState<any[] | null>(null)

  let formSchema:any;
  let initialFormValues:any = {};

  formSchema = risk_assesment_schema
  initialFormValues = getDefaults(formSchema)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      values: initialFormValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)


    const timestamp = new Date()
    const riskProfileID = formatTimestamp(timestamp)

    let sum = 0
    Object.entries(values).forEach((element) => {
      if (element[0] !== 'account_number' && element[0] !== 'client_name') {
        sum += weights.filter(el => el['name'] == element[0])[0]['weight'] * Number(element[1])
      }
    })

    const risk_profile = {
      'AccountNumber':values.account_number,
      'ClientName': values.client_name,
      'Score':sum,
      'RiskProfileID':riskProfileID,
    }

    console.log(sum)
    console.log(risk_profile)

    await addDocument(risk_profile, 'db/clients/risk_profiles', riskProfileID)

    delete values.account_number
    delete values.client_name

    setMessage(spanish ? 'Perfil de riesgo enviado exitosamente.':'Risk profile successfully submitted.')

    let risk_type = ''

    if (sum < .9) {
      risk_type = 'Conservative A'
    } else if (sum >= 0.9 && sum < 1.25) {
      risk_type = 'Conservative B'
    } else if (sum >= 1.25 && sum < 1.5) {
      risk_type = 'Moderate A'
    } else if (sum >= 1.5 && sum < 2) {
      risk_type = 'Moderate B'
    } else if (sum >= 2 && sum < 2.5) {
      risk_type = 'Moderate C'
    } else if (sum >= 2.5 && sum < 2.75) {
      risk_type = 'Aggressive A'
    } else if (sum >= 2.75 && sum < 3) {
      risk_type = 'Aggressive B'
    } else if (sum >= 3) {
      risk_type = 'Aggressive C'
    }
    
    setPortfolio(asset_allocation.filter((element) => element.name === risk_type))

  }

  function getAssetAllocation() {
    let labels:any[] = []
    let values:any[] = []
    
    if (portfolio) {
      labels = Object.keys(portfolio[0]).filter((element) => element !== 'name' && element !== 'average_yield')
      labels.forEach((label) => {
        values.push(portfolio[0][label])
      })
      labels = labels.map((element) => clant[element as keyof typeof clant])
    }
    return {labels, values}
  }
  
  const {labels, values} = getAssetAllocation()

  const data = {
    backgroundColor: [
      "rgb(2, 88, 255)",
      "rgb(249, 151, 0)",
      "rgb(255, 199, 0)",
      "rgb(32, 214, 152)",
    ],
    labels: labels,
    datasets: [
      {
        label: "Portfolio",
        data: values,
        backgroundColor: [
          "rgb(2, 88, 255)",
          "rgb(249, 151, 0)",
          "rgb(255, 199, 0)",
          "rgb(32, 214, 152)",
        ],
        hoverOffset: 4,
      },
    ],
  }
  
  const options = {
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 1,
      },
    },
  }

  if (spanish) {
    return (
      <div className="w-2/3 h-full flex">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">

            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de cuenta</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>¿Qué tipo de inversor te consideras?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Conservador
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2.5" />
                        </FormControl>
                        <FormLabel className="font-normal">Moderado</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Agresivo
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loss"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Si tu cartera pierde un 20% de su valor, ¿qué acción tomarías?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">Vender todo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">Vender algunas inversiones</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No hacer nada
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Invertir más
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gain"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Si tu cartera aumenta un 20% de su valor, ¿qué acción tomarías?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">Vender todo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">Vender algunas inversiones</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No hacer nada
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Invertir más
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>¿Cuál crees que debería ser el plazo promedio de tu cartera de inversiones?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          0-5 años
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          5-10 años
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          11-20 años
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">Más de 21 años</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diversification"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Considerando la diversificación de clases de activos, ¿cuál de estos portafolios seleccionarías?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portafolio A: 100% bonos, 0% acciones
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portafolio B: 80% bonos, 20% acciones
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portafolio C: 60% bonos, 40% acciones
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>¿Cuál de estos portafolios representa mejor tus objetivos con los resultados más aceptables?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portafolio A: Rendimiento promedio del 4%
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portafolio B: Rendimiento promedio del 5%
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Portafolio C: Rendimiento promedio del 7%
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">Submit</Button>
            {message && <p className="text-green-600">{message}</p>}
            {portfolio &&
              <div className="lg:w-[30%] w-full flex justify-center items-center gap-y-10 flex-col">
                {portfolio[0].name && <h1 className="text-xl font-bold">Perfil: {portfolio[0].name}</h1>}
                <Doughnut data={data} options={options} />
                {portfolio[0].average_yield && <p className="text-sm font-bold">Rendimiento promedio: {Number(portfolio[0].average_yield * 100).toFixed(2)}%</p>}
              </div>
            }
          </form>
        </Form>
      </div>
      
    )
  } else {
  return (
      <div className="w-2/3 h-full flex">

      <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">

        <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Account number</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />

          <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>What type of investor do you consider yourself?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Conservative
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2.5" />
                      </FormControl>
                      <FormLabel className="font-normal">Moderate</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="4" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Aggresive
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loss"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>If your portfolio loses 20% of its value what action would you take?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">Sell everything</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2" />
                      </FormControl>
                      <FormLabel className="font-normal">Sell some investments</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="3" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Do nothing
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="4" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Invest more
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gain"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>If your portfolio appreciates 20% of its value what action would you take?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">Sell everything</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2" />
                      </FormControl>
                      <FormLabel className="font-normal">Sell some investments</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="3" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Do nothing
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="4" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Invest more
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>What do you think the average term of your investment portfolio should be?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="4" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        0-5 years
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="3" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        5-10 years
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        11-20 years
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">More than 21 years</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diversification"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Considering asset class diversification, which of these portfolios would you select?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Portfolio A: 100% bonds, 0% equity
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Portfolio B: 80% bonds, 20% equity
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="3" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Portfolio C: 60% bonds, 40% equity
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Which of these portfolios best represent your goals with the most acceptable outcomes?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Portfolio A: Average 4% return
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2" />
                      </FormControl>
                      <FormLabel className="font-normal">
                      Portfolio A: Average 5% return
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="3" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Portfolio C: Average 7% return
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/*TODO AGREGAR FOTOS DE LOUIS */}
          
          <Button type="submit">Submit</Button>
          {message && <p className="text-green-600">{message}</p>}
          {portfolio &&
            <div className="lg:w-[30%] w-full flex justify-center items-center gap-y-10 flex-col">
              {portfolio[0].name && <h1 className="text-xl font-bold">Profile: {portfolio[0].name}</h1>}
              <Doughnut data={data} options={options} />
              {portfolio[0].average_yield && <p className="text-sm font-bold">Average yield: {Number(portfolio[0].average_yield * 100).toFixed(2)}%</p>}
            </div>
          }
        </form>
      </Form>
      </div>
      
    )
  }
}

export default RiskForm