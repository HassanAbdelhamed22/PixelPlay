import React, { useState, Component } from "react";
import {
  Box,
  Container,
  Text,
  Input,
  InputGroup,
  HStack,
  VStack,
  IconButton,
  Grid,
  Button,
  Card,
  CardBody,
  Portal,
} from "@chakra-ui/react";
import { Select, createListCollection } from "@chakra-ui/react";
import { SearchIcon, FilterIcon, GridIcon, ListIcon } from "lucide-react";
import type { Game } from "../types";
import GameCard from "../components/GameCart";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Text color="red.500">Error in Select component</Text>;
    }
    return this.props.children;
  }
}

const GamesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [filterGenre, setFilterGenre] = useState("all");

  const mapGameData = (data: any): Game => ({
    id: data.id || data.documentId,
    title: data.title || "Untitled",
    description: data.description || "",
    price: data.price || 0,
    discountPercentage: data.discountPercentage || 0,
    thumbnail: {
      formats: data.thumbnail?.formats,
      url: data.thumbnail?.url || "/placeholder.jpg",
      name: data.thumbnail?.name || "Thumbnail",
    },
    images: data.images || [],
    developer: data.developer || "Unknown",
    platform: data.platform || "Unknown",
    rating: data.rating || 0,
    releaseDate: data.releaseDate || new Date().toISOString(),
    stock: data.stock || 0,
    videoTrailer: data.videoTrailer || { url: "", name: "" },
    genres: data.genres || [],
  });

  const fetchGames = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/games?populate[thumbnail]=true&populate[images]=true&populate[genres]=true`
      );
      return data.data.map(mapGameData);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  const allGenres = Array.from(
    new Set(
      Array.isArray(data)
        ? (data as Game[])
            .flatMap((game) =>
              game.genres
                ? game.genres
                    .map((genre) => genre.title)
                    .filter(
                      (name) => typeof name === "string" && name.trim() !== ""
                    )
                : []
            )
            .filter(Boolean)
        : []
    )
  );

  const genresFrameworks = createListCollection({
    items: [
      { value: "all", label: "All Genres" },
      ...(allGenres.length > 0
        ? allGenres.map((genre) => ({
            value: genre,
            label: genre,
          }))
        : []),
    ],
  });

  const sortOptions = createListCollection({
    items: [
      { value: "popular", label: "Most Popular" },
      { value: "newest", label: "Newest" },
      { value: "price-low", label: "Price: Low to High" },
      { value: "price-high", label: "Price: High to Low" },
      { value: "rating", label: "Highest Rated" },
    ],
  });

  const filteredGames = data
    ? (data as Game[]).map(mapGameData).filter((game) => {
        if (filterGenre === "all") return true;
        return game.genres.some(
          (genre) => genre.title.toLowerCase() === filterGenre.toLowerCase()
        );
      })
    : [];

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === "popular") return b.rating - a.rating;
    if (sortBy === "newest")
      return (
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  if (isLoading) {
    return <Text>Loading games...</Text>;
  }

  if (isError) {
    return <Text color="red.500">Error loading games</Text>;
  }

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack align="start" gap={4} mb={8}>
          <Text fontSize="4xl" fontWeight="bold">
            <Text as="span" className="gaming-title">
              All Games
            </Text>
          </Text>
          <Text color="gray.400">Discover your next gaming adventure</Text>
        </VStack>

        <Card.Root
          mb={8}
          bg="var(--dark-900)"
          shadow="md"
          border="1px solid"
          borderColor="var(--dark-600)"
          borderRadius="xl"
          overflow="hidden"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
          }}
          transition="all 0.3s"
        >
          <CardBody>
            <VStack gap={4} align="stretch">
              <HStack gap={4} flexWrap="wrap">
                <InputGroup
                  flex={1}
                  maxW="md"
                  startElement={
                    <SearchIcon size={20} color="var(--dark-400)" />
                  }
                >
                  <Input
                    placeholder="Search games..."
                    bg="var(--dark-800)"
                    border="1px solid"
                    borderColor="var(--dark-700)"
                    _focus={{
                      borderColor: "var(--primary-400)",
                      boxShadow: "0 0 0 1px var(--chakra-colors-primary-400)",
                    }}
                    transition={"border-color 0.2s, box-shadow 0.2s"}
                  />
                </InputGroup>

                <HStack gap={4}>
                  <HStack gap={2}>
                    <FilterIcon size={20} color="gray" />
                    <ErrorBoundary>
                      <Select.Root
                        collection={genresFrameworks}
                        size="sm"
                        value={[filterGenre]}
                        onValueChange={({ value }) =>
                          setFilterGenre(value[0] || "all")
                        }
                        minW="150px"
                        bg="var(--dark-800)"
                        border="1px solid"
                        borderColor="var(--dark-700)"
                        _focus={{
                          borderColor: "var(--primary-400)",
                          boxShadow:
                            "0 0 0 1px var(--chakra-colors-primary-400)",
                        }}
                        transition={"border-color 0.2s, box-shadow 0.2s"}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select genre" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {genresFrameworks.items.map((item) => (
                                <Select.Item item={item} key={item.value}>
                                  {item.label}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </ErrorBoundary>
                  </HStack>

                  <ErrorBoundary>
                    <Select.Root
                      collection={sortOptions}
                      size="sm"
                      value={[sortBy]}
                      onValueChange={({ value }) =>
                        setSortBy(value[0] || "popular")
                      }
                      minW="150px"
                      bg="var(--dark-800)"
                      border="1px solid"
                      borderColor="var(--dark-600)"
                      _focus={{
                        borderColor: "var(--primary-400)",
                        boxShadow: "0 0 0 1px var(--chakra-colors-primary-400)",
                      }}
                      transition={"border-color 0.2s, box-shadow 0.2s"}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select sort option" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {sortOptions.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </ErrorBoundary>
                  <HStack bg="var(--dark-800)" borderRadius="lg" p={1}>
                    <IconButton
                      aria-label="Grid view"
                      size="sm"
                      variant={viewMode === "grid" ? "solid" : "ghost"}
                      colorScheme={viewMode === "grid" ? "primary" : "gray"}
                      onClick={() => setViewMode("grid")}
                    >
                      <GridIcon size={16} />
                    </IconButton>
                    <IconButton
                      aria-label="List view"
                      size="sm"
                      variant={viewMode === "list" ? "solid" : "ghost"}
                      colorScheme={viewMode === "list" ? "primary" : "gray"}
                      onClick={() => setViewMode("list")}
                    >
                      <ListIcon size={16} />
                    </IconButton>
                  </HStack>
                </HStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card.Root>

        <Grid
          templateColumns={
            viewMode === "grid"
              ? "repeat(auto-fill, minmax(250px, 1fr))"
              : "1fr"
          }
          gap={6}
          mb={12}
        >
          {sortedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              size={viewMode === "list" ? "small" : "medium"}
            />
          ))}
        </Grid>

        <Box textAlign="center">
          <Button className="gaming-btn-primary" size="lg" px={8}>
            Load More Games
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default GamesPage;
