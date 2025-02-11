interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextArea = ({
  value,
  onChange,
  placeholder = "Input text",
}: TextAreaProps) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[160px] p-4 font-semibold rounded-3xl border-2 bg-white border-[#ECECED] text-[#4F4B5C] placeholder:text-[#4F4B5C]"
    />
  );
};

// Usage example:
// const [text, setText] = useState("");
// <TextArea value={text} onChange={setText} />
