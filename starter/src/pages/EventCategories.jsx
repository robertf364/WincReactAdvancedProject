import { Tag } from "@chakra-ui/react";

export const EventCategories = ({ event, categories }) => {
  // Function to get categories for a given event
  const getCategoriesForEvent = (event) => {
    return categories.filter((cat) => event.categoryIds.includes(cat.id));
  };

  return (
    <>
      {getCategoriesForEvent(event).map((cat) => (
        <Tag marginRight={2} marginTop={2} key={cat.id}>
          {cat.name}
        </Tag>
      ))}
    </>
  );
};
