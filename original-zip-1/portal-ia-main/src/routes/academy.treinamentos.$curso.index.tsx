import { createFileRoute } from '@tanstack/react-router';
import { TrainingCoursePage, loadCourse } from '@/features/academy';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/academy/treinamentos/$curso/')({
  loader: ({ params }) => loadCourse(params.curso),
  head: ({ loaderData }) => pageHead(loaderData && `Treinamento: ${loaderData.course.title}`, loaderData?.course.summary),
  component: TrainingCoursePage,
});
