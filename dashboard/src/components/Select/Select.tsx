import {
  Select as SelectUI,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Select = (props: React.ComponentProps<typeof SelectUI>): JSX.Element => {
  const { children, ...propsWithoutChildren } = props;

  return (
    <SelectUI {...propsWithoutChildren}>
      <SelectTrigger className="w-auto rounded-full border-2 border-dimGray px-6 py-4 text-base font-medium text-dimGray">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </SelectUI>
  );
};

export default Select;
export { SelectItem };
