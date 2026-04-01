import { Card, Text, Group, Avatar, Button, ActionIcon, Stack, Menu, rem } from '@mantine/core';
import { IconHeart, IconMessageCircle, IconShare, IconDots } from '@tabler/icons-react';
import { useState } from 'react';

export default function PostCard({ author, timestamp, content, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group>
            <Avatar color="blue" radius="xl">{author[0]}</Avatar>
            <div>
              <Text fw={500} size="sm">{author}</Text>
              <Text size="xs" c="dimmed">{timestamp}</Text>
            </div>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item color="red">Report Post</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Text size="sm" py="md">
        {content}
      </Text>

      <Card.Section inheritPadding py="xs">
        <Group mt="sm">
          <Button 
            variant={isLiked ? "filled" : "light"} 
            color={isLiked ? "red" : "blue"}
            leftSection={<IconHeart size="1rem" />}
            onClick={handleLike}
            radius="xl"
            size="compact-sm"
          >
            {likes} Likes
          </Button>
          
          <ActionIcon variant="subtle" color="gray" radius="xl">
            <IconMessageCircle size="1.2rem" />
          </ActionIcon>
          
          <ActionIcon variant="subtle" color="gray" radius="xl">
            <IconShare size="1.2rem" />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
}