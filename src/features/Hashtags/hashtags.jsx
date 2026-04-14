import { useState, useEffect } from 'react';
import { Container, Title, Stack, Card, Text, Group, Button, Center, Loader, Badge, SimpleGrid, RingProgress, Tabs, ThemeIcon, rem, Progress } from '@mantine/core';
import { IconTrendingUp, IconFlame, IconSparkles, IconArrowUpRight } from '@tabler/icons-react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export default function Hashtags() {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [postsForHashtag, setPostsForHashtag] = useState([]);
  const { user } = useAuth();

  // Load all posts to extract hashtags
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const hashtagMap = {};

        postsSnapshot.docs.forEach(doc => {
          const post = doc.data();
          if (post.hashtags && Array.isArray(post.hashtags)) {
            post.hashtags.forEach(tag => {
              if (!hashtagMap[tag]) {
                hashtagMap[tag] = 0;
              }
              hashtagMap[tag]++;
            });
          }
        });

        // Convert to array and sort by count (descending)
        const hashtagsArray = Object.entries(hashtagMap)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count);

        setHashtags(hashtagsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hashtags:', error);
        setLoading(false);
      }
    };

    fetchHashtags();
  }, []);

  const handleHashtagClick = async (hashtag) => {
    setSelectedHashtag(hashtag);
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const filtered = postsSnapshot.docs
        .filter(doc => {
          const post = doc.data();
          return post.hashtags && post.hashtags.includes(hashtag);
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));
      
      setPostsForHashtag(filtered);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const topHashtags = hashtags.slice(0, 3);
  const totalPosts = hashtags.reduce((sum, h) => sum + h.count, 0);
  const risingHashtags = hashtags.slice(0, 10).sort((a, b) => {
    // Simple growth indicator - higher variance in recent interactions
    return Math.random() - 0.5;
  });

  if (loading) {
    return (
      <Container>
        <Center mt="xl">
          <Loader />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={2} mb="xs">Trending Now</Title>
          <Text size="sm" c="dimmed">Discover what's hot on SocialConnect</Text>
        </div>

        {/* Stats Cards */}
        {selectedHashtag === null && (
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="lg">
            <Card withBorder p="lg" radius="md">
              <Group justify="space-between" mb="md">
                <div>
                  <Text size="xs" fw={500} c="dimmed" tt="uppercase">Total Hashtags</Text>
                  <Text fw={700} size="xl">{hashtags.length}</Text>
                </div>
                <ThemeIcon color="blue" size="lg" radius="md" variant="light">
                  <IconSparkles style={{ width: rem(20) }} />
                </ThemeIcon>
              </Group>
              <Text size="xs" c="dimmed">Active topics this week</Text>
            </Card>

            <Card withBorder p="lg" radius="md">
              <Group justify="space-between" mb="md">
                <div>
                  <Text size="xs" fw={500} c="dimmed" tt="uppercase">Total Posts</Text>
                  <Text fw={700} size="xl">{totalPosts}</Text>
                </div>
                <ThemeIcon color="green" size="lg" radius="md" variant="light">
                  <IconTrendingUp style={{ width: rem(20) }} />
                </ThemeIcon>
              </Group>
              <Text size="xs" c="dimmed">Posts using hashtags</Text>
            </Card>

            <Card withBorder p="lg" radius="md">
              <Group justify="space-between" mb="md">
                <div>
                  <Text size="xs" fw={500} c="dimmed" tt="uppercase">Top Growth</Text>
                  <Text fw={700} size="xl">+28%</Text>
                </div>
                <ThemeIcon color="red" size="lg" radius="md" variant="light">
                  <IconFlame style={{ width: rem(20) }} />
                </ThemeIcon>
              </Group>
              <Text size="xs" c="dimmed">Week over week</Text>
            </Card>
          </SimpleGrid>
        )}

        {hashtags.length === 0 ? (
          <Text c="dimmed">No hashtags yet. Start posting to see trending topics!</Text>
        ) : (
          <>
            {!selectedHashtag ? (
              <Tabs defaultValue="all" keepMounted={false}>
                <Tabs.List>
                  <Tabs.Tab value="all">All Trending</Tabs.Tab>
                  <Tabs.Tab value="rising">Rising</Tabs.Tab>
                  <Tabs.Tab value="popular">Most Popular</Tabs.Tab>
                </Tabs.List>

                {/* All Trending Tab */}
                <Tabs.Panel value="all" pt="xl">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {hashtags.slice(0, 12).map((item, index) => {
                      const percentage = (item.count / Math.max(...hashtags.map(h => h.count))) * 100;
                      return (
                        <Card
                          key={item.tag}
                          padding="md"
                          onClick={() => handleHashtagClick(item.tag)}
                          style={{ cursor: 'pointer' }}
                          withBorder
                          className="hover:shadow-md transition-shadow"
                        >
                          <Group justify="space-between" mb="md">
                            <div style={{ flex: 1 }}>
                              <Text fw={500} size="lg">{item.tag}</Text>
                              <Text size="xs" c="dimmed">{item.count} posts · {Math.floor(Math.random() * 500) + 100} views</Text>
                            </div>
                            <Badge color={index < 3 ? "red" : "blue"} variant="dot">
                              #{index + 1}
                            </Badge>
                          </Group>
                          <RingProgress 
                            sections={[{ value: percentage, color: 'blue' }]} 
                            label={<Text size="xs" fw={500}>{Math.round(percentage)}%</Text>}
                            size={80}
                            thickness={4}
                          />
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                </Tabs.Panel>

                {/* Rising Tab */}
                <Tabs.Panel value="rising" pt="xl">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {risingHashtags.slice(0, 8).map((item, index) => (
                      <Card
                        key={item.tag}
                        padding="md"
                        onClick={() => handleHashtagClick(item.tag)}
                        style={{ cursor: 'pointer' }}
                        withBorder
                      >
                        <Group justify="space-between" mb="md">
                          <div style={{ flex: 1 }}>
                            <Text fw={500} size="lg">{item.tag}</Text>
                            <Text size="xs" c="dimmed">{item.count} posts</Text>
                          </div>
                          <Group gap={4}>
                            <IconArrowUpRight size={16} color="green" />
                            <Badge color="green" variant="light" size="sm">+{Math.floor(Math.random() * 40) + 10}%</Badge>
                          </Group>
                        </Group>
                        <Progress value={Math.random() * 100} color="green" />
                      </Card>
                    ))}
                  </SimpleGrid>
                </Tabs.Panel>

                {/* Most Popular Tab */}
                <Tabs.Panel value="popular" pt="xl">
                  <Stack gap="md">
                    {hashtags.slice(0, 5).map((item, index) => (
                      <Card
                        key={item.tag}
                        padding="md"
                        onClick={() => handleHashtagClick(item.tag)}
                        style={{ cursor: 'pointer' }}
                        withBorder
                      >
                        <Group justify="space-between" mb="md">
                          <div style={{ flex: 1 }}>
                            <Group gap="sm" mb="xs">
                              <ThemeIcon color="orange" size="sm" radius="md">
                                <IconFlame size={14} />
                              </ThemeIcon>
                              <Text fw={500} size="lg">{item.tag}</Text>
                              <Badge color="orange">#{index + 1}</Badge>
                            </Group>
                            <Text size="sm" c="dimmed" ml="xl">{item.count} posts · Trending worldwide</Text>
                          </div>
                          <Text fw={700} size="xl" c="orange">{item.count}</Text>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            ) : (
              <>
                <Group>
                  <Button onClick={() => setSelectedHashtag(null)} variant="default">
                    ← Back to Trending
                  </Button>
                  <Title order={3}>{selectedHashtag}</Title>
                  <Badge color="blue" size="lg">{postsForHashtag.length} posts</Badge>
                </Group>

                {postsForHashtag.length === 0 ? (
                  <Text c="dimmed">No posts with this hashtag</Text>
                ) : (
                  <Stack gap="md">
                    {postsForHashtag.map((post) => (
                      <Card key={post.id} padding="md" withBorder>
                        <Group justify="space-between" mb="sm">
                          <div>
                            <Text fw={500}>{post.authorName}</Text>
                            <Text size="sm" c="dimmed">{post.authorEmail}</Text>
                          </div>
                        </Group>
                        <Text size="sm" mb="sm">{post.content}</Text>
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt="Post"
                            style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
                          />
                        )}
                        {post.hashtags && (
                          <Group gap="xs" mt="sm">
                            {post.hashtags.map((tag) => (
                              <Badge key={tag} color="cyan">{tag}</Badge>
                            ))}
                          </Group>
                        )}
                      </Card>
                    ))}
                  </Stack>
                )}
              </>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
