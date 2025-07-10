/**
 * Field configurations for different entity types
 * These define the form fields for Create/Edit modals
 */

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) || "Please enter a valid email address";
};

// Phone validation function
const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) || "Please enter a valid phone number";
};

// Password validation function
const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return true;
};

// YouTube URL validation
const validateYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url) || "Please enter a valid YouTube URL";
};

/**
 * USER FIELD CONFIGURATION
 */
export const userFieldConfig = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "Enter first name",
    validation: (value) =>
      value.length >= 2 || "First name must be at least 2 characters",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    required: true,
    placeholder: "Enter last name",
    validation: (value) =>
      value.length >= 2 || "Last name must be at least 2 characters",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "Enter email address",
    validation: validateEmail,
    fullWidth: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter password (min. 6 characters)",
    validation: validatePassword,
    helpText: "Leave blank to keep current password (edit mode)",
  },
  {
    name: "role",
    label: "User Role",
    type: "select",
    required: true,
    placeholder: "Select user role",
    options: [
      { value: "student", label: "Student" },
      { value: "parent", label: "Parent" },
      { value: "teacher", label: "Teacher" },
      { value: "institute_admin", label: "Institute Admin" },
      { value: "zone_manager", label: "Zone Manager" },
      { value: "super_admin", label: "Super Admin" },
    ],
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
    validation: validatePhone,
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
      { value: "prefer_not_to_say", label: "Prefer not to say" },
    ],
  },
  {
    name: "institute_id",
    label: "Institute",
    type: "select",
    placeholder: "Select institute",
    options: [], // Will be populated dynamically
    helpText: "Leave blank for super admin users",
  },
  {
    name: "zone_id",
    label: "Zone",
    type: "select",
    placeholder: "Select zone",
    options: [], // Will be populated dynamically
    helpText: "Only for zone managers",
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter full address",
    rows: 3,
    fullWidth: true,
  },
  {
    name: "is_active",
    label: "Account Status",
    type: "checkbox",
    defaultValue: true,
    checkboxLabel: "Active account",
  },
];

/**
 * VIDEO FIELD CONFIGURATION - UPDATED VERSION
 */
