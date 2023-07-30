import { memo } from 'react'
import { Link } from 'react-router-dom'
import { AspectRatio, Box, Image, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import placeholderImage from '../../../../assets/images/placeholder.webp'

export interface CardProps {
  href: string
  imageUrl: string
  name: string
  author: string
  alt: string
  fallbackImage?: string
}

const Card = memo(({ href, imageUrl, name, author, alt, fallbackImage = placeholderImage }: CardProps) => {
  return (
    <Box as={Link} to={href} margin={5} flexDir="column" alignItems="center">
      <AspectRatio ratio={2 / 3}>
        <Image
          objectFit="cover"
          src={imageUrl}
          fallbackSrc={fallbackImage}
          alt={alt}
          borderRadius="lg"
          as={motion.img}
          whileHover={{
            y: -10,
            filter: 'brightness(70%)',
          }}
          whileTap={{
            scale: 1.1,
          }}
        />
      </AspectRatio>
      <Box p={3} textAlign="center" textTransform="capitalize">
        <Text fontWeight="bold" noOfLines={2}>
          {name}
        </Text>
        <Text color="GrayText" noOfLines={2}>
          {author}
        </Text>
      </Box>
    </Box>
  )
})

export default Card
