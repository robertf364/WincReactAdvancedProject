import { Card, Image, CardBody, Text, Heading, Stack } from "@chakra-ui/react";
import React from "react";

export const UserCard = ({ user }) => {
  return (
    <Card
      margin={5}
      direction={{
        base: "column",
        sm: "row",
      }}
      maxW={"100%"}
      overflow="hidden"
      variant="outline"
    >
      <Image
        objectFit="cover"
        maxW={{
          base: "100%",
          sm: "200px",
        }}
        src={user.image}
        alt={user.name}
      />

      <Stack>
        <CardBody>
          <Text>Created by</Text>
          <Heading size="md">{user.name}</Heading>
        </CardBody>
      </Stack>
    </Card>
  );
};
