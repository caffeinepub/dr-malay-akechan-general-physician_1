import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MedicalPracticeContent, Image, HeroSection, AboutSection, Service, PatientReview, Clinic, SocialLink, DetailedFooter } from '../backend';

// ---- Content Queries ----

export function useGetContent() {
  const { actor, isFetching } = useActor();
  return useQuery<MedicalPracticeContent>({
    queryKey: ['content'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContent();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Image Queries ----

export function useListImages() {
  const { actor, isFetching } = useActor();
  return useQuery<Image[]>({
    queryKey: ['images'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImage(id: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Image | null>({
    queryKey: ['image', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getImage(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// ---- Admin Auth ----

export function useLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = await actor.login(username, password);
      return token;
    },
  });
}

export function useValidateToken() {
  const { actor, isFetching } = useActor();
  const token = sessionStorage.getItem('adminToken') || '';
  return useQuery<boolean>({
    queryKey: ['validateToken', token],
    queryFn: async () => {
      if (!actor || !token) return false;
      return actor.validateToken(token);
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 30000,
  });
}

export function useLogout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.logout(token);
    },
    onSuccess: () => {
      sessionStorage.removeItem('adminToken');
      queryClient.invalidateQueries({ queryKey: ['validateToken'] });
    },
  });
}

// ---- Admin Content Mutations ----

export function useSetHeroSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (section: HeroSection) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setHeroSection(section);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useSetAboutSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (section: AboutSection) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setAboutSection(section);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useSetServices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (services: Service[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setServices(services);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useSetPatientReviews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviews: PatientReview[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setPatientReviews(reviews);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useSetClinics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clinics: Clinic[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setClinics(clinics);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useSetSocialLinks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (links: SocialLink[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setSocialLinks(links);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useSetFooter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (footer: DetailedFooter) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setFooter(footer);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content'] }),
  });
}

export function useUploadImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ filename, mimeType, data }: { filename: string; mimeType: string; data: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadImage(filename, mimeType, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images'] }),
  });
}

export function useDeleteImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteImage(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images'] }),
  });
}

export function useGetSiteTheme() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ['siteTheme'],
    queryFn: async () => {
      if (!actor) return 'blue-purple-magenta';
      return actor.getSiteTheme();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

export function useSetSiteTheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (themeName: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setSiteTheme(themeName);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['siteTheme'] }),
  });
}
