import { describe, expect, it } from "vitest";
import {
  checkCourse,
  checkInterval,
  checkRecording,
  courseFile,
  emptyRecording,
  intervalFile,
  lessonFile,
  slugFor,
  videoAddress,
  type IntervalDraft,
  type Recording,
} from "../src/features/publish/files.ts";
import { areas } from "../src/data/areas.ts";
import { AREA_IDS } from "../src/shared/area-ids.ts";
import { parseInterval } from "./intervals.ts";
import { parseCourse, parseTraining } from "./trainings.ts";

const ORIGIN = "https://empresa.sharepoint.com";
const VIDEO = `${ORIGIN}/sites/time/_layouts/15/embed.aspx?UniqueId=abc&embed=%7B%7D`;
const EMBED = `<iframe src="${VIDEO.replace("&", "&amp;")}" width="640" height="360" frameborder="0" allowfullscreen title="Gravação"></iframe>`;

const RECORDING: Recording = {
  title: "Do requisito ao código: o SDD na prática",
  date: "2026-10-15",
  minutes: "42",
  summary: "Danilo mostrou o SDD\ncom o Compozy.",
  video: EMBED,
  text: "## A pauta\r\n\r\n- O conceito de SDD.\r\n",
};
const INTERVAL: IntervalDraft = { ...RECORDING, slug: "do-requisito-ao-codigo", area: "engenharia" };

describe("the files of /publicar, read back by the parsers of the build", () => {
  it("writes a technical break that scripts/intervals.ts reads as the form had it", () => {
    const file = intervalFile(INTERVAL);
    expect(file.path).toBe("src/content/intervals/do-requisito-ao-codigo.md");
    expect(parseInterval(file.path, file.content, ORIGIN)).toEqual({
      interval: {
        slug: "do-requisito-ao-codigo",
        title: "Do requisito ao código: o SDD na prática",
        date: "2026-10-15",
        minutes: 42,
        area: "engenharia",
        summary: "Danilo mostrou o SDD com o Compozy.",
        video: VIDEO,
      },
      text: "## A pauta\n\n- O conceito de SDD.",
    });
  });

  it("leaves the area and the minutes out of the head when the form leaves them blank", () => {
    const file = intervalFile({ ...INTERVAL, area: "", minutes: " " });
    expect(file.content).not.toMatch(/^(area|minutes):/m);
    expect(parseInterval(file.path, file.content, ORIGIN).interval).toMatchObject({ area: null, minutes: null });
  });

  it("writes a course and its lesson that scripts/trainings.ts reads", () => {
    const course = courseFile({ slug: "claude-cowork", title: "Claude Cowork", summary: "Três aulas para as áreas de meio.", area: "meio" });
    expect(course.path).toBe("src/content/trainings/claude-cowork/course.md");
    expect(parseCourse(course.path, course.content)).toEqual({ slug: "claude-cowork", title: "Claude Cowork", summary: "Três aulas para as áreas de meio.", area: "meio" });
    const lesson = lessonFile("claude-cowork", 4, RECORDING);
    expect(lesson.path).toBe("src/content/trainings/claude-cowork/4.md");
    expect(parseTraining(lesson.path, lesson.content, ORIGIN)).toEqual({
      training: { number: 4, title: RECORDING.title, date: "2026-10-15", minutes: 42, summary: "Danilo mostrou o SDD com o Compozy.", video: VIDEO },
      text: "## A pauta\n\n- O conceito de SDD.",
    });
  });
});

describe("the checks of the forms", () => {
  it("passes a complete break, and names each field that is missing or wrong", () => {
    expect(checkInterval(INTERVAL, new Set())).toEqual({});
    expect(Object.keys(checkRecording(emptyRecording)).sort()).toEqual(["date", "summary", "text", "title", "video"]);
    expect(checkRecording({ ...RECORDING, minutes: "4.5" }).minutes).toBeDefined();
    expect(checkRecording({ ...RECORDING, date: "2026-02-30x" }).date).toBeDefined();
  });

  it("refuses an address of page already taken or out of shape", () => {
    expect(checkInterval(INTERVAL, new Set(["do-requisito-ao-codigo"])).slug).toContain("Já existe");
    expect(checkInterval({ ...INTERVAL, slug: "Revisão de PR" }, new Set()).slug).toBeDefined();
    expect(checkCourse({ slug: "claude-cowork", title: "", summary: "", area: "" }, new Set(["claude-cowork"]))).toMatchObject({
      slug: expect.stringContaining("Já existe") as string,
      title: expect.any(String) as string,
      summary: expect.any(String) as string,
    });
  });

  it("takes only a recording on SharePoint, over https", () => {
    expect(checkRecording({ ...RECORDING, video: "https://youtube.com/watch?v=1" }).video).toBeDefined();
    expect(checkRecording({ ...RECORDING, video: "http://empresa.sharepoint.com/x" }).video).toBeDefined();
    expect(checkRecording({ ...RECORDING, video: "não é link" }).video).toBeDefined();
  });
});

describe("the helpers of the forms", () => {
  it("takes the src out of the embed code of Stream, and keeps an address pasted alone", () => {
    expect(videoAddress(EMBED)).toBe(VIDEO);
    expect(videoAddress(` ${VIDEO} `)).toBe(VIDEO);
  });

  it("makes the address of the page from the title, and cuts a long one at a dash", () => {
    expect(slugFor("Do requisito ao código: o SDD na prática")).toBe("do-requisito-ao-codigo-o-sdd-na-pratica");
    const long = slugFor("Comparativo de ferramentas de SDD para times de produto, qualidade e engenharia da Pitang");
    expect(long.length).toBeLessThanOrEqual(60);
    expect(long).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(long).toBe("comparativo-de-ferramentas-de-sdd-para-times-de-produto");
  });
});

describe("the ids of the areas that the BFF checks", () => {
  it("are the ones of src/data/areas.ts", () => {
    expect([...AREA_IDS]).toEqual(areas.map((a) => a.id));
  });
});
