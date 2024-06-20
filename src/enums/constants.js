export const filePaths = {
    FILE_SAVE_BASE_PATH: 'PDFFiles/'
}

export const companyDetails = {
    PHONE_NUMBER: '+123 456 22000'
}


export const divisions = [
   
    { label: "Admin", value: "Admin" },
    { label: "Chairman", value: "Chairman" },
    { label: "Director General", value: "Director General" },
    { label: "Human Resource", value: "Human Resource" },
    { label: "Finance", value: "Finance" },
    { label: "EPC", value: "EPC" },
    { label: "Laboratory services", value: "Laboratory services" },
    { label: "NRM", value: "NRMD" },
    { label: "EIA", value: "EIA" },
    { label: "SEA", value: "SEA" },
    { label: "Environment Education", value: "Environment Education" },
    { label: "Environment Promotion", value: "Environment Promotion" },
    { label: "NEIC/library", value: "NEIC/library" },
    { label: "HWCM", value: "HWCM" },
    { label: "Solid Waste Management", value: "Solid Waste Management" },
    { label: "Compliance Monitoring", value: "Compliance Monitoring" },
    { label: "IT unit", value: "IT unit" },
    { label: "Planning Unit", value: "Planning Unit" },
    { label: "R & D Unit", value: "R & D Unit" },
    { label: "Legal", value: "Legal" },
    { label: "Internal Audit", value: "Internal Audit" },
    { label: "Investigation Unit", value: "Investigation Unit" },
    { label: "Other", value: "Other" },
];


export const unites = [
    { value: "Director General", label: "Director General" },
    { value: "HRD, Admin & Finance division", label: "HRD, Admin & Finance division" },
    { value: "Environmental Protection", label: "Environmental Protection" },
    { value: "Waste Management division", label: "Waste Management division" },
    { value: "Environmental Management and Assessment division", label: "Environmental Management and Assessment division" },
    { value: "Environmental Education and Awareness division", label: "Environmental Education and Awareness division" },
    { value: "Regional Operations division", label: "Regional Operations division" },
    { value: "Planning unit", label: "Planning unit" },
    { value: "Admin unit", label: "Admin unit" },
    { value: "Human Resources Development unit", label: "Human Resources Development unit" },
    { value: "Environmental Pollution Control unit", label: "Environmental Pollution Control unit" },
    { value: "Laboratory Services unit", label: "Laboratory Services unit" },
    { value: "Hazardous Waste & Chemicals Management unit", label: "Hazardous Waste & Chemicals Management unit" },
    { value: "Waste Management unit", label: "Waste Management unit" },
    { value: "Natural Resources Management unit", label: "Natural Resources Management unit" },
    { value: "Strategic Environmental Assessment unit", label: "Strategic Environmental Assessment unit" },
    { value: "Environmental Impact Assessment unit", label: "Environmental Impact Assessment unit" },
    { value: "Environmental Education Unit", label: "Environmental Education Unit" },
    { value: "National Environmental Information Centre", label: "National Environmental Information Centre" },
    { value: "Environmental Promotion unit", label: "Environmental Promotion unit" },
    { value: "Complaint Management Unit", label: "Complaint Management Unit" },
    { value: "Research & Development unit", label: "Research & Development unit" },
    { value: "Legal unit", label: "Legal unit" },
    { value: "Investigations unit", label: "Investigations unit" },
    { value: "Finance unit", label: "Finance unit" },
    { value: "Western Provincial Office", label: "Western Provincial Office" },
    { value: "Information Technology unit", label: "Information Technology unit" },
    { value: "Internal Audit unit", label: "Internal Audit unit" },

]

export const UserRoles = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "editor", label: "Editor" },
    

]


export const DocumentLevels = [
    { value: "DL1", label: "Document Level 1" },
    { value: "DL2", label: "Document Level 2" },
    { value: "DL3", label: "Document Level 3" },
    { value: "DL4", label: "Document Level 4" },
    
    

]


export const UserDocumentLevels = [
    { value: "DL1", label: "Document Level 1" },
    { value: "DL2", label: "Document Level 2" },
    { value: "DL3", label: "Document Level 3" },
    { value: "DL4", label: "Document Level 4" },
    { value: "DLALL", label: "All Document Levels" },
    
    

]

export const DL1_SubLevels = [
    { value: "System Manual", label: "System Manual" },
      

]

export const DL2_SubLevels = [
    { value: "Procedure Manual", label: "Procedure Manual" },
      

]


export const DL3_SubLevels = [
    { value: "Process & Guidelines", label: "Process & Guidelines" },
      

]


export const DL4_SubLevels = [
    { value: "Master list of guidelines", label: "Master list of guidelines" },
    { value: "Master list of letters", label: "Master list of letters" },
    { value: "Master list of records", label: "Master list of records" },
    { value: "Master list of forms", label: "Master list of forms" },
      

]

export const AllSubLevels = [
    ...DL1_SubLevels,
    ...DL2_SubLevels,
    ...DL3_SubLevels,
    ...DL4_SubLevels,
  ];
  

export const DLALL_SubLevels = [
    { value: "ALL", label: "All" },
   
      

]

export const OtherCircularsSites = [
    { value: "https://www.pubad.gov.lk/web/index.php?option=com_circular&view=circulars&Itemid=176&lang=en", label: "Public Administration" },
    { value: "https://moe.gov.lk/ministry/circulars/", label: "MOE" },
    { value: "https://psc.gov.lk/index.php?option=com_circular&view=circulars&Itemid=196&lang=en", label: "Public Service Commission" }, 
    
    

]

export const perTypes = [
    { value: "H", label: "Hour" },
    { value: "D", label: "Day" },
    { value: "M", label: "Month" },
    { value: "Y", label: "Year" },
];

export const RoleEnum = {
    ADMIN: 'Admin',
    EDITOR: 'editor',
    USER: 'user',
  };

  // Enum for notification placements
  export const NotificationPlacement = {
    TOP_RIGHT: 'topRight',
    TOP_LEFT: 'topLeft',
    BOTTOM_RIGHT: 'bottomRight',
    BOTTOM_LEFT: 'bottomLeft',
    TOP_CENTER: 'topCenter',
    BOTTOM_CENTER: 'bottomCenter',
  };
  

  // Enum for notification types
  export const NotificationType = {
    SUCCESS: 'success',
    INFO: 'info',
    ERROR: 'error',
    WARNING: 'warning',
  };
  