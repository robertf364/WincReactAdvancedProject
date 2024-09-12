import { Text } from "@chakra-ui/react";

export const EventDate = ({ event }) => {
  const getDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { timeStyle: "short" });
  };

  return (
    <>
      <Text>{getDate(event.startTime)}</Text>
      <Text>
        From {getTime(event.startTime)} - {getTime(event.endTime)}
      </Text>
    </>
  );
};
