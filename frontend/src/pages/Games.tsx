import React, { useState } from "react";
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

const GamesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [filterGenre, setFilterGenre] = useState("all");

  const games: Game[] = [
    {
      id: 1,
      title: "Cyber Nexus 2077",
      description:
        "Experience the ultimate cyberpunk adventure in a dystopian future.",
      price: 59.99,
      discountPercentage: 25,
      thumbnail: {
        url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
        name: "Cyber Nexus 2077 Thumbnail",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
          name: "Cyber Nexus 2077 Screenshot 1",
        },
      ],
      developer: "CyberStudio",
      platform: "PC",
      rating: 4.8,
      releaseDate: "2024-12-01",
      stock: 100,
      videoTrailer: {
        url: "https://www.youtube.com/watch?v=trailer1",
        name: "Cyber Nexus 2077 Trailer",
      },
      genres: [{ id: "1", name: "Action RPG" }],
    },
    {
      id: 2,
      title: "Neon Racing Elite",
      description: "High-speed racing in neon-lit futuristic cities.",
      price: 39.99,
      discountPercentage: 20,
      thumbnail: {
        url: "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=400",
        name: "Neon Racing Elite Thumbnail",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=400",
          name: "Neon Racing Elite Screenshot 1",
        },
      ],
      developer: "SpeedWorks",
      platform: "PC",
      rating: 4.6,
      releaseDate: "2024-11-15",
      stock: 100,
      videoTrailer: {
        url: "https://www.youtube.com/watch?v=trailer2",
        name: "Neon Racing Elite Trailer",
      },
      genres: [{ id: "2", name: "Racing" }],
    },
    {
      id: 3,
      title: "Pixel Warriors",
      description:
        "Classic pixel art platformer with modern gameplay mechanics.",
      price: 29.99,
      discountPercentage: 0,
      thumbnail: {
        url: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400",
        name: "Pixel Warriors Thumbnail",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400",
          name: "Pixel Warriors Screenshot 1",
        },
      ],
      developer: "PixelCraft",
      platform: "PC",
      rating: 4.9,
      releaseDate: "2024-10-20",
      stock: 100,
      videoTrailer: {
        url: "https://www.youtube.com/watch?v=trailer3",
        name: "Pixel Warriors Trailer",
      },
      genres: [{ id: "3", name: "Platformer" }],
    },
    {
      id: 4,
      title: "Space Odyssey VR",
      description: "Immersive VR space exploration experience.",
      price: 49.99,
      discountPercentage: 30,
      thumbnail: {
        url: "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=400",
        name: "Space Odyssey VR Thumbnail",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=400",
          name: "Space Odyssey VR Screenshot 1",
        },
      ],
      developer: "VR Studios",
      platform: "PC",
      rating: 4.7,
      releaseDate: "2024-09-10",
      stock: 100,
      videoTrailer: {
        url: "https://www.youtube.com/watch?v=trailer4",
        name: "Space Odyssey VR Trailer",
      },
      genres: [{ id: "4", name: "VR Adventure" }],
    },
    {
      id: 5,
      title: "Mystic Realms",
      description: "Embark on an epic fantasy adventure in mystical realms.",
      price: 44.99,
      discountPercentage: 0,
      thumbnail: {
        url: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400",
        name: "Mystic Realms Thumbnail",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400",
          name: "Mystic Realms Screenshot 1",
        },
      ],
      developer: "MysticGames",
      platform: "PC",
      rating: 4.5,
      releaseDate: "2024-08-25",
      stock: 100,
      videoTrailer: {
        url: "https://www.youtube.com/watch?v=trailer5",
        name: "Mystic Realms Trailer",
      },
      genres: [{ id: "5", name: "Fantasy RPG" }],
    },
    {
      id: 6,
      title: "Quantum Strike",
      description: "Fast-paced multiplayer shooter with quantum mechanics.",
      price: 34.99,
      discountPercentage: 15,
      thumbnail: {
        url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
        name: "Quantum Strike Thumbnail",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
          name: "Quantum Strike Screenshot 1",
        },
      ],
      developer: "QuantumStudio",
      platform: "PC",
      rating: 4.4,
      releaseDate: "2024-07-12",
      stock: 100,
      videoTrailer: {
        url: "https://www.youtube.com/watch?v=trailer6",
        name: "Quantum Strike Trailer",
      },
      genres: [{ id: "6", name: "FPS" }],
    },
  ];

  const genres = [
    "all",
    "Action RPG",
    "Racing",
    "Platformer",
    "VR Adventure",
    "Fantasy RPG",
    "FPS",
  ];

  const genresFrameworks = createListCollection({
    items: genres.map((genre) => ({
      value: genre,
      label: genre === "all" ? "All Genres" : genre,
    })),
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

  const filteredGames = games.filter(
    (game) =>
      filterGenre === "all" ||
      game.genres.some((genre) => genre.name === filterGenre)
  );

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="7xl">
        {/* Header */}
        <VStack align="start" gap={4} mb={8}>
          <Text fontSize="4xl" fontWeight="bold">
            <Text as="span" className="gaming-title">
              All Games
            </Text>
          </Text>
          <Text color="gray.400">Discover your next gaming adventure</Text>
        </VStack>

        {/* Search and Filters */}
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
                {/* Search */}
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

                {/* Filters */}
                <HStack gap={4}>
                  <HStack gap={2}>
                    <FilterIcon size={20} color="gray" />
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
                        boxShadow: "0 0 0 1px var(--chakra-colors-primary-400)",
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
                  </HStack>

                  {/* Sort By Select */}
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

                  {/* View Mode Toggle */}
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

        {/* Games Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: viewMode === "grid" ? "repeat(1, 1fr)" : "1fr",
            md: viewMode === "grid" ? "repeat(2, 1fr)" : "1fr",
            lg: viewMode === "grid" ? "repeat(3, 1fr)" : "1fr",
            xl: viewMode === "grid" ? "repeat(4, 1fr)" : "1fr",
          }}
          gap={6}
          mb={12}
        >
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              size={viewMode === "list" ? "small" : "medium"}
            />
          ))}
        </Grid>

        {/* Load More */}
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
