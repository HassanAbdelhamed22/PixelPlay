import { Button, CloseButton, Dialog, HStack, Portal } from "@chakra-ui/react";

interface AlertDialogProps {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
}

const AlertDialog = ({ isOpen, onOpen, onClose }: AlertDialogProps) => {
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
        <Dialog.Trigger asChild>
          <Button variant="outline">Open Dialog </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog Title</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button>Save</Button>
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
