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
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { addToCart, updateQuantity } from "../app/features/cartSlice";
import { toaster } from "./ui/toaster";
import CookieService from "../services/CookieService";
import axios from "axios";

interface GameCardProps {
  game: Game;
  size?: "small" | "medium" | "large";
}

const GameCard: React.FC<GameCardProps> = ({ game, size = "medium" }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: loginData } = useSelector((state: RootState) => state.login);
  const { cartItems } = useSelector((state: RootState) => state.cart);
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

    const token = CookieService.get("jwt");
    if (!token) {
      toaster.create({
        title: "Session expired, please log in again",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    // Check if game is already in cart
    const existingItem = cartItems.find((item) => item.game.id === game.id);
    if (existingItem) {
      toaster.create({
        title: `${game.title} is already in your cart`,
        type: "info",
        duration: 3000,
        closable: true,
      });
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/cart-items/${
            existingItem.documentId
          }`,
          {
            data: { quantity: existingItem.quantity + 1 },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(
          updateQuantity({
            documentId: response.data.data.documentId,
            quantity: response.data.data.quantity || existingItem.quantity + 1,
          })
        );
        toaster.create({
          title: "Quantity updated",
          type: "success",
          duration: 2000,
          closable: true,
        });
      } catch (error: any) {
        console.error("Error updating quantity:", error);
        toaster.create({
          title:
            error.response?.data?.error?.message || "Failed to update quantity",
          type: "error",
          duration: 3000,
          closable: true,
        });
      }
    }

    try {
      if (!existingItem) {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/cart-items`,
          {
            data: {
              quantity: 1,
              game: game.id,
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

        if (!response.data?.data) {
          throw new Error("Unexpected API response structure");
        }

        const cartItem = {
          id: response.data.data.id,
          documentId: response.data.data.documentId,
          quantity: response.data.data.quantity || 1,
          game,
        };

        dispatch(addToCart(cartItem));
        toaster.create({
          title: `${game.title} added to cart successfully`,
          type: "success",
          duration: 3000,
          closable: true,
        });
      }
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
              onClick={addToCartHandler}
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
