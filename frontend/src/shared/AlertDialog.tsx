import { Button, CloseButton, Dialog, HStack, Portal } from "@chakra-ui/react";
import { AlertCircleIcon } from "lucide-react";

interface AlertDialogProps {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
}

const AlertDialog = ({
  isOpen,
  onOpen,
  onClose,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
}: AlertDialogProps) => {
  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
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
                <Dialog.Title>
                  <HStack>
                    <AlertCircleIcon size={24} color="red" />
                    <span>{title}</span>
                  </HStack>
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>{description}</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onClose}>
                    {cancelText}
                  </Button>
                </Dialog.ActionTrigger>
                <Button bg={"red.500"} color={"white"}>
                  {confirmText}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default AlertDialog;
