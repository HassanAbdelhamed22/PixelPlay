import { Button, Dialog, Portal, Stack } from "@chakra-ui/react";
import { useRef } from "react";

interface CustomModalProps {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
  title: string;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const CustomModal = ({
  isOpen,
  onOpen,
  onClose,
  title,
  cancelText = "Cancel",
  confirmText = "Submit",
  isLoading = false,
  children,
}: CustomModalProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Dialog.Root
      initialFocusEl={() => ref.current}
      placement="center"
      motionPreset="slide-in-bottom"
      open={isOpen}
      onOpenChange={(details) => {
        onOpen(details.open);
        if (!details.open) {
          onClose();
        }
      }}
      closeOnEscape={true}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="var(--dark-900)">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">{children}</Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  {cancelText}
                </Button>
              </Dialog.ActionTrigger>
              <Button loading={isLoading} type="submit">
                {confirmText}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CustomModal;
