import type { JourneyPhoto } from "../domain/journey-photo";
import amizadePsicologia from "../assets/amizade-psicologia.jpg";
import canudoPsicologia from "../assets/canudo-psicologia.jpg";
import convite from "../assets/convite-paraninfa-corredor.jpg";
import paraninfaAceitou from "../assets/paraninfa-aceitou.jpg";
import primeiraBeca from "../assets/primeira-beca.jpg";
import turmaLegado from "../assets/turma-legado.jpg";

export const journeyPhotos: readonly JourneyPhoto[] = [
  {
    id: "canudo",
    image: canudoPsicologia,
    alt: "Mãos da Casey segurando o canudo verde com o símbolo da Psicologia bordado em dourado",
    caption: "Anos de dedicação guardados em um canudo.",
  },
  {
    id: "amizade",
    image: amizadePsicologia,
    alt: "Casey sorrindo abraçada a uma colega de turma, as duas com camisetas da Psicologia",
    caption: "As amizades que a Psicologia me deu.",
  },
  {
    id: "convite-paraninfa",
    image: convite,
    alt: "Turma caminhando animada pelo corredor da faculdade com o cartaz “Aceita ser nossa paraninfa?”",
    caption: "O dia em que fomos convidar nossa paraninfa.",
  },
  {
    id: "paraninfa",
    image: paraninfaAceitou,
    alt: "Casey ao lado da paraninfa, que usa faixa e tiara, segurando o cartaz do convite e um buquê de flores",
    caption: "Ela aceitou! Nossa paraninfa.",
    objectPosition: "50% 40%",
  },
  {
    id: "turma-legado",
    image: turmaLegado,
    alt: "Turma reunida na escadaria com colares coloridos segurando o cartaz “Legado 2026/2”",
    caption: "Legado 2026/2 — a turma que caminhou comigo.",
  },
  {
    id: "primeira-beca",
    image: primeiraBeca,
    alt: "Casey sorrindo vestida com a beca de formatura preta e verde, segurando o canudo",
    caption: "Vestindo a beca pela primeira vez.",
    objectPosition: "50% 35%",
  },
];
