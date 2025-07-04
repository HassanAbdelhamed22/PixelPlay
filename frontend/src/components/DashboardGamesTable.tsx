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
  FileUpload,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import DashboardGamesTableSkeleton from "./DashboardGamesTableSkeleton";
import {
  useDeleteGameMutation,
  useGetDashboardGamesQuery,
} from "../app/services/games";
import {
  AlertTriangleIcon,
  Eye,
  PenIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import type { Game, Genre } from "../types";
import { Link } from "react-router-dom";
import AlertDialog from "../shared/AlertDialog";
import { useEffect, useState } from "react";
import { toaster } from "./ui/toaster";
import CustomModal from "../shared/Modal";
import { useGetGenresQuery } from "../app/services/genres";
import MultiSelectCombobox from "../shared/MultiSelectCombobox";

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
  const {
    data: genres,
    isLoading: isGenresLoading,
    error: genresError,
  } = useGetGenresQuery({});
  const [clickedGameId, setClickedGameId] = useState<string | undefined>(
    undefined
  );
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGameToEdit((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

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

  console.log("Games Data:", data.data);

  // Use all genres from the genres API, not just those assigned to games
  const genreItems = Array.from(
    new Set(
      (genres?.data || []).map((genre: Genre) => genre.title).filter(Boolean)
    )
  );

  console.log("Genre Items:", genreItems);
  // Handle genres loading and error states
  if (isGenresLoading) {
    return <Box p={6}>Loading genres...</Box>;
  }

  if (genresError) {
    return (
      <Alert.Root status="error" borderRadius="md" m={6}>
        <AlertTriangleIcon />
        <Box>
          <AlertTitle>Failed to load genres</AlertTitle>
          <AlertDescription>
            {genresError && "status" in genresError
              ? `Error ${genresError.status}: ${
                  (genresError as any).data?.error?.message || "Unknown error"
                }`
              : "An unexpected error occurred while loading genres"}
          </AlertDescription>
        </Box>
      </Alert.Root>
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
                        setGameToEdit(item);
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
      {console.log("Game to Edit:", gameToEdit)}
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
        confirmText="Update"
      >
        <Field.Root>
          <Field.Label>Title</Field.Label>
          <Input
            placeholder="Title"
            value={gameToEdit?.title}
            name="title"
            onChange={onChangeHandler}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Description</Field.Label>
          <Textarea
            placeholder="Description"
            value={gameToEdit?.description}
            autoresize
            name="description"
            onChange={onChangeHandler}
          />
        </Field.Root>
        <Flex gap={2}>
          <Field.Root>
            <Field.Label>Price</Field.Label>
            <Input
              placeholder="Price"
              type="number"
              value={gameToEdit?.price}
              name="price"
              onChange={onChangeHandler}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Discount Percentage</Field.Label>
            <Input
              placeholder="Discount Percentage"
              type="number"
              value={gameToEdit?.discountPercentage ?? ""}
              name="discountPercentage"
              onChange={onChangeHandler}
            />
          </Field.Root>
        </Flex>
        <Flex gap={2}>
          <Field.Root>
            <Field.Label>Stock</Field.Label>
            <Input
              placeholder="Stock"
              type="number"
              value={gameToEdit?.stock}
              name="stock"
              onChange={onChangeHandler}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Platform</Field.Label>
            <Input
              placeholder="Platform"
              value={gameToEdit?.platform}
              name="platform"
              onChange={onChangeHandler}
            />
          </Field.Root>
        </Flex>
        <MultiSelectCombobox
          label="Genres"
          items={genreItems as string[]}
          placeholder="Select genres"
          emptyMessage="No genres found"
          onSelectionChange={(selectedItems) => {
            console.log("Selected genres:", selectedItems);
          }}
          defaultSelectedItems={
            gameToEdit?.genres.map((genre) => genre.title) || []
          }
        />
        <Flex gap={2}>
          <FileUpload.Root accept={["image/*"]} maxFiles={1}>
            <FileUpload.HiddenInput />
            <FileUpload.Label>Thumbnail</FileUpload.Label>
            <FileUpload.Trigger asChild>
              <Button variant="outline" size="sm">
                <UploadIcon /> Upload file
              </Button>
            </FileUpload.Trigger>
            <FileUpload.List />
          </FileUpload.Root>
          <FileUpload.Root maxFiles={5} accept={["image/*"]}>
            <FileUpload.HiddenInput />
            <FileUpload.Label>Images</FileUpload.Label>
            <FileUpload.Trigger asChild>
              <Button variant="outline" size="sm">
                <UploadIcon /> Upload file
              </Button>
            </FileUpload.Trigger>
            <FileUpload.List showSize clearable />
          </FileUpload.Root>
        </Flex>
        <FileUpload.Root accept={["video/*"]} maxFiles={1}>
          <FileUpload.HiddenInput />
          <FileUpload.Label>Video Trailer</FileUpload.Label>
          <FileUpload.Trigger asChild>
            <Button variant="outline" size="sm">
              <UploadIcon /> Upload file
            </Button>
          </FileUpload.Trigger>
          <FileUpload.List />
        </FileUpload.Root>
      </CustomModal>
    </>
  );
};

export default DashboardGamesTable;
