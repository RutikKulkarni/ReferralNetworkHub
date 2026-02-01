# ReferralNetworkHub - User Flow Diagrams

## Multi-Tenant Platform Flow

This document visualizes user flows for the **ReferralNetworkHub** multi-tenant platform.

---

## 🎯 Platform-Level Flow

```mermaid
flowchart TD
    Start([Platform Entry]) --> Public{User Type?}

    Public -->|Not Logged In| PublicPages[Public Pages]
    PublicPages --> BrowseJobs[Browse Jobs]
    PublicPages --> ViewOrgs[View Organizations]
    PublicPages --> Login[Login/Signup]

    Public -->|Logged In| AuthCheck{Authenticate}
    AuthCheck --> RoleCheck{User Role?}

    RoleCheck -->|PLATFORM_SUPER_ADMIN| SuperAdminDash[Super Admin Dashboard]
    SuperAdminDash --> ManageSystem[System Configuration]
    SuperAdminDash --> ManageAdmins[Manage Platform Admins]
    SuperAdminDash --> ManageOrgs[Manage Organizations]

    RoleCheck -->|PLATFORM_ADMIN| PlatformAdminDash[Platform Admin Dashboard]
    PlatformAdminDash --> ManageAllOrgs[Manage All Organizations]
    PlatformAdminDash --> PlatformAnalytics[Platform Analytics]
    PlatformAdminDash --> CustomerSupport[Customer Support]

    RoleCheck -->|ORGANIZATION_ADMIN| OrgAdminDash[Organization Admin Dashboard]
    OrgAdminDash --> ManageEmployees[Manage Employees]
    OrgAdminDash --> ManageRecruiters[Manage Recruiters]
    OrgAdminDash --> OrgStructure[Organization Structure]
    OrgAdminDash --> HRWorkflows[HR Workflows]

    RoleCheck -->|ORG_RECRUITER| RecruiterDash[Recruiter Dashboard]
    RecruiterDash --> UnifiedDash[Unified Application Dashboard]
    RecruiterDash --> ManageJobs[Post & Manage Jobs]
    RecruiterDash --> ReviewApps[Review Applications]
    RecruiterDash --> ManagePipeline[Manage Hiring Pipeline]

    RoleCheck -->|EMPLOYEE_REFERRER| EmployeeDash[Employee Portal]
    EmployeeDash --> ViewProfile[View My Profile]
    EmployeeDash --> CreateReferral[Create Referrals]
    EmployeeDash --> TrackReferrals[Track My Referrals]
    EmployeeDash --> ApplyOtherJobs[Apply to Other Orgs]

    RoleCheck -->|JOB_SEEKER| JobSeekerDash[Job Seeker Dashboard]
    JobSeekerDash --> SearchJobs[Search Jobs]
    JobSeekerDash --> ApplyJobs[Apply to Jobs]
    JobSeekerDash --> TrackApps[Track Applications]
    JobSeekerDash --> ManageProfile[Manage Profile]

    RoleCheck -->|REFERRAL_PROVIDER| ReferralProviderDash[Referral Provider Dashboard]
    ReferralProviderDash --> ProvideReferrals[Provide Referrals]
    ReferralProviderDash --> TrackSuccess[Track Success Rate]
```

---

## 👤 Job Seeker Journey

```mermaid
flowchart LR
    Start([Job Seeker]) --> Browse[Browse Jobs]
    Browse --> ViewJob[View Job Details]
    ViewJob --> Decision{How to Apply?}

    Decision -->|Direct| DirectApply[Apply Directly]
    Decision -->|Referral| RequestRef[Request Referral]

    RequestRef --> FindReferrer[Find Employee Referrer]
    FindReferrer --> GetReferral[Receive Referral Link]
    GetReferral --> ApplyWithRef[Apply via Referral]

    DirectApply --> AppSubmit[Application Submitted]
    ApplyWithRef --> AppSubmit

    AppSubmit --> Track[Track Status]
    Track --> Pipeline{Pipeline Stage}

    Pipeline -->|Screening| Screening[Under Review]
    Pipeline -->|Interview| Interview[Interview Scheduled]
    Pipeline -->|Offer| Offer[Offer Received]
    Pipeline -->|Hired| Hired[Hired! 🎉]
    Pipeline -->|Rejected| Rejected[Not Selected]
```

