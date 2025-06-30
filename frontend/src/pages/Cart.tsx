import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Text,
  Grid,
  GridItem,
  HStack,
  VStack,
  Image,
  Button,
  IconButton,
  Input,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from "lucide-react";
import type { Game } from "../types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { toaster } from "../components/ui/toaster";
import {
  removeFromCart,
  setCartItems,
  updateQuantity,
} from "../app/features/cartSlice";
import CookieService from "../services/CookieService";
import axios from "axios";

interface CartItem {
  id: number;
  documentId: string;
  quantity: number;
  game: Game;
}

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: loginData } = useSelector((state: RootState) => state.login);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  useEffect(() => {
    if (!loginData?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const token = CookieService.get("jwt");
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/cart-items?filters[user][id][$eq]=${
            loginData.user.id
          }&populate[game][populate][thumbnail]=true&populate[game][populate][genres]=true&populate[game][populate][images]=true&populate[game][populate][videoTrailer]=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Cart Items Response:", response.data); // Debug log

        const formattedItems: CartItem[] = response.data.data.map(
          (item: any) => ({
            id: item.id,
            documentId: item.documentId,
            quantity: item.quantity, // Strapi v5: quantity is directly under data
            game: {
              id: item.game?.id || 0,
              documentId: item.game?.documentId || "",
              title: item.game?.title || "Unknown Game",
              price: item.game?.price || 0,
              discountPercentage: item.game?.discountPercentage || 0,
              thumbnail: {
                url:
                  item.game?.thumbnail?.url ||
                  item.game?.thumbnail?.formats?.thumbnail?.url ||
                  "",
                name: item.game?.thumbnail?.name || "thumbnail",
              },
              genres:
                item.game?.genres?.map((g: any) => ({
                  id: g.id || "",
                  title: g.title || "",
                })) || [],
              rating: item.game?.rating || 0,
              platform: item.game?.platform || "",
              developer: item.game?.developer || "",
              releaseDate: item.game?.releaseDate || "",
              stock: item.game?.stock || 0,
              description: item.game?.description || "",
              videoTrailer: item.game?.videoTrailer || null,
              images: item.game?.images || null,
            },
          })
        );

        dispatch(setCartItems(formattedItems));
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching cart items:", error);
        toaster.create({
          title:
            error.response?.data?.error?.message || "Failed to load cart items",
          type: "error",
          duration: 3000,
          closable: true,
        });
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [loginData, dispatch]);

  // Update quantity
  const updateQuantityHandler = async (
    cartItemDocumentId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      const token = CookieService.get("jwt");
      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/cart-items/${cartItemDocumentId}`,
        {
          data: { quantity: newQuantity },
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
          quantity: response.data.data.quantity || newQuantity,
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
  };

  // Remove item
  const removeItem = async (cartItemId: string) => {
    try {
      const token = CookieService.get("jwt");
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/cart-items/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(removeFromCart(cartItemId));
      toaster.create({
        title: "Item removed from cart",
        type: "success",
        duration: 2000,
        closable: true,
      });
    } catch (error: any) {
      console.error("Error removing item:", error);
      toaster.create({
        title: error.response?.data?.error?.message || "Failed to remove item",
        type: "error",
        duration: 3000,
        closable: true,
      });
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.game.discountPercentage > 0
          ? item.game.price * (1 - item.game.discountPercentage / 100)
          : item.game.price),
    0
  );
  const savings = cartItems.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.game.discountPercentage > 0
          ? item.game.price * (item.game.discountPercentage / 100)
          : 0),
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (loading) {
    return (
      <Box minH="100vh" py={16} textAlign="center">
        <Text fontSize="xl" color="white">
          Loading cart...
        </Text>
      </Box>
    );
  }

  if (!loginData?.user?.id) {
    return (
      <Box minH="100vh" py={16}>
        <Container maxW="4xl" textAlign="center">
          <ShoppingBagIcon size={96} color="gray" />
          <Text fontSize="3xl" fontWeight="bold" color="white" mb={4} mt={6}>
            Please log in
          </Text>
          <Text color="gray.400" mb={8}>
            You need to be logged in to view your cart.
          </Text>
          <Link to="/login">
            <Button className="gaming-btn-primary" size="lg" px={8}>
              Log In
            </Button>
          </Link>
        </Container>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box minH="100vh" py={16}>
        <Container
          maxW="4xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <ShoppingBagIcon size={96} color="gray" />
          <Text fontSize="3xl" fontWeight="bold" color="white" mb={4} mt={6}>
            Your cart is empty
          </Text>
          <Text color="gray.400" mb={8}>
            Looks like you haven't added any games to your cart yet.
          </Text>
          <Link to="/games">
            <Button className="gaming-btn-primary" size="lg" px={8}>
              Browse Games
            </Button>
          </Link>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="6xl">
        <Text fontSize="3xl" fontWeight="bold" mb={8}>
          <Text as="span" bgClip="text" className="gaming-title">
            Shopping Cart
          </Text>
        </Text>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem>
            <Card.Root className="gaming-card">
              <CardBody p={0}>
                {cartItems.map((item, index) => (
                  <Box key={item.id}>
                    <Box p={6}>
                      <HStack gap={4} align="start">
                        <Image
                          src={`${import.meta.env.VITE_SERVER_URL}${
                            item.game.thumbnail.url ||
                            item.game.thumbnail.formats?.thumbnail?.url
                          }`}
                          alt={item.game.title}
                          w="80px"
                          h="80px"
                          objectFit="cover"
                          borderRadius="lg"
                        />

                        <VStack flex={1} align="start" gap={2}>
                          <Link to={`/game/${item.game.documentId}`}>
                            <Text
                              fontSize="lg"
                              fontWeight="bold"
                              color="white"
                              _hover={{
                                color: "var(--primary-400)",
                                textDecoration: "none",
                              }}
                            >
                              {item.game.title}
                            </Text>
                          </Link>
                          {item.game.discountPercentage > 0 && (
                            <Badge
                              bg="var(--secondary-500)"
                              color="white"
                              px={2}
                              py={1}
                              borderRadius="md"
                              fontSize="xs"
                              fontWeight="bold"
                            >
                              -{item.game.discountPercentage}%
                            </Badge>
                          )}
                        </VStack>

                        <HStack gap={4}>
                          <HStack gap={2}>
                            <IconButton
                              aria-label="Decrease quantity"
                              size="sm"
                              bg="var(--dark-800)"
                              _hover={{ bg: "var(--dark-700)" }}
                              color="white"
                              onClick={() => {
                                if (item.documentId) {
                                  updateQuantityHandler(
                                    item.documentId,
                                    item.quantity - 1
                                  );
                                }
                              }}
                            >
                              <MinusIcon size={16} />
                            </IconButton>
                            <Text
                              color="white"
                              fontWeight="semibold"
                              minW="32px"
                              textAlign="center"
                            >
                              {item.quantity}
                            </Text>
                            <IconButton
                              aria-label="Increase quantity"
                              size="sm"
                              bg="var(--dark-800)"
                              _hover={{ bg: "var(--dark-700)" }}
                              color="white"
                              onClick={() =>
                                typeof item.documentId === "string" &&
                                updateQuantityHandler(
                                  item.documentId,
                                  item.quantity + 1
                                )
                              }
                            >
                              <PlusIcon size={16} />
                            </IconButton>
                          </HStack>

                          <VStack gap={1} align="end">
                            <Text
                              fontSize="lg"
                              fontWeight="bold"
                              color="var(--primary-400)"
                            >
                              $
                              {(
                                item.game.price *
                                (1 - item.game.discountPercentage / 100)
                              ).toFixed(2)}
                            </Text>
                            {item.game.discountPercentage > 0 && (
                              <Text
                                fontSize="sm"
                                color="gray.400"
                                textDecoration="line-through"
                              >
                                ${item.game.price.toFixed(2)}
                              </Text>
                            )}
                          </VStack>

                          <IconButton
                            aria-label="Remove item"
                            variant="ghost"
                            color="red.400"
                            _hover={{ color: "red.300", bg: "red.900" }}
                            onClick={() =>
                              typeof item.documentId === "string" &&
                              removeItem(String(item.documentId))
                            }
                          >
                            <TrashIcon size={20} />
                          </IconButton>
                        </HStack>
                      </HStack>
                    </Box>
                    {index !== cartItems.length - 1 && (
                      <Box h="1px" bg="gray.800" />
                    )}
                  </Box>
                ))}
              </CardBody>
            </Card.Root>

            <Box mt={6}>
              <Link to="/games">
                <Text
                  color="var(--primary-400)"
                  _hover={{ color: "secondary.400" }}
                  fontWeight="semibold"
                >
                  ← Continue Shopping
                </Text>
              </Link>
            </Box>
          </GridItem>

          <GridItem>
            <Card.Root position="sticky" top="24px" className="gaming-card">
              <CardBody>
                <Text fontSize="xl" fontWeight="bold" color="white" mb={6}>
                  Order Summary
                </Text>

                <VStack gap={4} mb={6}>
                  <HStack justifyContent="space-between" w="100%">
                    <Text color="gray.300">
                      Subtotal ({cartItems.length} items)
                    </Text>
                    <Text color="gray.300">${subtotal.toFixed(2)}</Text>
                  </HStack>

                  {savings > 0 && (
                    <HStack justifyContent="space-between" w="100%">
                      <Text color="green.400">You Save</Text>
                      <Text color="green.400">-${savings.toFixed(2)}</Text>
                    </HStack>
                  )}

                  <HStack justifyContent="space-between" w="100%">
                    <Text color="gray.300">Tax</Text>
                    <Text color="gray.300">${tax.toFixed(2)}</Text>
                  </HStack>

                  <HStack
                    justifyContent="space-between"
                    w="100%"
                    borderTop={"1px solid var(--dark-800)"}
                    pt={2}
                  >
                    <Text fontSize="xl" fontWeight="bold" color="white">
                      Total
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="white">
                      ${total.toFixed(2)}
                    </Text>
                  </HStack>
                </VStack>

                <Button
                  className="gaming-btn-primary"
                  size="lg"
                  w="100%"
                  mb={4}
                >
                  Proceed to Checkout
                </Button>

                <Text textAlign="center" fontSize="xs" color="gray.400" mb={6}>
                  Secure checkout powered by industry-leading encryption
                </Text>

                <Box divideY={"1px"} divideColor={"var(--dark-700)"}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="white"
                    mb={3}
                  >
                    Have a promo code?
                  </Text>
                  <HStack gap={2}>
                    <Input
                      placeholder="Enter code"
                      bg="var(--dark-800)"
                      border="1px solid"
                      borderColor="var(--dark-700)"
                      color="white"
                      fontSize="sm"
                      _focus={{ borderColor: "var(--primary-400)" }}
                      flex={1}
                    />
                    <Button
                      bg="var(--dark-800)"
                      _hover={{ bg: "var(--dark-700)" }}
                      color="var(--primary-400)"
                      fontSize="sm"
                      fontWeight="semibold"
                    >
                      Apply
                    </Button>
                  </HStack>
                </Box>
              </CardBody>
            </Card.Root>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Cart;
