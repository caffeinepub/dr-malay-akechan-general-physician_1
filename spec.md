# Specification

## Summary
**Goal:** Add universal hover-to-edit capability in the admin dashboard and redesign the public footer into a detailed, multi-column advanced section with a matching FooterEditor.

**Planned changes:**
- In all admin editor panels (HeroEditor, AboutEditor, ServicesEditor, ReviewsEditor, ClinicsEditor, SocialLinksEditor, FooterEditor), every displayed field value shows a pencil icon on hover; clicking it opens an inline input or small popover pre-filled with the current value and saves directly to the backend.
- Existing full-form editor UIs remain functional alongside the new hover-to-edit shortcut.
- Redesign the public `Footer` component with a branded top section (practice name, tagline, short description), a multi-column layout (Quick Links, Contact Info with icons, Opening Hours, Social Links), and a bottom bar with copyright text and a "Back to Top" button.
- Extend the `FooterEditor` in the admin dashboard to expose editable fields for practice name, tagline, short description, copyright text, contact email, contact phone, contact address, and opening hours text block, all saving to the backend.
- Extend the backend `DetailedFooter` type to accommodate the new footer fields.
- All new and modified UI uses the existing glassmorphism aesthetic, blue-purple-magenta palette, dark/light mode CSS custom properties, and Helvetica font; footer is fully responsive across mobile, tablet, and desktop.

**User-visible outcome:** Admins can quickly edit any content field inline by hovering over it in the dashboard, and site visitors see a rich, multi-column footer with contact info, quick links, opening hours, and social links.
