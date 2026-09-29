import { BotanicalSprig } from "./botanical-sprig";

export function BotanicalBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <BotanicalSprig className="absolute -right-4 top-20 w-28 rotate-[25deg] opacity-70 sm:w-36 lg:top-28 lg:w-44 2xl:w-56" />
      <BotanicalSprig className="absolute -left-6 top-[38%] w-24 -rotate-[20deg] opacity-60 sm:w-32 lg:w-40 2xl:w-52" />
      <BotanicalSprig className="absolute -left-2 bottom-10 hidden w-28 rotate-[15deg] opacity-50 md:block lg:w-36 2xl:w-48" />
      <BotanicalSprig className="absolute -right-6 bottom-0 w-28 -rotate-[150deg] opacity-60 sm:w-36 lg:w-44 2xl:w-56" />
    </div>
  );
}
