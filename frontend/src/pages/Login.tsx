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
import { useDispatch, useSelector } from "react-redux";
import { selectLogin, userLogin } from "../app/features/loginSlice";
import type { AppDispatch } from "../app/store";
import { useForm } from "react-hook-form";

interface FormValues {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(selectLogin);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(userLogin(data));
  });

  return (
    <form onSubmit={onSubmit}>
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
              <Field.Root invalid={!!errors.identifier}>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  id="identifier"
                  focusRingColor={"var(--primary-500)"}
                  required
                  placeholder="example@domain.com"
                  {...register("identifier", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                <Field.ErrorText>{errors.identifier?.message}</Field.ErrorText>
              </Field.Root>
            </Box>
            <Field.Root invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                id="password"
                {...register("password", {
                  required: "Password is required",
                })}
                focusRingColor={"var(--primary-500)"}
                placeholder="Password"
              />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
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
                disabled={!!errors.identifier || !!errors.password}
                loading={loading}
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
