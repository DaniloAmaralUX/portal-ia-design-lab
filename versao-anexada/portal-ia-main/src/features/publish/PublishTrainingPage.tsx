import { useState } from "react";
import { courses } from "@/data/trainings";
import { AreaField } from "./AreaField";
import { Field } from "./Field";
import { areaControl, lineControl } from "./field-class";
import { checkCourse, checkRecording, courseFile, emptyRecording, lessonFile, slugFor, type CourseDraft, type PublishRequest, type Recording } from "./files";
import { PublishShell } from "./PublishShell";
import { RecordingFields } from "./RecordingFields";
import { Reveal } from "./Reveal";
import { SendResult } from "./SendResult";
import { SlugField } from "./SlugField";
import { SubmitRow } from "./SubmitRow";
import { usePublish } from "./use-publish";

// The value of the option of a new course: a slug never has a +, so it never names a course that exists.
const NEW_COURSE = "+novo";
const taken: ReadonlySet<string> = new Set(courses.map((c) => c.slug));

// The key of the form changes to publish another one, which starts it empty.
export function PublishTrainingPage() {
  const [round, setRound] = useState(0);
  return <TrainingForm key={round} onAnother={() => setRound((n) => n + 1)} />;
}

function TrainingForm({ onAnother }: { onAnother: () => void }) {
  const [choice, setChoice] = useState(courses[0]?.slug ?? NEW_COURSE);
  const [course, setCourse] = useState<CourseDraft>({ slug: "", title: "", summary: "", area: "" });
  const [slugEdited, setSlugEdited] = useState(false);
  const [lesson, setLesson] = useState<Recording>(emptyRecording);
  const publish = usePublish();

  const existing = courses.find((c) => c.slug === choice);
  const number = existing ? existing.lessons.length + 1 : 1;
  const lessonProblems = checkRecording(lesson);
  const courseProblems = existing ? {} : checkCourse(course, taken);
  const count = Object.keys(lessonProblems).length + Object.keys(courseProblems).length;
  const shownCourse = publish.submitted ? courseProblems : {};
  const request: PublishRequest = existing
    ? { kind: "lesson", course: existing.slug, newCourse: null, lesson }
    : { kind: "lesson", course: course.slug, newCourse: course, lesson };
  const files = existing ? [lessonFile(existing.slug, number, lesson)] : [courseFile(course), lessonFile(course.slug, number, lesson)];

  const changeCourse = (field: keyof CourseDraft, value: string) =>
    setCourse((c) => ({ ...c, [field]: value, ...(field === "title" && !slugEdited ? { slug: slugFor(value) } : {}) }));

  return (
    <PublishShell
      title="Publicar uma aula de treinamento"
      lead="Escolha o treinamento e preencha a aula. A aula entra como a próxima do treinamento, e um treinamento novo nasce com a aula 1. O formulário envia a solicitação para análise: depois que o time aprovar, a aula aparece no portal."
    >
      <form noValidate onSubmit={(e) => publish.submit(e, count, request)} className="space-y-6">
        <div>
          <Field id="training-course" label="Treinamento">
            {(c) => (
              <select {...c} value={choice} onChange={(e) => setChoice(e.target.value)} className={lineControl}>
                {courses.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.title}
                  </option>
                ))}
                <option value={NEW_COURSE}>Um treinamento novo</option>
              </select>
            )}
          </Field>

          <Reveal open={!existing}>
            <fieldset className="space-y-6 rounded-2xl border border-border p-5">
              <legend className="px-1 text-small font-semibold">O treinamento novo</legend>
              <Field id="course-title" label="Nome do treinamento" problem={shownCourse.title}>
                {(c) => <input {...c} value={course.title} onChange={(e) => changeCourse("title", e.target.value)} className={lineControl} />}
              </Field>
              <SlugField
                id="course-slug"
                base="/academy/treinamentos"
                value={course.slug}
                problem={shownCourse.slug}
                onChange={(slug) => {
                  setSlugEdited(true);
                  setCourse((c) => ({ ...c, slug }));
                }}
              />
              <Field id="course-summary" label="Resumo do treinamento" hint="Aparece no cartão do treinamento, em Treinamentos." problem={shownCourse.summary}>
                {(c) => <textarea {...c} rows={2} value={course.summary} onChange={(e) => changeCourse("summary", e.target.value)} className={areaControl} />}
              </Field>
              <AreaField id="course-area" value={course.area} onChange={(area) => setCourse((c) => ({ ...c, area }))} />
            </fieldset>
          </Reveal>
        </div>

        <p className="text-small text-muted-foreground">
          Esta será a aula {number} de {existing ? existing.title : course.title.trim() || "o treinamento novo"}.
        </p>
        <RecordingFields
          value={lesson}
          problems={publish.submitted ? lessonProblems : {}}
          onChange={(field, value) => setLesson((l) => ({ ...l, [field]: value }))}
          titleLabel="Título da aula"
          titleHint={`Como "Aula ${number}" ou o tema da aula.`}
        />
        {publish.result?.state !== "sent" && <SubmitRow problems={publish.submitted ? count : 0} sending={publish.sending} />}
      </form>
      {publish.result && <SendResult result={publish.result} files={files} onAnother={onAnother} />}
    </PublishShell>
  );
}
