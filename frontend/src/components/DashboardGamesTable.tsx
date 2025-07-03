import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Stack,
  Table,
  Text,
  Image,
  Button,
  Badge,
  useDisclosure,
  Field,
  Input,
} from "@chakra-ui/react";
import DashboardGamesTableSkeleton from "./DashboardGamesTableSkeleton";
import {
  useDeleteGameMutation,
  useGetDashboardGamesQuery,
} from "../app/services/games";
import { AlertTriangleIcon, Eye, PenIcon, TrashIcon } from "lucide-react";
import type { Game } from "../types";
import { Link } from "react-router-dom";
import AlertDialog from "../shared/AlertDialog";
import { useEffect, useState } from "react";
import { toaster } from "./ui/toaster";
import CustomModal from "../shared/Modal";

const DashboardGamesTable = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: modalOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();
  const { isLoading, data, error } = useGetDashboardGamesQuery({ page: 1 });
  const [deleteGame, { isLoading: isDeleting, isSuccess }] =
    useDeleteGameMutation();
  const [clickedGameId, setClickedGameId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (isSuccess) {
      onClose();
      setClickedGameId(undefined);
      toaster.create({
        title: "Game deleted successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
    }
  }, [isSuccess, onClose]);

  if (isLoading) return <DashboardGamesTableSkeleton />;

  if (error) {
    return (
      <Alert.Root status="error" borderRadius="md" m={6}>
        <AlertTriangleIcon />
        <Box>
          <AlertTitle>Failed to load games</AlertTitle>
          <AlertDescription>
            {error && "status" in error
              ? `Error ${error.status}: ${
                  (error as any).data?.error?.message || "Unknown error"
                }`
              : "An unexpected error occurred"}
          </AlertDescription>
        </Box>
      </Alert.Root>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="xl" color="gray.400">
          No games found.
        </Text>
      </Box>
    );
  }
  return (
    <>
      <Stack gap="10" maxW={"100%"} mx={"8"} my={"8"} borderRadius={"md"}>
        <Table.Root
          size="sm"
          variant="outline"
          colorScheme="gray"
          borderRadius={"md"}
          interactive
          boxShadow="md"
          stickyHeader
        >
          <Table.Header bg={"var(--dark-800)"}>
            <Table.Row>
              <Table.ColumnHeader>Game ID</Table.ColumnHeader>
              <Table.ColumnHeader>Game</Table.ColumnHeader>
              <Table.ColumnHeader>Genre</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Thumbnail
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Platform
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Price</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Discount
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Stock</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Rating</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.data?.map((item: Game) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>
                  {item.genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      fontWeight="semibold"
                      px={2}
                      py={1}
                      borderRadius="md"
                      bgColor={"var(--dark-900)"}
                      mr={1}
                    >
                      {genre.title}
                    </Badge>
                  ))}
                </Table.Cell>
                <Table.Cell textAlign="center" width={"120px"}>
                  <Image
                    src={`${import.meta.env.VITE_SERVER_URL}${
                      item?.thumbnail?.url
                    }`}
                    alt={item.thumbnail?.name || "Game thumbnail"}
                    width={100}
                    height={100}
                    objectFit="fill"
                    boxShadow="md"
                    maxHeight="100px"
                    maxWidth="100px"
                    objectPosition="center"
                    border="1px solid var(--dark-700)"
                    borderRadius="md"
                    _hover={{ transform: "scale(1.1)" }}
                    transition="transform 0.3s"
                    loading="lazy"
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{item.platform}</Table.Cell>
                <Table.Cell textAlign="center">{item.price}</Table.Cell>
                <Table.Cell textAlign="center">
                  {item.discountPercentage
                    ? `${item.discountPercentage}%`
                    : "N/A"}
                </Table.Cell>
                <Table.Cell textAlign="center">{item.stock}</Table.Cell>
                <Table.Cell textAlign="center">{item.rating}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Box display="flex" justifyContent={"center"} gap={2}>
                    <Link to={`/game/${item.documentId}`}>
                      <Button
                        bg="purple.300"
                        color="gray.900"
                        size="xs"
                        variant={"solid"}
                      >
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Button
                      bg="blue.300"
                      color="gray.900"
                      size="xs"
                      variant={"solid"}
                      onClick={() => {
                        modalOnOpen();
                        setClickedGameId(item.documentId);
                      }}
                    >
                      <PenIcon size={16} />
                    </Button>
                    <Button
                      bg="red.300"
                      color="gray.900"
                      size="xs"
                      variant={"solid"}
                      onClick={() => {
                        onOpen();
                        setClickedGameId(item.documentId);
                      }}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>
      <AlertDialog
        isOpen={open}
        onOpen={onOpen}
        onClose={onClose}
        title="Delete Game"
        description="Are you sure you want to delete this game? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
        isLoading={isDeleting}
        onConfirmHandler={() => {
          deleteGame(clickedGameId);
        }}
      />

      <CustomModal
        isOpen={modalOpen}
        onOpen={modalOnOpen}
        onClose={modalOnClose}
        title="Update Game"
      >
        <Field.Root>
          <Field.Label>First Name</Field.Label>
          <Input placeholder="First Name" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Last Name</Field.Label>
          <Input placeholder="Focus First" />
        </Field.Root>
      </CustomModal>
    </>
  );
};

export default DashboardGamesTable;
