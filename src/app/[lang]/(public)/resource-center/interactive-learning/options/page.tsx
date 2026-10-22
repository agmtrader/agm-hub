import { InteractiveOptionsLesson } from "@/components/hub/resource-center/InteractiveOptionsLesson"

type Props = {
  searchParams: Promise<{ module?: string | string[] }>
}

const InteractiveOptionsPage = async ({ searchParams }: Props) => {
  const { module } = await searchParams
  const moduleId = typeof module === 'string' ? module : undefined

  return (
    <main className="flex w-full justify-center py-24">
      <InteractiveOptionsLesson key={moduleId ?? 'catalog'} initialModuleId={moduleId} />
    </main>
  )
}

export default InteractiveOptionsPage
