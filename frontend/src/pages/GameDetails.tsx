import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import type { Game } from "../types";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BuildingIcon,
  CalendarIcon,
  DollarSign,
  HeartIcon,
  PlayIcon,
  ShareIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { addToCart } from "../app/features/cartSlice";
import { toaster } from "../components/ui/toaster";
import CookieService from "../services/CookieService";

const GameDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: loginData } = useSelector((state: RootState) => state.login);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const mapGameData = (data: any): Game => {
    const images = data.images || [];
    const mappedImages = images.map((img: any) => ({
      url: img.formats?.small?.url || img.url || "",
      name: img.name || "Image",
    }));
    return {
      id: data.id || data.documentId,
      documentId: data.documentId || data.id,
      title: data.title || "Untitled",
      description: data.description || "",
      price: data.price || 0,
      discountPercentage: data.discountPercentage || 0,
      thumbnail: {
        formats: data.thumbnail?.formats,
        url: data.thumbnail?.url || "/placeholder.jpg",
        name: data.thumbnail?.name || "Thumbnail",
      },
      images: mappedImages.length > 0 ? mappedImages : null,
      developer: data.developer || "Unknown",
      platform: data.platform || "Unknown",
      rating: data.rating || 0,
      releaseDate: data.releaseDate || new Date().toISOString(),
      stock: data.stock || 0,
      videoTrailer: data.videoTrailer || { url: "", name: "" },
      genres: data.genres || [],
    };
  };

  const fetchGames = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/games/${id}?populate[thumbnail]=true&populate[images]=true&populate[genres]=true&populate[videoTrailer]=true`
      );
      console.log("Fetched game data:", data);
      return mapGameData(data.data);
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  };

  // Fetch related games by genre
  const fetchRelatedGames = async (genreId: string) => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/games?populate[thumbnail]=true&populate[genres]=true&filters[genres][id][$eq]=${genreId}&filters[id][$ne]=${id}`
      );
      console.log("Fetched related games:", data);
      return data.data.map((game: any) => mapGameData(game));
    } catch (error) {
      console.error("Error fetching related games:", error);
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["games", id],
    queryFn: fetchGames,
    enabled: !!id,
  });

  const {
    data: relatedGames,
    isLoading: isRelatedLoading,
    isError: isRelatedError,
    error: relatedError,
  } = useQuery({
    queryKey: ["relatedGames", data?.genres[0]?.id],
    queryFn: () => fetchRelatedGames(data?.genres[0]?.id || ""),
    enabled: !!data?.genres[0]?.id,
  });

  const goBack = () => navigate(-1);

  useEffect(() => {
    document.title = `Game Details - ${data?.title}`;
  }, [data]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        size={20}
        color={i < Math.floor(rating) ? "#fbbf24" : "#64748b"}
        fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
      />
    ));
  };

  const addToCartHandler = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    event.preventDefault();

    if (!loginData?.user?.id) {
      toaster.create({
        title: "Please log in to add items to cart",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (!data) {
      toaster.create({
        title: "Game data is not loaded yet.",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    try {
      const token = CookieService.get("jwt");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/cart-items`,
        {
          data: {
            quantity: 1,
            game: data.id,
            user: loginData.user.id,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if response has the expected structure
      if (!response.data?.data) {
        throw new Error("Unexpected API response structure");
      }

      const cartItem = {
        id: response.data.data.id,
        documentId: response.data.data.documentId,
        quantity: response.data.data.quantity || 1,
        game: data,
      };

      dispatch(addToCart(cartItem));
      toaster.create({
        title: `${data.title} added to cart successfully`,
        type: "success",
        duration: 3000,
        closable: true,
      });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toaster.create({
        title:
          error.response?.data?.error?.message || "Failed to add item to cart",
        type: "error",
        duration: 3000,
        closable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" py={8}>
        <Container maxW="7xl">
          <Text>Loading...</Text>
        </Container>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box minH="100vh" py={8}>
        <Container maxW="7xl">
          <Text color="red.500">
            Error: {error?.message || "Failed to load game details"}
          </Text>
          <Text cursor="pointer" color="blue.400" onClick={() => navigate(-1)}>
            Go Back
          </Text>
        </Container>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box minH="100vh" py={8}>
        <Container maxW="7xl">
          <Text>No game found</Text>
          <Text cursor="pointer" color="blue.400" onClick={() => navigate(-1)}>
            Go Back
          </Text>
        </Container>
      </Box>
    );
  }

  // Combine thumbnail and images into displayImages, starting with thumbnail
  const displayImages: { url: string; name: string }[] = [
    { url: data.thumbnail.url, name: data.thumbnail.name },
    ...(data.images || []).map((img: any) => ({
      url: img.url,
      name: img.name || "Image",
    })),
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "linear",
    afterChange: (current: number) => setSelectedImage(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const relatedSettings = {
    ...settings,
    slidesToShow: 3,
  };

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="7xl">
        {/* Go Back Button WITH left arrow */}
        <Flex
          mb={4}
          alignItems="center"
          cursor="pointer"
          onClick={goBack}
          gap={2}
          color="gray.300"
          _hover={{ textDecoration: "underline" }}
          transition="color 0.2s"
        >
          <ArrowLeft size={18} />
          <Text>Back</Text>
        </Flex>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Main Content */}
          <GridItem>
            {/* Main Image */}
            <Box position="relative" borderRadius="xl" overflow="hidden" mb={4}>
              <Image
                src={`${import.meta.env.VITE_SERVER_URL}${
                  displayImages[selectedImage]?.url
                }`}
                alt={displayImages[selectedImage]?.name || data.title}
                w="100%"
                h="400px"
                objectFit="fill"
                loading="lazy"
              />
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="blackAlpha.500"
                opacity={0}
                _hover={{ opacity: 1 }}
                transition="opacity 0.3s"
                cursor="pointer"
              >
                <PlayIcon size={64} color="white" />
              </Box>
            </Box>
            {/* Slider for Thumbnails */}
            <Box maxW="3xl" mx="auto">
              {displayImages.length > 1 && (
                <Slider {...settings}>
                  {displayImages.map((image, index) => (
                    <Box
                      key={index}
                      borderRadius="lg"
                      overflow="hidden"
                      cursor="pointer"
                      border={selectedImage === index ? "2px solid" : "none"}
                      borderColor="var(--primary-400)"
                      p={1}
                      w="full"
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={`${import.meta.env.VITE_SERVER_URL}${image.url}`}
                        alt={image.name}
                        w="100%"
                        h="80px"
                        objectFit="fill"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="transform 0.3s"
                        loading="lazy"
                      />
                    </Box>
                  ))}
                </Slider>
              )}
            </Box>

            {/* Game Info */}
            <Card.Root mb={8} mt={4} className="gaming-card">
              <CardBody>
                <Text fontSize="3xl" fontWeight="bold" color="white" mb={4}>
                  {data.title}
                </Text>

                <HStack gap={6} mb={6}>
                  <HStack gap={1}>
                    {renderStars(data.rating)}
                    <Text color="gray.400" ml={2}>
                      ({data.rating})
                    </Text>
                  </HStack>
                  <HStack>
                    {data.genres.map((genre: { id: string; title: string }) => (
                      <Badge
                        key={genre.id}
                        colorScheme="purple"
                        color="var(--primary-400)"
                        fontWeight="semibold"
                        px={2}
                        py={1}
                        borderRadius="md"
                        bgColor={"var(--dark-800)"}
                      >
                        {genre.title}
                      </Badge>
                    ))}
                  </HStack>
                </HStack>

                <Grid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                  }}
                  gap={4}
                  mb={6}
                >
                  <HStack gap={2} color="gray.400">
                    <CalendarIcon size={16} />
                    <Text fontSize="sm">{data.releaseDate}</Text>
                  </HStack>
                  <HStack gap={2} color="gray.400">
                    <UserIcon size={16} />
                    <Text fontSize="sm">{data.developer}</Text>
                  </HStack>
                  <HStack gap={2} color="gray.400">
                    <BuildingIcon size={16} />
                    <Text fontSize="sm">{data.platform}</Text>
                  </HStack>
                </Grid>

                {/* Tabs */}
                <Tabs.Root
                  defaultValue="overview"
                  colorPalette="var(--primary-500)"
                  className="gaming-tabs"
                >
                  <Tabs.List>
                    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                    <Tabs.Trigger value="trailer">Trailer</Tabs.Trigger>
                    <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="overview">
                    <Text color="gray.300" fontSize="lg" lineHeight="1.6">
                      {data.description ||
                        "No overview available for this game."}
                    </Text>
                  </Tabs.Content>
                  <Tabs.Content value="trailer">
                    {data.videoTrailer?.url ? (
                      <AspectRatio
                        ratio={16 / 9}
                        maxW="100%"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <video
                          controls
                          src={`${import.meta.env.VITE_SERVER_URL}${
                            data.videoTrailer.url
                          }`}
                          title={data.videoTrailer.name || "Game Trailer"}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </AspectRatio>
                    ) : (
                      <Text color="gray.400">
                        No trailer available for this game.
                      </Text>
                    )}
                  </Tabs.Content>
                  <Tabs.Content value="reviews">
                    <Text color="gray.400">
                      No reviews available for this game.
                    </Text>
                  </Tabs.Content>
                </Tabs.Root>
              </CardBody>
            </Card.Root>

            {/* Related Games */}
            <Card.Root mt={6} className="gaming-card">
              <CardBody>
                <Text fontSize="lg" fontWeight="bold" color="white" mb={4}>
                  Related Games
                </Text>
                {isRelatedLoading ? (
                  <Text>Loading related games...</Text>
                ) : isRelatedError ? (
                  <Text color="red.500">
                    Error:{" "}
                    {relatedError?.message || "Failed to load related games"}
                  </Text>
                ) : relatedGames && relatedGames.length > 0 ? (
                  relatedGames.length > 3 ? (
                    <Slider {...relatedSettings}>
                      {relatedGames.map((game: Game) => (
                        <Box
                          key={game.id}
                          p={1}
                          w="full"
                          onClick={() => navigate(`/game/${game.id}`)}
                          cursor="pointer"
                        >
                          <Image
                            src={`${import.meta.env.VITE_SERVER_URL}${
                              game.thumbnail.url
                            }`}
                            alt={game.title}
                            w="100%"
                            h="120px"
                            objectFit="cover"
                            borderRadius="lg"
                            _hover={{ transform: "scale(1.05)" }}
                            transition="transform 0.3s"
                          />
                          <Box mt={2}>
                            <Text color="white" fontSize="sm">
                              {game.title}
                            </Text>
                            <HStack justifyContent="center" mt={1}>
                              {renderStars(game.rating)}
                              <Text color="gray.400" ml={2}>
                                ({game.rating})
                              </Text>
                            </HStack>
                            <Text
                              color="var(--primary-500)"
                              fontWeight="bold"
                              mt={1}
                            >
                              ${game.price.toFixed(2)}
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </Slider>
                  ) : (
                    <Grid
                      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                      gap={4}
                    >
                      {relatedGames.map((game: Game) => (
                        <Box
                          key={game.id}
                          onClick={() => navigate(`/game/${game.documentId}`)}
                          cursor="pointer"
                          className="gaming-card"
                        >
                          <Image
                            src={`${import.meta.env.VITE_SERVER_URL}${
                              game.thumbnail.url
                            }`}
                            alt={game.title}
                            w="100%"
                            h="120px"
                            objectFit="fill"
                            borderRadius="lg"
                            _hover={{ transform: "scale(1.05)" }}
                            transition="transform 0.3s"
                          />
                          <Box mt={2} p={2}>
                            <Text color="white" fontSize="md" fontWeight="bold">
                              {game.title}
                            </Text>
                            <HStack gap={2} marginTop={2}>
                              {data.discountPercentage > 0 && (
                                <Text
                                  fontSize="md"
                                  fontWeight="semibold"
                                  color="var(--primary-500)"
                                >
                                  $
                                  {(
                                    data.price *
                                    (1 - data.discountPercentage / 100)
                                  ).toFixed(2)}
                                </Text>
                              )}
                              <Text
                                fontSize={
                                  data.discountPercentage > 0 ? "sm" : "2xl"
                                }
                                fontWeight={
                                  data.discountPercentage > 0
                                    ? "normal"
                                    : "bold"
                                }
                                color={
                                  data.discountPercentage > 0
                                    ? "gray.400"
                                    : "white"
                                }
                                textDecoration={
                                  data.discountPercentage > 0
                                    ? "line-through"
                                    : "none"
                                }
                              >
                                ${data.price.toFixed(2)}
                              </Text>
                            </HStack>
                          </Box>
                        </Box>
                      ))}
                    </Grid>
                  )
                ) : (
                  <Text color="gray.400">No related games found.</Text>
                )}
              </CardBody>
            </Card.Root>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <Card.Root position="sticky" top="24px" className="gaming-card">
              <CardBody>
                {/* Price */}
                <VStack gap={6} align="stretch">
                  <Box>
                    {/* Stock Warning */}
                    {data.stock <= 10 && (
                      <Box
                        bg="red.500"
                        p={2}
                        textAlign="center"
                        borderRadius="md"
                        mb={2}
                      >
                        <Text color="white" fontWeight="bold">
                          Limited Stock! Only {data.stock} left!
                        </Text>
                      </Box>
                    )}
                    <Box textAlign="center">
                      <Text color="gray.400" fontSize="sm">
                        Stock: {data.stock} available
                      </Text>
                    </Box>
                  </Box>

                  <Flex justifyContent="space-between" alignItems="center">
                    <HStack gap={2}>
                      {data.discountPercentage > 0 && (
                        <Text
                          fontSize="xl"
                          fontWeight="bold"
                          color="var(--primary-500)"
                        >
                          $
                          {(
                            data.price *
                            (1 - data.discountPercentage / 100)
                          ).toFixed(2)}
                        </Text>
                      )}
                      <Text
                        fontSize={data.discountPercentage > 0 ? "md" : "2xl"}
                        fontWeight={
                          data.discountPercentage > 0 ? "normal" : "bold"
                        }
                        color={
                          data.discountPercentage > 0 ? "gray.400" : "white"
                        }
                        textDecoration={
                          data.discountPercentage > 0 ? "line-through" : "none"
                        }
                      >
                        ${data.price.toFixed(2)}
                      </Text>
                    </HStack>
                    {data.discountPercentage > 0 && (
                      <Badge
                        // position="absolute"
                        // top={3}
                        // left={5}
                        bgGradient="linear(to-r, secondary.500, accent.500)"
                        className="gaming-btn-secondary"
                        px={2}
                        py={1}
                        borderRadius="lg"
                        fontSize="sm"
                        fontWeight="bold"
                        transition="transform 0.3s"
                      >
                        -{data.discountPercentage}%
                      </Badge>
                    )}
                  </Flex>

                  {/* Actions */}
                  <VStack gap={3}>
                    <Button
                      bg={"var(--primary-500)"}
                      _hover={{
                        bg: "var(--primary-600)",
                        transform: "scale(1.05)",
                      }}
                      _active={{ transform: "scale(0.98)" }}
                      transition="all 0.3s"
                      size="lg"
                      w="100%"
                      color="white"
                      fontWeight="bold"
                      onClick={addToCartHandler}
                    >
                      <ShoppingCartIcon size={20} />
                      Add to Cart
                    </Button>
                    <Button
                      bg={"var(--secondary-500)"}
                      _hover={{
                        bg: "var(--secondary-600)",
                        transform: "scale(1.05)",
                      }}
                      _active={{ transform: "scale(0.98)" }}
                      transition="all 0.3s"
                      size="lg"
                      w="100%"
                      color="white"
                      fontWeight="bold"
                    >
                      <DollarSign size={20} />
                      Buy Now
                    </Button>
                  </VStack>

                  {/* Secondary Actions */}
                  <HStack gap={2}>
                    <Button
                      flex={1}
                      bg="var(--dark-800)"
                      _hover={{ bg: "var(--dark-700)", color: "white" }}
                      color="gray.300"
                    >
                      <HeartIcon size={16} />
                      Wishlist
                    </Button>
                    <Button
                      flex={1}
                      bg="var(--dark-800)"
                      _hover={{ bg: "var(--dark-700)", color: "white" }}
                      color="gray.300"
                    >
                      <ShareIcon size={16} />
                      Share
                    </Button>
                  </HStack>

                  {/* Additional Info */}
                  <Box divideY="2px" divideColor="var(--dark-700)">
                    <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
                      Game Details
                    </Text>
                    <VStack gap={3} fontSize="sm" pt={4}>
                      <HStack justifyContent="space-between" w="100%">
                        <Text color="gray.400">Developer:</Text>
                        <Text color="white">{data.developer}</Text>
                      </HStack>
                      <HStack justifyContent="space-between" w="100%">
                        <Text color="gray.400">Platform:</Text>
                        <Text color="white">{data.platform}</Text>
                      </HStack>
                      <HStack justifyContent="space-between" w="100%">
                        <Text color="gray.400">Release Date:</Text>
                        <Text color="white">{data.releaseDate}</Text>
                      </HStack>
                      <HStack justifyContent="space-between" w="100%">
                        <Text color="gray.400">Genre:</Text>
                        {data.genres.map(
                          (genre: { id: string; title: string }) => (
                            <Badge
                              key={genre.id}
                              colorScheme="purple"
                              color="var(--primary-400)"
                              fontWeight="semibold"
                              px={2}
                              py={1}
                              borderRadius="md"
                              bgColor={"var(--dark-800)"}
                            >
                              {genre.title}
                            </Badge>
                          )
                        )}
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card.Root>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default GameDetails;
