import { HStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { NavButton } from './NavButton';

export const Navigation = () => {

  return (
    <HStack background={"blue.100"} spacing={5} padding={5}>
      <Link to="/">
        <NavButton text={"Home"} />
      </Link>
    </HStack>
  );
};
