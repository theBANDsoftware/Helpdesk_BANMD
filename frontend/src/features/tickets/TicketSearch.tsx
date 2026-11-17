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
    <div style={{ marginBottom: '1rem', width: '100%', maxWidth: '100%' }}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          padding: '0.5rem',
          fontSize: '1rem',
        }}
      />
    </div>
  );
}