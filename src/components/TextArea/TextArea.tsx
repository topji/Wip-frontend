interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TextArea = ({
  value,
  onChange,
  placeholder = "Input text",
  className,
}: TextAreaProps) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-3 rounded-lg border border-gray-200 resize-none ${className || ''}`}
    />
  );
};

// Usage example:
// const [text, setText] = useState("");
// <TextArea value={text} onChange={setText} />
