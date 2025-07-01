"use client";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  Portal,
} from "@chakra-ui/react";
import type { FlexProps, BoxProps } from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import CookieService from "../../services/CookieService";
import { GamepadIcon, LogOutIcon, UserIcon } from "lucide-react";

interface LinkItemProps {
  name: string;
  icon: IconType;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Trending", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

const isActive = (path: string) => location.pathname === path;

const handleLogout = () => {
  CookieService.remove("jwt");
  window.location.reload();
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={"gray.900"}
      borderRight="1px"
      borderRightColor={"gray.700"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
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
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link to="#" style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={"gray.900"}
      borderBottomWidth="1px"
      borderBottomColor={"gray.700"}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      >
        <FiMenu />
      </IconButton>

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

      <HStack gap={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu.Root>
            <Menu.Trigger
              asChild
              className={`nav-link-icon ${
                isActive("/profile") ? "active" : ""
              }`}
            >
              <HStack cursor={"pointer"}>
                <UserIcon size={20} />
              </HStack>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content bg={"var(--dark-950)"}>
                  <Link to="/profile">
                    <Menu.Item value="profile" cursor={"pointer"}>
                      <UserIcon size={15} />
                      Profile
                    </Menu.Item>
                  </Link>
                  <Menu.Item
                    value="logout"
                    color="fg.error"
                    _hover={{ bg: "bg.error", color: "fg.error" }}
                    cursor={"pointer"}
                    onClick={handleLogout}
                  >
                    <LogOutIcon size={15} />
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={"gray.900"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer.Root
        open={open}
        // placement="left"
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        // returnFocusOnClose={false}
        // onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer.Root>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