---

## 👨‍💼 Recruiter Workflow

```mermaid
flowchart TD
    Recruiter([Recruiter Login]) --> Dashboard[Unified Dashboard]

    Dashboard --> ViewApps{View Applications}
    ViewApps -->|Direct Applications| DirectList[Direct Applicants]
    ViewApps -->|Referred Applications| RefList[Referred Applicants]

    DirectList --> ReviewApp[Review Application]
    RefList --> ReviewApp

    ReviewApp --> Decision{Decision}

    Decision -->|Move Forward| NextStage[Move to Next Stage]
    Decision -->|Reject| Reject[Send Rejection]

    NextStage --> StageCheck{Current Stage?}
    StageCheck -->|Screening| MoveInterview[Schedule Interview]
    StageCheck -->|Interview| MakeOffer[Make Offer]
    StageCheck -->|Offer| MarkHired[Mark as Hired]

    MarkHired --> UpdateRef[Update Referrer Bonus]
    MarkHired --> NotifyCandidate[Notify Candidate]

    Dashboard --> PostJob[Post New Job]
    PostJob --> JobLive[Job Goes Live]

    Dashboard --> Analytics[View Analytics]
    Analytics --> Metrics[Time-to-hire, Sources, Conversion]
```

---

## 🏢 Organization Admin Flow

```mermaid
flowchart TD
    OrgAdmin([Org Admin Login]) --> MainDash[Main Dashboard]

    MainDash --> HRMgmt{HR Management}
    HRMgmt --> Onboard[Onboard Employee]
    HRMgmt --> Offboard[Offboard Employee]
    HRMgmt --> ManageDepts[Manage Departments]
    HRMgmt --> OrgChart[View Org Chart]

    MainDash --> RecMgmt{Recruiter Management}
    RecMgmt --> AddRecruiter[Add Recruiter]
    RecMgmt --> AssignJobs[Assign Jobs to Recruiter]
    RecMgmt --> ViewRecPerf[View Recruiter Performance]

    MainDash --> Oversight{Oversight}
    Oversight --> AllApps[View All Applications]
    Oversight --> AllRefs[View All Referrals]
    Oversight --> OrgAnalytics[Organization Analytics]

    OrgAnalytics --> HiringMetrics[Hiring Metrics]
    OrgAnalytics --> RefProgram[Referral Program Stats]
    OrgAnalytics --> RecruiterKPIs[Recruiter KPIs]
```

---

## 🤝 Employee Referral Process

```mermaid
flowchart LR
    Employee([Employee]) --> SeeJob[See Company Job Opening]
    SeeJob --> KnowCandidate{Know a Candidate?}

    KnowCandidate -->|Yes - Internal| ReferEmployee[Refer Another Employee]
    KnowCandidate -->|Yes - External| ReferExternal[Refer External Candidate]
    KnowCandidate -->|Share Link| ShareJob[Share Job Link]

    ReferEmployee --> CreateRef[Create Referral]
    ReferExternal --> CreateRef

    CreateRef --> SendLink[Send Referral Link to Candidate]
    SendLink --> CandApplies[Candidate Applies]

    CandApplies --> RecruiterReview[Recruiter Reviews]
    RecruiterReview --> HiringProcess[Hiring Process]

    HiringProcess --> Outcome{Outcome?}
    Outcome -->|Hired| EmpBonus[Employee Gets Bonus 💰]
    Outcome -->|Not Hired| EmpTracking[Track in Dashboard]

    EmpBonus --> UpdateProfile[Profile Updated: +1 Successful Referral]
```

---

## 🔐 Authentication & Authorization Flow

