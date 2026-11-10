export const AVAILABLE_AVATARS = [
  '/images/profile/glv1.webp',
  '/images/profile/glv2.webp',
  '/images/profile/glv3.webp',
  '/images/profile/khaitam1.webp',
  '/images/profile/khaitam2.webp',
  '/images/profile/themuc1.webp',
  '/images/profile/themuc2.webp',
  '/images/profile/vaodoi1.webp',
  '/images/profile/vaodoi2.webp',
  '/images/profile/baodong1.webp',
];

export const getRandomAvatar = (): string => {
  const index = Math.floor(Math.random() * AVAILABLE_AVATARS.length);
  return AVAILABLE_AVATARS[index];
};

export const getAvatarByName = (name: string): string => {
  if (!name) return AVAILABLE_AVATARS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVAILABLE_AVATARS.length;
  return AVAILABLE_AVATARS[index];
};
