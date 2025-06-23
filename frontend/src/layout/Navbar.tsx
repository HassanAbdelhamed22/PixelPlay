import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  IconButton,
  Badge,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
  DrawerBackdrop,
  DrawerPositioner,
  CloseButton,
  Container,
  Portal,
} from "@chakra-ui/react";
import {
  GamepadIcon,
  ShoppingCartIcon,
  UserIcon,
  SearchIcon,
  MenuIcon,
  HomeIcon,
  TagIcon,
  TrophyIcon,
  HeadphonesIcon,
} from "lucide-react";

const Navbar = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const navigation = [
    { name: "Home", to: "/", icon: HomeIcon },
    { name: "Games", to: "/games", icon: GamepadIcon },
    { name: "Categories", to: "/categories", icon: TagIcon },
    { name: "Deals", to: "/deals", icon: TrophyIcon },
    { name: "Support", to: "/support", icon: HeadphonesIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box bg="var(--dark-950)" color="white">
      {/* Navigation */}
      <Box
        position="sticky"
        top={0}
        zIndex={50}
        borderBottom="1px solid"
        borderColor="var(--dark-800)"
        bg="var(--dark-950)"
        backdropFilter="blur(10px)"
      >
        <Container maxW="8xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <HStack gap={2}>
                <GamepadIcon size={32} color="#22d3ee" />
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  bgClip="text"
                  className="gaming-title gaming-font"
                >
                  PixelPlay
                </Text>
              </HStack>
            </Link>

            {/* Desktop Navigation */}
            <HStack gap={8} display={{ base: "none", md: "flex" }}>
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const isLinkActive = isActive(item.to);
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`nav-link ${isLinkActive ? "active" : ""}`}
                  >
                    <HStack gap={1}>
                      <IconComponent size={16} />
                      <Text>{item.name}</Text>
                    </HStack>
                  </Link>
                );
              })}
            </HStack>

            {/* Search and Actions */}
            <HStack gap={4} display={{ base: "none", md: "flex" }}>
              <InputGroup
                maxW="200px"
                startElement={<SearchIcon size={16} color="gray" />}
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
                  size="sm"
                />
              </InputGroup>
              <Box position="relative">
                <Link to="/cart">
                  <IconButton
                    aria-label="Cart"
                    variant="ghost"
                    color="gray.300"
                    _hover={{ color: "var(--primary-400)" }}
                  >
                    <ShoppingCartIcon size={20} />
                  </IconButton>
                </Link>
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="var(--secondary-500)"
                  color="white"
                  borderRadius="full"
                  fontSize="xs"
                  minW="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  3
                </Badge>
              </Box>
              <Link to="/profile">
                <IconButton
                  aria-label="Profile"
                  variant="ghost"
                  color="gray.300"
                  _hover={{ color: "var(--primary-400)" }}
                >
                  <UserIcon size={20} />
                </IconButton>
              </Link>
            </HStack>

            {/* Mobile menu button */}
            <IconButton
              aria-label="Menu"
              variant="ghost"
              color="gray.300"
              _hover={{ color: "var(--primary-400)" }}
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
            >
              <MenuIcon size={20} />
            </IconButton>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer.Root
        open={open}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        placement="end"
      >
        <Portal>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent bg="var(--dark-900)">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </DrawerHeader>
              <DrawerBody>
                <VStack gap={4} align="stretch">
                  {navigation.map((item) => {
                    const IconComponent = item.icon;
                    const isLinkActive = isActive(item.to);
                    return (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={`nav-link ${isLinkActive ? "active" : ""}`}
                        onClick={onClose}
                      >
                        <HStack gap={2}>
                          <IconComponent size={20} />
                          <Text>{item.name}</Text>
                        </HStack>
                      </Link>
                    );
                  })}
                  <InputGroup
                    startElement={<SearchIcon size={16} color="gray" />}
                    maxW="100%"
                  >
                    <Input
                      pointerEvents="auto"
                      placeholder="Search games..."
                      bg="var(--dark-800)"
                      border="1px solid"
                      borderColor="var(--dark-700)"
                    />
                  </InputGroup>
                  <HStack gap={4}>
                    <Link
                      to="/cart"
                      onClick={onClose}
                      style={{
                        color: "gray.300",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--primary-400)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "gray.300")
                      }
                    >
                      <HStack>
                        <ShoppingCartIcon size={20} />
                        <Text>Cart (3)</Text>
                      </HStack>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={onClose}
                      style={{
                        color: "gray.300",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--primary-400)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "gray.300")
                      }
                    >
                      <HStack>
                        <UserIcon size={20} />
                        <Text>Profile</Text>
                      </HStack>
                    </Link>
                  </HStack>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default Navbar;
