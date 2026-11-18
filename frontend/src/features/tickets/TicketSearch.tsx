interface TicketSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TicketSearch({
  value,
  onChange,
  placeholder = 'Sök på rubrik eller anmälare',
}: TicketSearchProps) {
  return (
    <div className="search-box">
      <input
        className="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
