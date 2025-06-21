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

  return (
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
          src={game.thumbnail.url}
          alt={game.thumbnail.name}
          h={heights[size]}
          w="100%"
          objectFit="cover"
          _hover={{ transform: "scale(1.1)" }}
          transition="transform 0.3s"
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
          {game.genres.map((genre) => genre.name).join(", ")}
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
            <Text fontSize="xl" fontWeight="bold" color="var(--primary-500)">
              ${game.price.toFixed(2)}
            </Text>
            {game.discountPercentage > 0 && (
              <Text
                color="gray.400"
                textDecoration="line-through"
                fontSize="sm"
              >
                ${(game.price * (1 + game.discountPercentage / 100)).toFixed(2)}
              </Text>
            )}
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
  );
};

export default GameCard;
