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
  gamesApiSlice,
  useDeleteGameMutation,
  useGetDashboardGamesQuery,
  useUpdateGameMutation,
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
import { token } from "../constant";
import { useSelector } from "react-redux";
import { selectNetwork } from "../app/features/networkSlice";

const DashboardGamesTable = () => {
  const { isConnected } = useSelector(selectNetwork);
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: modalOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();
  const {
    isLoading,
    data: gamesData,
    error,
  } = useGetDashboardGamesQuery({ page: 1 });
  const [deleteGame, { isLoading: isDeleting, isSuccess }] =
    useDeleteGameMutation();
  const [updateGame, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateGameMutation();
  const {
    data: genres,
    isLoading: isGenresLoading,
    error: genresError,
  } = useGetGenresQuery({});
  const [clickedGameId, setClickedGameId] = useState<
    string | number | undefined
  >(undefined);
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

  const onChangeGenresHandler = (selectedItems: string[]) => {
    setGameToEdit((prev) => {
      if (!prev) return prev;
      const selectedGenres =
        (genres?.data || [])
          .filter((genre: Genre) => selectedItems.includes(genre.title))
          .map((genre: Genre) => ({ id: genre.id, title: genre.title })) || [];
      return {
        ...prev,
        genres: selectedGenres,
      };
    });
  };

  const onChangeThumbnailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && gameToEdit) {
      if (!file.type.startsWith("image/")) {
        toaster.create({
          title: "Invalid file type",
          description: "Please upload an image file.",
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toaster.create({
          title: "File too large",
          description: "Image must be smaller than 5MB.",
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }
      console.log(
        "Thumbnail file selected:",
        file.name,
        file.size,
        file instanceof File
      );
      setGameToEdit((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          thumbnail: file,
        } as Game;
      });
    }
  };

  const onChangeImagesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && gameToEdit) {
      const invalidFiles = files.filter(
        (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024
      );
      if (invalidFiles.length > 0) {
        toaster.create({
          title: "Invalid files",
          description: "All files must be images smaller than 5MB.",
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }
      console.log(
        "Images files selected:",
        files.map((f) => `${f.name} (${f.size} bytes)`)
      );
      setGameToEdit((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: files,
        } as Game;
      });
    }
  };

  const onChangeVideoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && gameToEdit) {
      if (!file.type.startsWith("video/")) {
        toaster.create({
          title: "Invalid file type",
          description: "Please upload a video file.",
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toaster.create({
          title: "File too large",
          description: "Video must be smaller than 50MB.",
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }
      console.log(
        "Video file selected:",
        file.name,
        file.size,
        file instanceof File
      );
      setGameToEdit((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          videoTrailer: file,
        } as Game;
      });
    }
  };

  const uploadFile = async ({
    file,
    ref,
    refId,
    field,
  }: {
    file: File;
    ref: string;
    refId: string | number;
    field: string;
  }) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", ref);
    formData.append("refId", refId.toString());
    formData.append("field", field);

    console.log("Uploading file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      ref,
      refId,
      field,
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      console.log("Upload response status:", response.status, "for", file.name);
      if (!response.ok) {
        console.error("Upload failed with status:", response.status);
      }
      return response.ok; // Return true if successful, false otherwise
    } catch (error: any) {
      console.error("Upload error for", file.name, ":", error.message);
      return false; // Indicate failure
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!gameToEdit || !gameToEdit.documentId) return;

    try {
      const gameData = {
        title: gameToEdit.title || "",
        description: gameToEdit.description || "",
        price: Number(gameToEdit.price) || 0,
        discountPercentage: Number(gameToEdit.discountPercentage) || 0,
        stock: Number(gameToEdit.stock) || 0,
        platform: gameToEdit.platform || "",
        developer: gameToEdit.developer || "",
        genres: gameToEdit.genres
          ? gameToEdit.genres.map((genre) => genre.id)
          : [],

        // Preserve existing thumbnail ID if no new thumbnail is uploaded
        thumbnail:
          gameToEdit.thumbnail instanceof File
            ? undefined
            : gameToEdit.thumbnail?.id,

        // // Preserve existing video trailer ID if no new video trailer is uploaded
        // videoTrailer:
        //   gameToEdit.videoTrailer instanceof File
        //     ? undefined
        //     : gameToEdit.videoTrailer?.id,
      };

      // Update game data first and wait for response
      const updateResponse = await updateGame({
        id: gameToEdit.documentId,
        payload: { data: gameData },
        hasFiles:
          gameToEdit.thumbnail instanceof File ||
          (gameToEdit.images?.length ?? 0) > 0 ||
          gameToEdit.videoTrailer instanceof File,
      }).unwrap(); // Use .unwrap() to get the actual response

      console.log("Update response:", updateResponse);

      // Get the new game ID from the response
      const newGameId = updateResponse?.data?.id || updateResponse?.id;

      if (!newGameId) {
        throw new Error("No game ID returned from update");
      }

      console.log("Using new game ID for file uploads:", newGameId);

      // Collect all upload promises
      const uploadPromises = [];
      if (gameToEdit.thumbnail instanceof File) {
        uploadPromises.push(
          uploadFile({
            file: gameToEdit.thumbnail,
            ref: "api::game.game",
            refId: newGameId,
            field: "thumbnail",
          })
        );
      }
      if (gameToEdit.images && gameToEdit.images.length > 0) {
        const imageFiles = gameToEdit.images.filter(
          (img) => img instanceof File
        ) as File[];
        imageFiles.forEach((imageFile) => {
          uploadPromises.push(
            uploadFile({
              file: imageFile,
              ref: "api::game.game",
              refId: newGameId,
              field: "images",
            })
          );
        });
      }
      if (gameToEdit.videoTrailer instanceof File) {
        uploadPromises.push(
          uploadFile({
            file: gameToEdit.videoTrailer,
            ref: "api::game.game",
            refId: newGameId,
            field: "videoTrailer",
          })
        );
      }

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      const uploadSuccess = uploadResults.every((result) => result === true);

      // Update cache with new file data
      if (uploadSuccess) {
        gamesApiSlice.util.updateQueryData(
          "getDashboardGames",
          { page: 1 },
          (draft) => {
            const gameIndex = draft.data.findIndex(
              (game: Game) => game.documentId === gameToEdit.documentId
            );
            if (gameIndex !== -1) {
              const updatedGame = { ...draft.data[gameIndex] };
              if (gameToEdit.thumbnail instanceof File) {
                updatedGame.thumbnail = {
                  id: newGameId,
                  ...gameToEdit.thumbnail,
                }; // Placeholder, adjust based on API response
              }
              if (gameToEdit.images && gameToEdit.images.length > 0) {
                updatedGame.images = gameToEdit.images.map((img) => ({
                  id: newGameId,
                  ...img,
                })); // Placeholder
              }
              if (gameToEdit.videoTrailer instanceof File) {
                updatedGame.videoTrailer = {
                  id: newGameId,
                  ...gameToEdit.videoTrailer,
                }; // Placeholder
              }
              draft.data[gameIndex] = updatedGame;
            }
          }
        );
      }

      if (uploadSuccess) {
        toaster.create({
          title: "Game and files updated successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
      } else {
        toaster.create({
          title: "Game updated, but file upload failed",
          description: "Some files may not be linked. Check server logs.",
          type: "warning",
          duration: 5000,
          closable: true,
        });
      }

      modalOnClose();
      setGameToEdit(null);
    } catch (error: any) {
      console.error("Update failed:", error);
      toaster.create({
        title: "Failed to update game",
        description:
          error.message || "An error occurred while updating the game.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      modalOnClose();
      setGameToEdit(null);
      setClickedGameId(undefined);
      setTimeout(() => {
        toaster.create({
          title: "Game updated successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
      }, 0);
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      setClickedGameId(undefined);
      setTimeout(() => {
        toaster.create({
          title: "Game deleted successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
      }, 0);
    }
  }, [isSuccess]);

  if (isLoading || !isConnected) return <DashboardGamesTableSkeleton />;

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

  if (!gamesData || !Array.isArray(gamesData.data)) {
    console.log("Invalid data structure:", gamesData);
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="xl" color="gray.400">
          No valid game data found.
        </Text>
      </Box>
    );
  }

  console.log("Games gamesData:", gamesData.data);

  const genreItems = Array.from(
    new Set(
      (genres?.data || []).map((genre: Genre) => genre.title).filter(Boolean)
    )
  );

  if (gameToEdit) {
    console.log("Using documentId:", gameToEdit.documentId);
    console.log("Using id for file upload:", gameToEdit.id);
    console.log(
      "Are they the same?",
      gameToEdit.documentId === gameToEdit.id.toString()
    );
  }

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
            {gamesData?.data?.map((item: Game) => (
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
                    src={
                      item.thumbnail.formats?.medium?.url || item.thumbnail?.url
                    }
                    alt={item.thumbnail?.name || "Game Thumbnail"}
                    objectFit="cover"
                    boxShadow="md"
                    objectPosition="center"
                    border="1px solid var(--dark-700)"
                    borderRadius="md"
                    _hover={{ transform: "scale(1.1)" }}
                    transition="transform 0.3s"
                    loading="lazy"
                    boxSize={"120px"}
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
                        setGameToEdit({
                          ...item,
                          thumbnail: item.thumbnail || null,
                          images: item.images || [],
                          videoTrailer: item.videoTrailer || null,
                          title: item.title || "",
                          description: item.description || "",
                          price: item.price || 0,
                          discountPercentage: item.discountPercentage || 0,
                          stock: item.stock || 0,
                          platform: item.platform || "",
                          developer: item.developer || "",
                          genres: item.genres || [],
                          documentId: item.documentId,
                        } as Game);
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
        isLoading={isUpdating}
      >
        <form id="game-update-form" onSubmit={onSubmitHandler}>
          <Field.Root>
            <Field.Label>Title</Field.Label>
            <Input
              placeholder="Title"
              value={gameToEdit?.title || ""}
              name="title"
              onChange={onChangeHandler}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Textarea
              placeholder="Description"
              value={gameToEdit?.description || ""}
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
                value={gameToEdit?.price || 0}
                name="price"
                onChange={onChangeHandler}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Discount Percentage</Field.Label>
              <Input
                placeholder="Discount Percentage"
                type="number"
                value={gameToEdit?.discountPercentage || 0}
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
                value={gameToEdit?.stock || 0}
                name="stock"
                onChange={onChangeHandler}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Platform</Field.Label>
              <Input
                placeholder="Platform"
                value={gameToEdit?.platform || ""}
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
              onChangeGenresHandler(selectedItems);
            }}
            defaultSelectedItems={
              gameToEdit?.genres.map((genre) => genre.title) || []
            }
          />
          <Flex gap={2}>
            <FileUpload.Root
              accept={["image/*"]}
              maxFiles={1}
              onChange={onChangeThumbnailHandler}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Label>Thumbnail</FileUpload.Label>
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  <UploadIcon /> Upload file
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List />
            </FileUpload.Root>
            <FileUpload.Root
              maxFiles={5}
              accept={["image/*"]}
              onChange={onChangeImagesHandler}
            >
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
          <FileUpload.Root
            accept={["video/*"]}
            maxFiles={1}
            onChange={onChangeVideoHandler}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Label>Video Trailer</FileUpload.Label>
            <FileUpload.Trigger asChild>
              <Button variant="outline" size="sm">
                <UploadIcon /> Upload file
              </Button>
            </FileUpload.Trigger>
            <FileUpload.List />
          </FileUpload.Root>
        </form>
      </CustomModal>
    </>
  );
};

export default DashboardGamesTable;
