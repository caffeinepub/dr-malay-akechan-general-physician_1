import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Clinic {
    mapLink: string;
    name: string;
    photoImageId?: ImageId;
    address: string;
    phone: string;
}
export interface PatientReview {
    date: bigint;
    reviewText: string;
    patientName: string;
    rating: bigint;
}
export interface AboutSection {
    bioText: string;
    photoImageId?: ImageId;
}
export interface Image {
    id: string;
    data: Uint8Array;
    mimeType: string;
    filename: string;
    uploadedAt: bigint;
}
export interface SocialLink {
    url: string;
    platform: string;
}
export interface Service {
    title: string;
    description: string;
    iconImageId?: ImageId;
}
export interface MedicalPracticeContent {
    clinics: Array<Clinic>;
    aboutSection?: AboutSection;
    heroSection?: HeroSection;
    socialLinks: Array<SocialLink>;
    patientReviews: Array<PatientReview>;
    services: Array<Service>;
    footer?: DetailedFooter;
}
export interface HeroSection {
    tagline: string;
    backgroundImageId?: ImageId;
    headline: string;
    subheadline: string;
}
export interface DetailedFooter {
    tagline: string;
    copyrightText: string;
    practiceName: string;
    shortDescription: string;
    address: string;
    openingHours: string;
    contactEmail: string;
    phone: string;
}
export type ImageId = string;
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addClinic(name: string, address: string, phone: string, mapLink: string, photoImageId: ImageId | null): Promise<void>;
    addPatientReview(patientName: string, reviewText: string, rating: bigint, date: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createService(title: string, description: string, iconImageId: ImageId | null): Promise<void>;
    deleteImage(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(): Promise<MedicalPracticeContent>;
    getImage(id: string): Promise<Image | null>;
    getSiteTheme(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listImages(): Promise<Array<Image>>;
    login(username: string, password: string): Promise<string | null>;
    logout(token: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAboutSection(section: AboutSection): Promise<void>;
    setClinics(clinics: Array<Clinic>): Promise<void>;
    setFooter(footer: DetailedFooter): Promise<void>;
    setHeroSection(section: HeroSection): Promise<void>;
    setPatientReviews(reviews: Array<PatientReview>): Promise<void>;
    setServices(services: Array<Service>): Promise<void>;
    setSiteTheme(themeName: string): Promise<void>;
    setSocialLinks(links: Array<SocialLink>): Promise<void>;
    uploadImage(filename: string, mimeType: string, data: Uint8Array): Promise<ImageId>;
    validateToken(token: string): Promise<boolean>;
}
