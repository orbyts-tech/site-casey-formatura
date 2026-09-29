"use client";

export interface SegmentedFilterOption<TValue extends string> {
  readonly value: TValue;
  readonly label: string;
  readonly count: number;
}

interface SegmentedFilterProps<TValue extends string> {
  readonly label: string;
  readonly options: readonly SegmentedFilterOption<TValue>[];
  readonly selectedValue: TValue;
  readonly onChange: (value: TValue) => void;
}

export function SegmentedFilter<TValue extends string>({
  label,
  options,
  selectedValue,
  onChange,
}: SegmentedFilterProps<TValue>) {
  return (
    <div role="group" aria-label={label} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
              isSelected
                ? "border-forest bg-forest text-paper"
                : "border-gold-soft/70 bg-paper/70 text-ink hover:border-gold hover:text-forest"
            }`}
          >
            {option.label}
            <span
              className={`min-w-5 rounded-full px-1.5 text-center text-[0.7rem] tabular-nums ${
                isSelected ? "bg-paper/20 text-paper" : "bg-sage/70 text-ink-soft"
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
