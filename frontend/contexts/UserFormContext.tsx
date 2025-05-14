"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Form state interfaces
export interface BasicInfo {
  fullName: string;
  email: string;
  location: string;
  phone: string;
  gender: "male" | "female" | "other";
  genderOther?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  bio?: string;
  profileImage?: string | null;
  resume?: string | null;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  responsibilities?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  year: string;
}

export interface Professional {
  experienceType: "experienced" | "fresher";
  currentTitle?: string;
  currentCompany?: string;
  industry?: string;
  yearsOfExperience?: string;
  workHistory: WorkExperience[];
  internships: WorkExperience[];
}

export interface Skills {
  skills: string[];
  certifications: string[];
}

export interface Preferences {
  referralStatus: string;
  jobTypes: string[];
  locations: string[];
  targetCompanies: string[];
  termsAccepted: boolean;
}

export interface FormData {
  basic: BasicInfo;
  professional: Professional;
  education: Education[];
  skills: Skills;
  preferences: Preferences;
}

// Initialize with default values
const defaultFormData: FormData = {
  basic: {
    fullName: "",
    email: "",
    location: "",
    phone: "",
    gender: "male",
    profileImage: null,
    resume: null,
  },
  professional: {
    experienceType: "experienced",
    workHistory: [],
    internships: [],
  },
  education: [],
  skills: {
    skills: [],
    certifications: [],
  },
  preferences: {
    referralStatus: "open",
    jobTypes: [],
    locations: [],
    targetCompanies: [],
    termsAccepted: false,
  },
};

type FormContextType = {
  formData: FormData;
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateProfessional: (data: Partial<Professional>) => void;
  addWorkExperience: (experience: WorkExperience) => void;
  removeWorkExperience: (id: string) => void;
  updateWorkExperience: (
    id: string,
    experience: Partial<WorkExperience>
  ) => void;
  addInternship: (internship: WorkExperience) => void;
  removeInternship: (id: string) => void;
  updateInternship: (id: string, internship: Partial<WorkExperience>) => void;
  addEducation: (education: Education) => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  updateSkills: (data: Partial<Skills>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addCertification: (certification: string) => void;
  removeCertification: (certification: string) => void;
  updatePreferences: (data: Partial<Preferences>) => void;
  addJobType: (jobType: string) => void;
  removeJobType: (jobType: string) => void;
  addLocation: (location: string) => void;
  removeLocation: (location: string) => void;
  addTargetCompany: (company: string) => void;
  removeTargetCompany: (company: string) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("profileFormData");
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error("Error parsing form data from localStorage", error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("profileFormData", JSON.stringify(formData));
  }, [formData]);

  // Basic info
  const updateBasicInfo = (data: Partial<BasicInfo>) => {
    setFormData((prev) => ({
      ...prev,
      basic: {
        ...prev.basic,
        ...data,
      },
    }));
  };

  // Professional info
  const updateProfessional = (data: Partial<Professional>) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        ...data,
      },
    }));
  };

  // Work Experience
  const addWorkExperience = (experience: WorkExperience) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        workHistory: [...prev.professional.workHistory, experience],
      },
    }));
  };

  const removeWorkExperience = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        workHistory: prev.professional.workHistory.filter(
          (exp) => exp.id !== id
        ),
      },
    }));
  };

  const updateWorkExperience = (
    id: string,
    experience: Partial<WorkExperience>
  ) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        workHistory: prev.professional.workHistory.map((exp) =>
          exp.id === id ? { ...exp, ...experience } : exp
        ),
      },
    }));
  };

  // Internships
  const addInternship = (internship: WorkExperience) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        internships: [...prev.professional.internships, internship],
      },
    }));
  };

  const removeInternship = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        internships: prev.professional.internships.filter(
          (intern) => intern.id !== id
        ),
      },
    }));
  };

  const updateInternship = (
    id: string,
    internship: Partial<WorkExperience>
  ) => {
    setFormData((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        internships: prev.professional.internships.map((intern) =>
          intern.id === id ? { ...intern, ...internship } : intern
        ),
      },
    }));
  };

  // Education
  const addEducation = (education: Education) => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
  };

  const removeEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
  };

  // Skills
  const updateSkills = (data: Partial<Skills>) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        ...data,
      },
    }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          skills: [...prev.skills.skills, skill],
        },
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        skills: prev.skills.skills.filter((s) => s !== skill),
      },
    }));
  };

  const addCertification = (certification: string) => {
    if (!formData.skills.certifications.includes(certification)) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          certifications: [...prev.skills.certifications, certification],
        },
      }));
    }
  };

  const removeCertification = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        certifications: prev.skills.certifications.filter(
          (c) => c !== certification
        ),
      },
    }));
  };

  // Preferences
  const updatePreferences = (data: Partial<Preferences>) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...data,
      },
    }));
  };

  const addJobType = (jobType: string) => {
    if (!formData.preferences.jobTypes.includes(jobType)) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          jobTypes: [...prev.preferences.jobTypes, jobType],
        },
      }));
    }
  };

  const removeJobType = (jobType: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        jobTypes: prev.preferences.jobTypes.filter((j) => j !== jobType),
      },
    }));
  };

  const addLocation = (location: string) => {
    if (!formData.preferences.locations.includes(location)) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          locations: [...prev.preferences.locations, location],
        },
      }));
    }
  };

  const removeLocation = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        locations: prev.preferences.locations.filter((l) => l !== location),
      },
    }));
  };

  const addTargetCompany = (company: string) => {
    if (!formData.preferences.targetCompanies.includes(company)) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          targetCompanies: [...prev.preferences.targetCompanies, company],
        },
      }));
    }
  };

  const removeTargetCompany = (company: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        targetCompanies: prev.preferences.targetCompanies.filter(
          (c) => c !== company
        ),
      },
    }));
  };

  const value: FormContextType = {
    formData,
    updateBasicInfo,
    updateProfessional,
    addWorkExperience,
    removeWorkExperience,
    updateWorkExperience,
    addInternship,
    removeInternship,
    updateInternship,
    addEducation,
    removeEducation,
    updateEducation,
    updateSkills,
    addSkill,
    removeSkill,
    addCertification,
    removeCertification,
    updatePreferences,
    addJobType,
    removeJobType,
    addLocation,
    removeLocation,
    addTargetCompany,
    removeTargetCompany,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export const useFormState = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormState must be used within a FormProvider");
  }
  return context;
};
