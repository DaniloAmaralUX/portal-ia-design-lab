import type { AreaId } from "@/data/types";

export const areaStyle: Record<AreaId, { text: string; tint: string; dot: string; border: string }> = {
  engenharia: {
    text: "text-area-engenharia",
    tint: "bg-area-engenharia-tint",
    dot: "bg-area-engenharia",
    border: "hover:border-area-engenharia/40",
  },
  qualidade: {
    text: "text-area-qualidade",
    tint: "bg-area-qualidade-tint",
    dot: "bg-area-qualidade",
    border: "hover:border-area-qualidade/40",
  },
  produto: {
    text: "text-area-produto",
    tint: "bg-area-produto-tint",
    dot: "bg-area-produto",
    border: "hover:border-area-produto/45",
  },
  meio: {
    text: "text-area-meio",
    tint: "bg-area-meio-tint",
    dot: "bg-area-meio",
    border: "hover:border-area-meio/45",
  },
};
