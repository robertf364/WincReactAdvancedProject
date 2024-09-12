import { Card, Image, CardBody, Heading, Text } from "@chakra-ui/react";
import { EventCategories } from "./EventCategories";
import { EventDate } from "./EventDate";

export const EventCard = ({ event, placeholder, categories }) => {
  return (
    <Card
      direction={{
        base: "column",
        sm: "row",
      }}
      overflow="hidden"
      variant="outline"
    >
      <Image
        objectFit="cover"
        maxW={{
          base: "100%",
          sm: "200px",
        }}
        src={event.image ? event.image : placeholder}
        alt={event.title}
      />
      <CardBody>
        <Heading size={"md"}>{event.title}</Heading>
        <Text>{event.description}</Text>
        <EventDate event={event} />
        <EventCategories event={event} categories={categories} />
      </CardBody>
    </Card>
  );
};
