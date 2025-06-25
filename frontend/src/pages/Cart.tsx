import React from "react";
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

const Cart: React.FC = () => {
  // Mock cart data
  const cartItems = [
    {
      id: 1,
      title: "Cyber Nexus 2077",
      price: 59.99,
      originalPrice: 79.99,
      image:
        "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=200",
      quantity: 1,
      discount: 25,
    },
    {
      id: 2,
      title: "Neon Racing Elite",
      price: 39.99,
      originalPrice: 49.99,
      image:
        "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=200",
      quantity: 1,
      discount: 20,
    },
    {
      id: 3,
      title: "Space Odyssey VR",
      price: 49.99,
      originalPrice: 69.99,
      image:
        "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=200",
      quantity: 1,
      discount: 30,
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const savings = cartItems.reduce(
    (sum, item) =>
      sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <Box minH="100vh" py={16}>
        <Container maxW="4xl" textAlign="center">
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
          {/* Cart Items */}
          <GridItem>
            <Card.Root className="gaming-card">
              <CardBody p={0}>
                {cartItems.map((item, index) => (
                  <Box key={item.id}>
                    <Box p={6}>
                      <HStack gap={4} align="start">
                        <Image
                          src={item.image}
                          alt={item.title}
                          w="80px"
                          h="80px"
                          objectFit="cover"
                          borderRadius="lg"
                        />

                        <VStack flex={1} align="start" gap={2}>
                          <Link to={`/game/${item.id}`}>
                            <Text
                              fontSize="lg"
                              fontWeight="bold"
                              color="white"
                              _hover={{
                                color: "var(--primary-400)",
                                textDecoration: "none",
                              }}
                            >
                              {item.title}
                            </Text>
                          </Link>
                          {item.discount > 0 && (
                            <Badge
                              bg="var(--secondary-500)"
                              color="white"
                              px={2}
                              py={1}
                              borderRadius="md"
                              fontSize="xs"
                              fontWeight="bold"
                            >
                              -{item.discount}%
                            </Badge>
                          )}
                        </VStack>

                        <HStack gap={4}>
                          {/* Quantity Controls */}
                          <HStack gap={2}>
                            <IconButton
                              aria-label="Decrease quantity"
                              size="sm"
                              bg="var(--dark-800)"
                              _hover={{ bg: "var(--dark-700)" }}
                              color="white"
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
                            >
                              <PlusIcon size={16} />
                            </IconButton>
                          </HStack>

                          {/* Price */}
                          <VStack gap={1} align="end">
                            <Text
                              fontSize="lg"
                              fontWeight="bold"
                              color="var(--primary-400)"
                            >
                              ${item.price}
                            </Text>
                            {item.originalPrice && (
                              <Text
                                fontSize="sm"
                                color="gray.400"
                                textDecoration="line-through"
                              >
                                ${item.originalPrice}
                              </Text>
                            )}
                          </VStack>

                          {/* Remove Button */}
                          <IconButton
                            aria-label="Remove item"
                            variant="ghost"
                            color="red.400"
                            _hover={{ color: "red.300", bg: "red.900" }}
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

            {/* Continue Shopping */}
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

          {/* Order Summary */}
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

                {/* Promo Code */}
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