```mermaid
flowchart TD
    User([User]) --> LoginPage[Login Page]
    LoginPage --> Creds[Enter Credentials]

    Creds --> Auth{Authenticate}
    Auth -->|Success| JWT[Generate JWT Tokens]
    Auth -->|Failure| Error[Show Error]

    JWT --> Session[Create Redis Session]
    Session --> RoleCheck{Check User Type}

    RoleCheck --> Route[Route to Dashboard]
    Route --> Access{Access Protected Resource}

    Access --> Validate[Validate JWT]
    Validate -->|Valid| CheckPerm{Check Permissions}
    Validate -->|Invalid| Refresh[Try Refresh Token]

    Refresh -->|Success| NewJWT[New Access Token]
    Refresh -->|Failure| Logout[Force Logout]

    CheckPerm -->|Authorized| Grant[Grant Access]
    CheckPerm -->|Unauthorized| Deny[403 Forbidden]

    Grant --> OrgScope{Organization Context?}
    OrgScope -->|Required| ValidateOrg[Validate Org Access]
    OrgScope -->|Not Required| Resource[Access Resource]

    ValidateOrg -->|Belongs to Org| Resource
    ValidateOrg -->|Wrong Org| Deny
```

---

## 📊 Application Pipeline Stages

```mermaid
flowchart LR
    Applied([Application Submitted]) --> Screening[Screening]

    Screening --> ScreenDecision{Screening Result}
    ScreenDecision -->|Pass| Interview1[Interview Round 1]
    ScreenDecision -->|Fail| Reject1[Rejected]

    Interview1 --> Int1Decision{Interview 1 Result}
    Int1Decision -->|Pass| Interview2[Interview Round 2]
    Int1Decision -->|Fail| Reject2[Rejected]

    Interview2 --> Int2Decision{Interview 2 Result}
    Int2Decision -->|Pass| Interview3[Interview Round 3]
    Int2Decision -->|Fail| Reject3[Rejected]

    Interview3 --> Int3Decision{Interview 3 Result}
    Int3Decision -->|Pass| Offer[Offer Extended]
    Int3Decision -->|Fail| Reject4[Rejected]

    Offer --> OfferDecision{Candidate Response}
    OfferDecision -->|Accept| Hired[Hired 🎉]
    OfferDecision -->|Decline| Declined[Offer Declined]
    OfferDecision -->|Counter| Negotiate[Negotiation]

    Negotiate --> FinalOffer[Final Offer]
    FinalOffer --> Hired

    Hired --> Onboard[Begin Onboarding]
```

---

## 🌐 Cross-Organization Dynamics

```mermaid
flowchart TD
    CompanyA[Company A] --> EmpA[Employee at Company A]
    CompanyB[Company B] --> JobB[Job Opening at Company B]

    EmpA --> Dual{Employee Role}
    Dual -->|As Employee| ManagedByHR[Managed by Company A HR]
    Dual -->|As Referrer| ReferToA[Refer to Company A Jobs]
    Dual -->|As Job Seeker| ApplyToB[Apply to Company B Job]

    ReferToA --> CompanyAJob[Company A Hiring Process]
    ApplyToB --> CompanyBJob[Company B Hiring Process]

    CompanyAJob --> BonusA[Earn Referral Bonus from Company A]
    CompanyBJob --> OfferB{Get Offer from Company B?}

    OfferB -->|Accept| LeaveA[Leave Company A]
    OfferB -->|Decline| StayA[Stay at Company A]

    LeaveA --> JoinB[Join Company B as Employee]
    JoinB --> NewDual[Now Can Refer to Company B]
```

---

## 📝 Notes

- All flows support **tenant isolation** - users only see data from their organization
- **RBAC** enforced at every step - permissions checked per user type
- **JWT tokens** include organization context for multi-tenant access
- **Redis sessions** track user activity across devices
- **Email notifications** sent at key stages (application received, status changes, etc.)

**Last Updated**: January 31, 2026  
**Status**: Reflects planned multi-tenant architecture (implementation in progress)
