import type { Gift } from "../domain/gift";

export const giftCatalogSeed: readonly Gift[] = [
  {
    id: "livros-novos-olhares",
    name: "Livros para novos olhares",
    description: "Leituras que vão acompanhar os primeiros passos na profissão.",
    priceInCents: 8_000,
    imageUrl: "/images/presentes/livros.png",
    imageAlt: "Pilha de livros de psicologia com óculos dourados por cima",
  },
  {
    id: "cafes-entre-conquistas",
    name: "Cafés entre conquistas",
    description: "Para os cafés que vêm antes (e depois) de cada atendimento.",
    priceInCents: 5_000,
    imageUrl: "/images/presentes/cafes.png",
    imageAlt: "Duas canecas de cerâmica creme com folhas verdes pintadas",
  },
  {
    id: "primeiro-consultorio",
    name: "Meu primeiro consultório",
    description: "Um cantinho acolhedor para receber cada história.",
    priceInCents: 30_000,
    imageUrl: "/images/presentes/consultorio.png",
    imageAlt: "Poltrona verde-sálvia com pés de madeira ao lado de uma oliveira",
  },
  {
    id: "pausa-para-mim",
    name: "Uma pausa para mim",
    description: "Porque cuidar de quem cuida também faz parte.",
    priceInCents: 15_000,
    imageUrl: "/images/presentes/pausa.png",
    imageAlt: "Vela acesa ao lado de um roupão branco macio",
  },
  {
    id: "novos-planos-no-papel",
    name: "Novos planos no papel",
    description: "Um planner para sonhar, planejar e conquistar.",
    priceInCents: 10_000,
    imageUrl: "/images/presentes/planner.png",
    imageAlt: "Caderno verde-escuro com folha dourada e caneta dourada",
  },
  {
    id: "nova-aventura",
    name: "Uma nova aventura",
    description: "Para a viagem que vai celebrar esse novo capítulo.",
    priceInCents: 20_000,
    imageUrl: "/images/presentes/viagem.png",
    imageAlt: "Mala de viagem verde-sálvia ao lado de uma pequena oliveira",
  },
];