export const videoFieldConfig = [
  {
    name: "title",
    label: "Video Title",
    type: "text",
    required: true,
    placeholder: "Enter video title",
    fullWidth: true,
    validation: (value) =>
      value.length >= 5 || "Title must be at least 5 characters",
  },
  {
    name: "youtubeVideoId", // UPDATED: Changed to match your backend
    label: "YouTube Video ID or URL",
    type: "text",
    required: true,
    placeholder: "Enter YouTube URL or Video ID",
    fullWidth: true,
    helpText: "e.g., https://youtube.com/watch?v=VIDEO_ID or just VIDEO_ID",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter video description",
    rows: 4,
    fullWidth: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    placeholder: "Select category",
    options: [
      { value: "basic", label: "Basic" }, // UPDATED: Match your constants
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
      { value: "tutorial", label: "Tutorial" },
      { value: "practice", label: "Practice" },
      { value: "assessment", label: "Assessment" },
    ],
  },
  {
    name: "difficulty", // UPDATED: Changed from difficulty_level
    label: "Difficulty Level",
    type: "select",
    required: true,
    placeholder: "Select difficulty",
    options: [
      { value: "beginner", label: "Beginner" },
      { value: "elementary", label: "Elementary" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
      { value: "expert", label: "Expert" },
    ],
  },
  {
    name: "courseOrder", // UPDATED: Changed from course_order
    label: "Course Order",
    type: "number",
    placeholder: "Enter order number",
    min: 1,
    helpText: "Order of this video in the course sequence",
  },
  {
    name: "tags",
    label: "Tags",
    type: "text",
    placeholder: "Enter tags separated by commas",
    fullWidth: true,
    helpText: "e.g., basics, math, abacus, tutorial",
  },
  {
    name: "status", // UPDATED: Simplified status
    label: "Status",
    type: "select",
    required: true,
    defaultValue: "active",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];

/**
 * INSTITUTE FIELD CONFIGURATION
 */
/**
 * INSTITUTE FIELD CONFIGURATION - UPDATED VERSION
 */
export const instituteFieldConfig = [
  {
    name: "name",
    label: "Institute Name",
    type: "text",
    required: true,
    placeholder: "Enter institute name",
    fullWidth: true,
    validation: (value) =>
      value.length >= 3 || "Institute name must be at least 3 characters",
  },
  {
    name: "code",
    label: "Institute Code",
    type: "text",
    required: true,
    placeholder: "Enter unique institute code",
    validation: (value) =>
      value.length >= 3 || "Institute code must be at least 3 characters",
    helpText: "Unique identifier for the institute",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "Enter institute email",
    validation: validateEmail,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: true,
    placeholder: "Enter phone number",
    validation: validatePhone,
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    placeholder: "Enter website URL (optional)",
    helpText: "Institute website URL",
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    required: true,
    placeholder: "Enter full address",
    rows: 3,
    fullWidth: true,
  },
  {
    name: "city",
    label: "City",
    type: "text",
    required: true,
    placeholder: "Enter city",
  },
  {
    name: "state",
    label: "State/Province",
    type: "text",
    required: true,
    placeholder: "Enter state or province",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    defaultValue: "India",
    options: [
      { value: "India", label: "India" },
      { value: "United States", label: "United States" },
      { value: "United Kingdom", label: "United Kingdom" },
      { value: "Canada", label: "Canada" },
      { value: "Australia", label: "Australia" },
      { value: "Singapore", label: "Singapore" },
      { value: "UAE", label: "UAE" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    name: "postal_code",
    label: "Postal/ZIP Code",
    type: "text",
    placeholder: "Enter postal/ZIP code",
    helpText: "Postal code or ZIP code",
  },
  {
    name: "zone_id",
    label: "Zone",
    type: "select",
    placeholder: "Select zone (optional)",
    options: [], // Will be populated dynamically
    helpText: "Assign institute to a zone for better management",
  },
  {
    name: "admin_id",
    label: "Institute Administrator",
    type: "select",
    placeholder: "Select administrator (optional)",
    options: [], // Will be populated dynamically
    helpText: "Select the user who will manage this institute",
  },
  {
    name: "established_date",
    label: "Established Date",
    type: "date",
    helpText: "When was this institute established?",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter institute description (optional)",
    rows: 4,
    fullWidth: true,
    helpText: "Brief description about the institute",
  },
  {
    name: "is_active",
    label: "Institute Status",
    type: "checkbox",
    defaultValue: true,
    checkboxLabel: "Active institute",
  },
];

/**
 * Enhanced transform function for institute data - Updated for your backend
 */
export const transformInstituteFormData = (data) => {
  const transformed = { ...data };

  // Ensure proper formatting for code (uppercase)
  if (transformed.code) {
    transformed.code = transformed.code.toUpperCase();
  }

  // Handle date formatting
  if (transformed.established_date) {
    transformed.established_date = new Date(transformed.established_date)
      .toISOString()
      .split("T")[0];
  }

  // Convert postal_code to pincode if your backend expects pincode
  if (transformed.postal_code) {
    transformed.pincode = transformed.postal_code;
  }

  // Remove empty values
  Object.keys(transformed).forEach((key) => {
    if (
      transformed[key] === "" ||
      transformed[key] === null ||
      transformed[key] === undefined
    ) {
      delete transformed[key];
    }
  });

  return transformed;
};

/**
 * ZONE FIELD CONFIGURATION
 */
export const zoneFieldConfig = [
  {
    name: "name",
    label: "Zone Name",
    type: "text",
    required: true,
    placeholder: "Enter zone name",
    fullWidth: true,
    validation: (value) =>
      value.length >= 3 || "Zone name must be at least 3 characters",
  },
  {
    name: "code",
    label: "Zone Code",
    type: "text",
    required: true,
    placeholder: "Enter unique zone code",
    validation: (value) =>
      value.length >= 2 || "Zone code must be at least 2 characters",
  },
  {
    name: "region",
    label: "Region",
    type: "select",
    required: true,
    placeholder: "Select region",
    options: [
      { value: "North", label: "North" },
      { value: "South", label: "South" },
      { value: "East", label: "East" },
      { value: "West", label: "West" },
      { value: "Central", label: "Central" },
      { value: "Northeast", label: "Northeast" },
      { value: "Southeast", label: "Southeast" },
      { value: "Southwest", label: "Southwest" },
      { value: "Northwest", label: "Northwest" },
    ],
  },
  {
    name: "manager_id",
    label: "Zone Manager",
    type: "select",
    placeholder: "Select zone manager",
    options: [], // Will be populated dynamically
    helpText: "Select the user who will manage this zone",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter zone description",
    rows: 3,
    fullWidth: true,
    helpText: "Brief description about the zone coverage area",
  },
  {
    name: "is_active",
    label: "Zone Status",
    type: "checkbox",
    defaultValue: true,
    checkboxLabel: "Active zone",
  },
];

/**
 * ASSESSMENT FIELD CONFIGURATION
 */
export const assessmentFieldConfig = [
  {
    name: "title",
    label: "Assessment Title",
    type: "text",
    required: true,
    placeholder: "Enter assessment title",
    fullWidth: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter assessment description",
    rows: 3,
    fullWidth: true,
  },
  {
    name: "difficulty_level",
    label: "Difficulty Level",
    type: "select",
    required: true,
    options: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  {
    name: "time_limit",
    label: "Time Limit (minutes)",
    type: "number",
    min: 1,
    max: 180,
    placeholder: "Enter time limit",
  },
  {
    name: "passing_score",
    label: "Passing Score (%)",
    type: "number",
    min: 0,
    max: 100,
    defaultValue: 70,
    placeholder: "Enter passing percentage",
  },
  {
    name: "max_attempts",
    label: "Maximum Attempts",
    type: "number",
    min: 1,
    max: 10,
    defaultValue: 3,
    placeholder: "Enter max attempts allowed",
  },
  {
    name: "is_active",
    label: "Assessment Status",
    type: "checkbox",
    defaultValue: true,
    checkboxLabel: "Active assessment",
  },
];

/**
 * Utility function to populate dynamic options
 */
export const populateFieldOptions = (fieldConfig, optionsData) => {
  return fieldConfig.map((field) => {
    if (field.name === "institute_id" && optionsData.institutes) {
      return {
        ...field,
        options: optionsData.institutes.map((institute) => ({
          value: institute.id,
          label: institute.name,
        })),
      };
    }

    if (field.name === "zone_id" && optionsData.zones) {
      return {
        ...field,
        options: optionsData.zones.map((zone) => ({
          value: zone.id,
          label: zone.name,
        })),
      };
    }

    if (field.name === "admin_id" && optionsData.admins) {
      return {
        ...field,
        options: optionsData.admins.map((admin) => ({
          value: admin.id,
          label: `${admin.first_name} ${admin.last_name} (${admin.email})`,
        })),
      };
    }

    if (field.name === "manager_id" && optionsData.managers) {
      return {
        ...field,
        options: optionsData.managers.map((manager) => ({
          value: manager.id,
          label: `${manager.first_name} ${manager.last_name} (${manager.email})`,
        })),
      };
    }

    return field;
  });
};

/**
 * Transform form data for API submission
 */
export const transformFormData = (data, entityType) => {
  const transformed = { ...data };

  // Common transformations
  if (transformed.tags && typeof transformed.tags === "string") {
    transformed.tags = transformed.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  // Remove empty values
  Object.keys(transformed).forEach((key) => {
    if (
      transformed[key] === "" ||
      transformed[key] === null ||
      transformed[key] === undefined
    ) {
      delete transformed[key];
    }
  });

  // Entity-specific transformations
  switch (entityType) {
    case "video":
      // Extract YouTube video ID from URL if needed
      if (
        transformed.youtube_video_id &&
        transformed.youtube_video_id.includes("youtube.com")
      ) {
        const urlParams = new URLSearchParams(
          new URL(transformed.youtube_video_id).search
        );
        transformed.youtube_video_id = urlParams.get("v");
      }
      break;

    case "user":
      // Convert role to proper format if needed
      if (transformed.role) {
        transformed.role = transformed.role.toLowerCase();
      }
      break;

    case "institute":
      // Ensure proper formatting
      if (transformed.code) {
        transformed.code = transformed.code.toUpperCase();
      }
      break;
  }

  return transformed;
};

/**
 * Get CRUD configuration for entity type
 */
export const getCrudConfig = (entityType) => {
  const configs = {
    user: {
      fields: userFieldConfig,
      itemName: "users",
      createTitle: "Create New User",
      editTitle: "Edit User",
      viewTitle: "User Details",
    },
    video: {
      fields: videoFieldConfig,
      itemName: "videos",
      createTitle: "Add New Video",
      editTitle: "Edit Video",
      viewTitle: "Video Details",
    },
    institute: {
      fields: instituteFieldConfig,
      itemName: "institutes",
      createTitle: "Create New Institute",
      editTitle: "Edit Institute",
      viewTitle: "Institute Details",
      transformData: transformInstituteFormData,
    },
    zone: {
      fields: zoneFieldConfig,
      itemName: "zones",
      createTitle: "Create New Zone",
      editTitle: "Edit Zone",
      viewTitle: "Zone Details",
    },
    assessment: {
      fields: assessmentFieldConfig,
      itemName: "assessments",
      createTitle: "Create New Assessment",
      editTitle: "Edit Assessment",
      viewTitle: "Assessment Details",
    },
  };

  return configs[entityType] || configs.user;
};
