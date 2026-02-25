import Map "mo:core/Map";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// No migration on upgrades

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ImageId = Text;

  type HeroSection = {
    headline : Text;
    subheadline : Text;
    tagline : Text;
    backgroundImageId : ?ImageId;
  };

  type AboutSection = {
    bioText : Text;
    photoImageId : ?ImageId;
  };

  type Service = {
    title : Text;
    description : Text;
    iconImageId : ?ImageId;
  };

  type PatientReview = {
    patientName : Text;
    reviewText : Text;
    rating : Int;
    date : Int;
  };

  type Clinic = {
    name : Text;
    address : Text;
    phone : Text;
    mapLink : Text;
    photoImageId : ?ImageId;
  };

  type SocialLink = {
    platform : Text;
    url : Text;
  };

  type DetailedFooter = {
    practiceName : Text;
    tagline : Text;
    shortDescription : Text;
    copyrightText : Text;
    contactEmail : Text;
    phone : Text;
    address : Text;
    openingHours : Text;
  };

  type MedicalPracticeContent = {
    heroSection : ?HeroSection;
    aboutSection : ?AboutSection;
    services : [Service];
    patientReviews : [PatientReview];
    clinics : [Clinic];
    socialLinks : [SocialLink];
    footer : ?DetailedFooter;
  };

  type Image = {
    id : Text;
    filename : Text;
    mimeType : Text;
    data : Blob;
    uploadedAt : Int;
  };

  type UserProfile = {
    name : Text;
    email : ?Text;
  };

  var content : MedicalPracticeContent = {
    heroSection = null;
    aboutSection = null;
    services = [];
    patientReviews = [];
    clinics = [];
    socialLinks = [];
    footer = null;
  };

  let images = Map.empty<Text, Image>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let validTokens = Map.empty<Text, Bool>();

  var tokenCounter : Nat = 0;
  var siteTheme : Text = "blue-purple-magenta";

  func generateUniqueId() : Text {
    tokenCounter += 1;
    let t = Int.toText(Time.now());
    let c = Nat.toText(tokenCounter);
    t # "-" # c;
  };

  // ---- User Profile Functions (required by instructions) ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ---- Content Management (Admin only) ----

  public shared ({ caller }) func setHeroSection(section : HeroSection) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update the hero section");
    };
    content := { content with heroSection = ?section };
  };

  public shared ({ caller }) func setAboutSection(section : AboutSection) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update the about section");
    };
    content := { content with aboutSection = ?section };
  };

  public shared ({ caller }) func setFooter(footer : DetailedFooter) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update the footer");
    };
    content := { content with footer = ?footer };
  };

  public shared ({ caller }) func createService(title : Text, description : Text, iconImageId : ?ImageId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create services");
    };
    let newService : Service = {
      title;
      description;
      iconImageId;
    };
    content := { content with services = content.services.concat([newService]) };
  };

  public shared ({ caller }) func setServices(services : [Service]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set services");
    };
    content := { content with services = services };
  };

  public shared ({ caller }) func addPatientReview(patientName : Text, reviewText : Text, rating : Int, date : Int) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add patient reviews");
    };
    let review : PatientReview = { patientName; reviewText; rating; date };
    content := { content with patientReviews = content.patientReviews.concat([review]) };
  };

  public shared ({ caller }) func setPatientReviews(reviews : [PatientReview]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set patient reviews");
    };
    content := { content with patientReviews = reviews };
  };

  public shared ({ caller }) func addClinic(name : Text, address : Text, phone : Text, mapLink : Text, photoImageId : ?ImageId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add clinics");
    };
    let clinic : Clinic = { name; address; phone; mapLink; photoImageId };
    content := { content with clinics = content.clinics.concat([clinic]) };
  };

  public shared ({ caller }) func setClinics(clinics : [Clinic]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set clinics");
    };
    content := { content with clinics = clinics };
  };

  public shared ({ caller }) func setSocialLinks(links : [SocialLink]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set social links");
    };
    content := { content with socialLinks = links };
  };

  // ---- Public Read Functions (no auth required) ----

  public query func getContent() : async MedicalPracticeContent {
    content;
  };

  // ---- Image Management ----

  public shared ({ caller }) func uploadImage(filename : Text, mimeType : Text, data : Blob) : async ImageId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upload images");
    };
    let id = generateUniqueId();
    let image : Image = {
      id;
      filename;
      mimeType;
      data;
      uploadedAt = Time.now();
    };
    images.add(id, image);
    id;
  };

  public query func getImage(id : Text) : async ?Image {
    images.get(id);
  };

  public query func listImages() : async [Image] {
    images.values().toArray();
  };

  public shared ({ caller }) func deleteImage(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete images");
    };
    images.remove(id);
  };

  // ---- Admin Authentication ----
  // Simple username/password login returning a session token.
  // The token is stored in stable memory and validated by validateToken.

  public shared func login(username : Text, password : Text) : async ?Text {
    if (username == "malay" and password == "duke46") {
      let token = generateUniqueId();
      validTokens.add(token, true);
      ?token;
    } else {
      null;
    };
  };

  public query func validateToken(token : Text) : async Bool {
    switch (validTokens.get(token)) {
      case (?true) { true };
      case (_) { false };
    };
  };

  public shared func logout(token : Text) : async () {
    validTokens.remove(token);
  };

  // ---- Site Theme Management ----

  public query func getSiteTheme() : async Text {
    siteTheme;
  };

  public shared ({ caller }) func setSiteTheme(themeName : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set the site theme");
    };
    siteTheme := themeName;
  };
};
