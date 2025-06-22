import React from "react";
import {
  Box,
  Image,
  Text,
  HStack,
  Badge,
  Button,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { StarIcon, ShoppingCartIcon } from "lucide-react";
import type { Game } from "../types";
import { Link } from "react-router-dom";

interface GameCardProps {
  game: Game;
  size?: "small" | "medium" | "large";
}

const GameCard: React.FC<GameCardProps> = ({ game, size = "medium" }) => {
  const heights = {
    small: "128px",
    medium: "192px",
    large: "256px",
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        size={16}
        color={i < Math.floor(rating) ? "#fbbf24" : "#64748b"}
        fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
      />
    ));
  };

  console.log("GameCard props:", game);

  return (
    <Link to={`/game/${game.documentId}`} style={{ textDecoration: "none" }}>
      <Card.Root
        cursor="pointer"
        borderRadius="xl"
        overflow="hidden"
        _hover={{
          transform: "scale(1.05)",
          boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
        }}
        transition="all 0.3s"
        className="gaming-card"
      >
        <Box position="relative">
          <Image
            src={`${import.meta.env.VITE_SERVER_URL}${game?.thumbnail?.url}`}
            alt={game.thumbnail.name}
            h={heights[size]}
            w="100%"
            objectFit=""
            _hover={{ transform: "scale(1.1)" }}
            transition="transform 0.3s"
            loading="lazy"
          />
          {game.discountPercentage > 0 && (
            <Badge
              position="absolute"
              top={2}
              left={2}
              bgGradient="linear(to-r, secondary.500, accent.500)"
              className="gaming-btn-secondary"
              px={2}
              py={1}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="bold"
              transition="transform 0.3s"
            >
              -{game.discountPercentage}%
            </Badge>
          )}
          <Badge
            position="absolute"
            top={2}
            right={2}
            bg="blackAlpha.800"
            color="white"
            px={2}
            py={1}
            borderRadius="lg"
            fontSize="xs"
            backdropFilter="blur(4px)"
          >
            {game.genres.length > 0
              ? game.genres.map((genre) => genre.title).join(", ")
              : "No Genres"}
          </Badge>
        </Box>

        <CardBody>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="white"
            mb={2}
            _hover={{ color: "var(--primary-400)" }}
            transition="colors 0.2s"
            truncate
          >
            {game.title}
          </Text>

          <HStack mb={3} gap={1}>
            {renderStars(game.rating)}
            <Text color="gray.400" fontSize="sm" ml={2}>
              ({game.rating.toFixed(1)} / 5)
            </Text>
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <HStack gap={2}>
              {game.discountPercentage > 0 && (
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="var(--primary-500)"
                >
                  $
                  {(game.price * (1 - game.discountPercentage / 100)).toFixed(
                    2
                  )}
                </Text>
              )}
              <Text
                fontSize={game.discountPercentage > 0 ? "md" : "xl"}
                fontWeight={game.discountPercentage > 0 ? "normal" : "bold"}
                color={
                  game.discountPercentage > 0
                    ? "gray.400"
                    : "var(--primary-500)"
                }
                textDecoration={
                  game.discountPercentage > 0 ? "line-through" : "none"
                }
              >
                ${game.price.toFixed(2)}
              </Text>
            </HStack>
            <Button
              size="sm"
              _hover={{ transform: "scale(1.05)" }}
              display="flex"
              alignItems="center"
              gap={2}
              className="gaming-btn-secondary"
            >
              <ShoppingCartIcon size={16} />
              Add
            </Button>
          </HStack>
        </CardBody>
      </Card.Root>
    </Link>
  );
};

export default GameCard;
