import { createFileRoute } from '@tanstack/react-router';
import { TreinamentoPage, loadTraining } from '@/features/academy';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/academy/treinamentos/$curso/$aula')({
  loader: ({ params }) => loadTraining(params.curso, params.aula),
  head: ({ loaderData }) =>
    pageHead(loaderData && `${loaderData.course.title}: ${loaderData.training.title}`, loaderData?.training.summary),
  component: TreinamentoPage,
});
