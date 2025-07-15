import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateTaskModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-task",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    );

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    
    return {
        isOpen, 
        setIsOpen,
        open, 
        close,
    }
}

{/*export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const [status, setStatus] = useQueryState("status", parseAsString);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,       // boolean
    setIsOpen,
    open,         // () => void
    close,        // () => void
    status,       // string | null
    setStatus,    // (value: string | null) => void
  };
}; */}