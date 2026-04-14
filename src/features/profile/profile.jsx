import { useState, useEffect } from 'react';
import {
  Container, Title, Paper, Stack, TextInput, Select,
  NumberInput, Button, Avatar, Group, Text, Divider, FileInput
} from '@mantine/core';
import { IconUpload, IconUserCircle } from '@tabler/icons-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../hooks/useNotification';

export default function Profile() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    age: '',
    gender: '',
    country: '',
    bio: '',
  });

  // Load existing profile data from Firestore
  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm((prev) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        showError('Error', 'Could not load profile data.');
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user) {
      showError('Authentication Required', 'Please log in to save your profile.');
      return;
    }
    setLoading(true);
    try {
      console.log('Saving profile...', { user: user.uid, form, avatar });
      let photoURL = user.photoURL || '';

      // Upload avatar if a new one was selected
      if (avatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        console.log('Uploading avatar...');
        const snapshot = await uploadBytes(avatarRef, avatar);
        photoURL = await getDownloadURL(snapshot.ref);
        console.log('Avatar uploaded:', photoURL);
      }

      const profileData = {
        ...form,
        email: user.email,
        photoURL,
        updatedAt: new Date().toISOString(),
      };
      console.log('Profile data to save:', profileData);

      // Save profile data to Firestore
      await setDoc(doc(db, 'users', user.uid), profileData);
      console.log('Profile saved to Firestore');

      // Update Firebase Auth display name and photo
      await updateProfile(auth.currentUser, {
        displayName: `${form.firstName} ${form.lastName}`.trim(),
        photoURL,
      });
      console.log('Auth profile updated');

      showSuccess('Profile Updated', 'Your changes have been saved.');
    } catch (err) {
      console.error('Profile save failed:', err);
      showError('Update Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (fetching) return <div>Loading profile...</div>;

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="lg">My Profile</Title>

      <Paper withBorder p="xl" radius="md">
        <Stack>
          {/* Avatar */}
          <Group>
            <Avatar
              src={avatar ? URL.createObjectURL(avatar) : user.photoURL}
              size={80}
              radius="xl"
              color="indigo"
            >
              <IconUserCircle size="3rem" />
            </Avatar>
            <div>
              <Text size="sm" fw={500}>{user.email}</Text>
              <FileInput
                placeholder="Change photo"
                accept="image/*"
                value={avatar}
                onChange={setAvatar}
                leftSection={<IconUpload size="0.9rem" />}
                size="xs"
                mt={4}
                clearable
              />
            </div>
          </Group>

          <Divider />

          {/* Name fields */}
          <Group grow>
            <TextInput
              label="First Name"
              value={form.firstName}
              onChange={(e) => handleChange('firstName')(e.currentTarget.value)}
            />
            <TextInput
              label="Last Name"
              value={form.lastName}
              onChange={(e) => handleChange('lastName')(e.currentTarget.value)}
            />
          </Group>

          <TextInput
            label="Middle Name (Optional)"
            value={form.middleName}
            onChange={(e) => handleChange('middleName')(e.currentTarget.value)}
          />

          <Group grow>
            <NumberInput
              label="Age"
              value={form.age}
              onChange={handleChange('age')}
              min={13}
              max={120}
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={handleChange('gender')}
              placeholder="Pick one"
              data={['Male', 'Female', 'Other', 'Prefer not to say']}
            />
          </Group>

          <TextInput
            label="Country"
            value={form.country}
            onChange={(e) => handleChange('country')(e.currentTarget.value)}
          />

          <TextInput
            label="Bio"
            placeholder="Tell us a little about yourself..."
            value={form.bio}
            onChange={(e) => handleChange('bio')(e.currentTarget.value)}
          />

          <Button onClick={handleSave} loading={loading} color="indigo" fullWidth mt="md">
            Save Changes
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}