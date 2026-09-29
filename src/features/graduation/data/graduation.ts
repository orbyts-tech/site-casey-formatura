import type { Graduate, GraduationEvent } from "../domain/graduation";

export const graduate: Graduate = {
  name: "Casey",
  course: "Psicologia",
  graduationYear: 2027,
  photoUrl: "/images/casey-retrato.jpg",
  gownPhotoUrl: "/images/casey-jornada.jpg",
  giftsWelcomePhotoUrl: "/images/casey-presentes.jpg",
  celebrationPhotoUrl: "/images/casey-celebrando.jpg",
};

export const graduationEvent: GraduationEvent = {
  title: "Formatura da Casey em Psicologia",
  description: "Algumas conquistas ficam mais bonitas quando compartilhadas. Horário e local serão confirmados em breve.",
  isoDate: "2027-01-23",
  dateLabel: "23 de janeiro de 2027",
  scheduleNote: "Horário e local serão confirmados em breve.",
  details: {
    time: null,
    location: null,
    dressCode: null,
  },
};
