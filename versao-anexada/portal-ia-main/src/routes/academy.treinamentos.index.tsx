import { TreinamentosPage, validateIntervalsSearch } from '@/features/academy'
import { pageHead } from '@/lib/page-head'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/academy/treinamentos/')({
  validateSearch: validateIntervalsSearch,
  head: () => pageHead('Treinamentos', 'Os treinamentos da Pitang, com o vídeo e o texto de cada um, por área.'),
  component: TreinamentosPage,
})

