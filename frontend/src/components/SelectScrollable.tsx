import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type dataType = {
  placeholder: string;
  data: Array<string>;
  value: string;
  onValueChange: (value: string) => void;
};

export function SelectScrollable({
  placeholder,
  data,
  value,
  onValueChange,
}: dataType) {
  const items = data.map((item: string, i: number) => (
    <SelectItem key={i} value={item}>
      {item}
    </SelectItem>
  ));

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={0} value="0">
          ---
        </SelectItem>
        {items}
      </SelectContent>
    </Select>
  );
}
