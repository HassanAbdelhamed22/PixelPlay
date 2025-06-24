import {
  Button,
  Checkbox,
  Flex,
  Text,
  Heading,
  Input,
  Stack,
  Image,
  Box,
  Field,
} from "@chakra-ui/react";
import { PasswordInput } from "../components/ui/password-input";
import { useState } from "react";

export default function LoginPage() {
  const [value, setValue] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <form onSubmit={submitHandler}>
      <Stack
        minH={"90vh"}
        direction={{ base: "column", md: "row" }}
        maxWidth={"7xl"}
        mx="auto"
      >
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack gap={4} w={"full"} maxW={"lg"}>
            <Heading fontSize={"2xl"} className="gaming-title">
              Sign in to your account
            </Heading>
            <Box>
              <Field.Root invalid={!user.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  id="email"
                  focusRingColor={"var(--primary-500)"}
                  required
                  placeholder="example@domain.com"
                  value={user.email}
                  onChange={onChangeHandler}
                  name="email"
                />
                <Field.ErrorText>This field is required</Field.ErrorText>
              </Field.Root>
            </Box>
            <Field.Root invalid={!user.password}>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                value={user.password}
                onChange={onChangeHandler}
                name="password"
                focusRingColor={"var(--primary-500)"}
                required
                placeholder="Password"
              />
              <Field.ErrorText>This field is required</Field.ErrorText>
            </Field.Root>
            <Stack gap={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox.Root>
                  <Checkbox.Label>Remember me</Checkbox.Label>
                  <Checkbox.HiddenInput color="var(--primary-500)" />
                  <Checkbox.Control />
                </Checkbox.Root>
                <Text
                  color={"var(--primary-500)"}
                  _hover={{
                    color: "var(--primary-600)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    transition: "all 0.3s ease",
                  }}
                >
                  Forgot password?
                </Text>
              </Stack>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                className="gaming-btn-primary"
                type="submit"
                disabled={!user.email || !user.password}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex
          flex={1}
          display={{ base: "none", md: "flex" }}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 0 40px rgba(34, 211, 238, 0.2)"
          position="relative"
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
          w={"100%"}
          my={"auto"}
        >
          <Image
            alt="Gaming Setup"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=compress&cs=tinysrgb&w=800"
            w="100%"
            h="100%"
            filter="brightness(0.8)"
          />
        </Flex>
      </Stack>
    </form>
  );
}
